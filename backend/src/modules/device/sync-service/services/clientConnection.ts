
import { databaseInstance } from "../../../../config/db";
import { logger } from "../../../../libs/logger";
import { ClientConsumer} from "./clientConsumer";
import { Publisher } from "./publisher";
import { RMQExchange } from "../rmq/base/rmqExchange";
import { WebSocket } from "../websocket/server";
import { response } from "express";

var localConstant = require("../../utils/constants")


export interface ClientConnectionMethods {
    getConsumerExchange() : RMQExchange
    getPublisherExchange() : RMQExchange
    onDisconnectCallback(cc: ClientConnection) : void
    createNotificationConsumer(deviceId: string, tenantId: string) : Boolean
    removeNotificationConsumer(deviceId: string, tenantId: string) : Boolean
    processRequest(req: string) : Promise<string>
  } 

export class ClientConnection {

    consumer: ClientConsumer | null
    publisher: Publisher | null
    webSocket: WebSocket | null
    clientConMethod: ClientConnectionMethods | undefined 
    tenantId : string = ""
    deviceType : string = ""
    deviceIdentifier : string  = ""
    clientIdentifier : string  = "" 
    seqNo : number = 0
    reSyncData: boolean = false

    constructor() {
        this.consumer = null
        this.publisher = null
        this.webSocket = null
        this.processRequest = this.processRequest.bind(this)

    }

    init(socket:WebSocket, method: ClientConnectionMethods) {
        try{
            this.webSocket = socket
            this.clientConMethod = method
            logger.info(`Tenant ${socket.tenantId} with mobile HHD or deviceManger ${socket.deviceIdentifier} is connected`)
            this.tenantId = socket.tenantId
            this.deviceType = socket.deviceType
            this.deviceIdentifier = socket.deviceIdentifier
            this.clientIdentifier = socket.clientIdentifier            
            
            this.consumer = new ClientConsumer()
            this.consumer.init(this.webSocket, method.getConsumerExchange())

            this.publisher = new Publisher()
            this.publisher.init(method.getPublisherExchange())

            method.createNotificationConsumer(this.deviceIdentifier,this.tenantId)
            
            this.setupSocketCallbacks()
            
            
        } catch (e: any){
            logger.error(`Exception caught in init with : ${e.message}`)
        }
        

    }

    setupSocketCallbacks() {
        // rcv tag data from device manager or mobile HHD
        logger.debug("Inside setupSocketCallbacks....")
        this.webSocket?.on('notification', async (data: any) => {
            this.processNotification(data)
        });

        // on create queue
        this.webSocket?.on('request', (data: any) => { this.processRequest(data) });

        //check tags
        this.webSocket?.on('error', (data: any)=>{ this.onSocketError(data)})

        // on socket disconnect
        this.webSocket?.on('disconnect', (socket: any) => { this.onSocketDisconnect(socket) })
    }

    onSocketError(error: any) {
        logger.error('Socket error detected ', error, this.deviceIdentifier, this.tenantId)
    }

    onSocketDisconnect(socket: WebSocket) {
        logger.info('Client disconnected for device and tenant', this.deviceIdentifier, this.tenantId)
        this.consumer?.close()
        this.publisher?.close()
        this.clientConMethod?.onDisconnectCallback(this)
        this.consumer = null
        this.publisher = null
        this.webSocket = null
    }


    close() {
        try{
            this.consumer = null
            this.publisher = null
            this.webSocket = null
        } catch (e: any){
            logger.error()
        }
    }

    async processRequest(data: string) {
         let response : string | undefined 
        try{
            //TODO 
            logger.debug('received request:',data)
            var req = JSON.parse(data)
            if(req.msgType != localConstant.SyncMessageType.REQUEST) {
                logger.error("Getting Error in msg Type:")
                return
            }
            response = await this.clientConMethod?.processRequest(data)
            let msg: any = {}
            msg.msgType = localConstant.SyncMessageType.RESPONSE
            msg.type = req.type
            msg.seqNo = req.seqNo
                msg.data = response
           
            this.webSocket?.emit("response", msg)
            logger.debug(`ProcessRequest : `,msg)
        } catch (e: any){
            logger.error(`Exception caught in sending response to a request: ${data} and ${response} with `, e)
        }
    }

    async processNotification(notification: string) {
        try{
            logger.debug("Notification message..", notification)
            var message = JSON.parse(notification)
            logger.debug("Message inside processNotification...", message)
            if(message.msgType != localConstant.SyncMessageType.NOTIFICATION)
            {
                logger.error("Incorrect notification message",notification)
                return
            }
            this.publisher?.processNotification(message, this.tenantId, this.deviceIdentifier)
            logger.debug(`processNotification : ${notification}`)
        } catch (e: any){
            logger.error()
        }
    }

    
}