
import * as RMQ from 'amqp-ts'
import { logger } from "../../../../libs/logger"
import { deviceQueueConfig, getBindingKeyForDMQConsumer, QMessageFormat, RMQExchangeConfig, RMQQMsgType } from "../rmq/helpers/rmqConfig";

import { RMQExchange } from "../rmq/base/rmqExchange";
import { SocketConnection, WebSocket } from "../websocket/server";
import { ClientConnection, ClientConnectionMethods } from "./clientConnection";
import { tagExternalCommInstance } from "../../services/tagExternalComm"
import { ClientSyncInfo } from '../models/clientSyncInfo';
import { Op } from 'sequelize';
import { convertTSepTimeToYYMMDDHHMMSS, getEntityColumnByName } from '../../utils/utilityFunctions';
import axios from 'axios';
import { ExternalCommInstance } from './externalComm'


var localConstant = require("../../utils/constants")

class SyncService implements ClientConnectionMethods {

    solutionToDeviceExchange: RMQExchange | undefined
    deviceToSolutionExchange: RMQExchange | undefined
    websocketConn: WebSocket | undefined
    httpServer: any
    clientList: Array<ClientConnection> | undefined
    notificationQueueMap: Map<string, RMQ.Queue> | undefined
    socketConnections: SocketConnection | undefined

    constructor() {
        this.init = this.init.bind(this)
    }

    init(server: any) {
        logger.debug('SyncService init called')
        this.httpServer = server
        this.solutionToDeviceExchange = new RMQExchange(process.env.RABBITMQ_URL || "amqp://localhost:5672")
        this.solutionToDeviceExchange.init(RMQExchangeConfig.SolutionToDeviceExchangeName, RMQExchangeConfig.SolutionToDeviceExchangeType, {})

        this.deviceToSolutionExchange = new RMQExchange(process.env.RABBITMQ_URL || "amqp://localhost:5672")
        this.deviceToSolutionExchange.init(RMQExchangeConfig.DeviceToSolutionExchangeName, RMQExchangeConfig.DeviceToSolutionExchangeType)

        this.clientList = []
        this.notificationQueueMap = new Map()
        this.socketConnections = new SocketConnection(this)

    }

    onNewConnection(socket: WebSocket) {
        const client = new ClientConnection()
        client.init(socket, this)
        this.clientList?.push(client)
    }

    getConsumerExchange(): RMQExchange {
        return this.solutionToDeviceExchange!!
    }

    getPublisherExchange(): RMQExchange {
        return this.deviceToSolutionExchange!!
    }

    onDisconnectCallback(cc: ClientConnection) {
        cc.close()
    }

    createNotificationConsumer(deviceId: string, tenantId: string): Boolean {
        // queue configdeviceType
        logger.debug("TenantId and deviceId in createNotificationConsumer ", deviceId, tenantId)
        const deviceToSolutionQ = `${tenantId}-notification` //queue populated from device side data
        logger.debug("device to solution queue", deviceToSolutionQ)
        const bindingKeyDevToSolQ = getBindingKeyForDMQConsumer(tenantId, deviceId)//.then((data: string[])=> {return data});
        logger.debug("device to solution queue", bindingKeyDevToSolQ)


        // create queue for solution side data
        logger.debug("Device queue config for createNotificationConsumer", deviceQueueConfig)
        let mQueue: RMQ.Queue | undefined

        mQueue = this.deviceToSolutionExchange?.initQueue(deviceToSolutionQ, bindingKeyDevToSolQ, deviceQueueConfig)
        // logger.debug("queue for the createNotificationConsumer", mQueue)
        if (mQueue && !mQueue?._consumerTag) {
            let consumerTag = mQueue?.activateConsumer(this.onConsumeNotification, {
                manualAck: true,
            })
            logger.info(`notification consumer activated for ${mQueue?._name} :`, consumerTag)
        }
        this.notificationQueueMap?.set(deviceToSolutionQ, mQueue!!)
        // logger.info(`notification consumer activated for ${mQueue?._name} :`, consumerTag)
        return true
    }

    removeNotificationConsumer(deviceId: string, tenantId: string): Boolean {
        let key = `${deviceId}-${tenantId}-notification`
        let queue = this.notificationQueueMap?.get(key)
        this.notificationQueueMap?.delete(key)
        queue?.delete() //TODO ask Akanksha about deleting consumer

        return true
    }

    onConsumeNotification(message: RMQ.Message) {
        try {
            const data = message.getContent();
            logger.debug("Data inside onConsumeNotification >>", data)
            //TODO process TagRead event
            //to call deviceManager function
            if (data?.type === RMQQMsgType.TAG) {
                logger.debug(`tag data read from notification consumer`)
                logger.debug("type of data in onConsumeNotification...", data.type)
                tagExternalCommInstance.commonDataProcessingExComm(data).then((result: any) => {
                    logger.info("Successfully added tag data")
                    return message.ack(true)
                }).catch((err: any) => {
                    logger.error("Failed to add tag data", err)
                   // return message.ack(true)
                })
            } else if (data?.type === RMQQMsgType.DEVICE) {
                //call device function
            }

            //deviceManager will call TagManagement Module
        } catch (e: any) {
            logger.error(`exception caught in onNotificationMessage with: ${e.message}`)
        }

    }

    async processRequest(req: string): Promise<string> {
        let body = JSON.parse(req)
        let action = body?.type

        try{
        switch (action) {
            case 'expected-count':
                let expectedCount = await ExternalCommInstance.expectedCount(req)
                logger.info("last valid counter for expected-count", expectedCount)
                return JSON.stringify(expectedCount);

            case 'full count':
                let fullCount = await ExternalCommInstance.expectedCount(req)
                logger.info("last valid counter for full count", fullCount)
                return JSON.stringify(fullCount)

            case 'check-tag':
                //let tagData = await tagExternalCommInstance.digitizedTagReadByIdExComm(body?.data?.tagId)
                 let tagData = await tagExternalCommInstance.checkTagReadByIdSyncExComm(body?.data?.tagId)
                logger.info("tag data for check-tag", tagData?.data)
                return tagData?.data?.result;


            default:
                logger.error("action type is not valid")
                return ''

        }
    }catch(e:any){
        return '';
    }


    }

    publishMessage(data: QMessageFormat) {
        try {
            if (!data || !data.tenantId) {
                logger.error(`Data or tenant id is null `)
                return false
            }
            logger.debug(`Publishing message to Solution queue for tenant ${data.tenantId}`)
            let routingKey = `${data.tenantId}.${localConstant.RoutingKey.ALL}`
            this.solutionToDeviceExchange?.sendMessage(data, routingKey)
            return true
        } catch (e: any) {
            logger.error(`Exception caught in publishing message to Solution queue ${e.error}`)
            return false
        }
    }

}

export const syncServiceInstance = new SyncService()

export function intializeSyncService(server: any) {
    syncServiceInstance.init(server)

}

export async function publishEntity(data: QMessageFormat) {
    try{
        logger.debug("SyncService PublishEntity called with data : ", data)
        let result = syncServiceInstance.publishMessage(data)
        if (!result) {
            logger.error(`Failed to publish entity`)
        } else {
            const updatedAt = data?.data?.updatedAt ? data?.data?.updatedAt : new Date().toISOString();
            const columnName = await getEntityColumnByName(data.entity);
            const formattedTime = data?.data?.updatedAt ? updatedAt : await convertTSepTimeToYYMMDDHHMMSS(updatedAt);
            await ClientSyncInfo.update({ [columnName]: formattedTime },
                {
                    where: {
                        tenantId: {
                            [Op.in]: [data?.tenantId, 'cloud']
                        }
                    }
                }
            )
        }
    }catch(error:any)
    {
        logger.error("Error at publishEntity  called with data in sync service==>",error.message)   
    }

}

export { SyncService }

