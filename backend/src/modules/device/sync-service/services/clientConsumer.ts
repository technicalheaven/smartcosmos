import * as RMQ from 'amqp-ts'
import { FAILURE, SUCCESS } from '../../../../core/controllers/constants'
import { logger } from '../../../../libs/logger'
import { WebSocket } from '../websocket/server'
import { getBindingKeyForSolQConsumer, QMessageFormat, RMQQMsgType, solutionQueueConfig, SyncDataAction, SyncDataEntity } from '../rmq/helpers/rmqConfig'
import { RMQExchange } from '../rmq/base/rmqExchange'
import { Exception } from '../../../../middlewares/resp-handler'
import { ClientSyncInfo } from '../models/clientSyncInfo'
import axios from 'axios'
import { config } from '../../../../config'
import { DeviceConfig } from '../../models/deviceConfig'
import { Op } from 'sequelize'
import { DeviceSiteZoneProcess } from '../../models/deviceSiteZoneProcess'
import { DeviceTypeModel } from '../../models/deviceTypeModel'
import { convertTSepTimeToYYMMDDHHMMSS } from '../../utils/utilityFunctions'

var localConstant = require("../../utils/constants")



export class ClientConsumer {
    connection: RMQ.Connection | undefined | null
    exchange: RMQExchange | undefined
    queue: RMQ.Queue | undefined
    socket: WebSocket | undefined | null

    tenantId: string = ""
    deviceType: string = ""
    deviceIdentifier: string = ""
    clientIdentifier: string = ""
    seqNo : number = 0
    reSyncData : boolean = false
    consumerTag: any | undefined

    constructor() {

    }

    async init(socket: WebSocket, exchange: RMQExchange) {
        this.socket = socket
        this.exchange = exchange
        this.tenantId = socket.tenantId
        this.deviceType = socket.deviceType
        this.deviceIdentifier = socket.deviceIdentifier
        this.clientIdentifier = socket.clientIdentifier
        this.reSyncData = socket.reSyncData === true || socket.reSyncData === 'true'  ?  JSON.parse(socket.reSyncData) : false; 

        // queue configdeviceType
        const solutionToDeviceQ = `${this.deviceIdentifier}-${this.tenantId}-solutionQueue` //queue populated from solution side data
        // const queueNameForDMQ = `${tenantId}-DMOrHHDQueue` // queue populated from device manager or HHD side data
        const bindingKeySolQ = await getBindingKeyForSolQConsumer(this.tenantId, this.deviceIdentifier);
        // const bindingKeyDMQ = await getBindingKeyForDMQConsumer(tenantId, deviceIdentifier);

        // create queue for solution side data
        this.queue = this.exchange?.initQueue(solutionToDeviceQ, bindingKeySolQ, solutionQueueConfig)

        // now sync existing data based on last sync if required
        await this.syncExistingData()

        // init consumer for solution side data and update existing data syncinf status

        await this.subscribeQueue().then((result:any)=>{
            logger.debug('Successfully subscribed queue', this.queue?.name);
        }).catch((err:any)=>{
            logger.error('Failed to subcribe queue')
        })

    }

    close() {
        this.queue?.stopConsumer();
        //TODO remoce consumer from the queue
        this.socket = null
    }

    async subscribeQueue() {
        try {
            this.consumerTag = await this.queue?.activateConsumer(this.onMessage, {
                manualAck: true,
            })
    
            logger.info(`consumer activated for ${this.queue?._name} :`, this.consumerTag)
        } catch (e: any) {
            logger.error('Failed to activate consumer with exception ', e.message)
        }
        

        // store client and consumer tag in clientConsumerMapArray
        // clientConsumerMap.push({ clientKey: clientIdentifier, consumerTag: consumerTag?.consumerTag, queue: queue })
        // console.log("clientConsumerMap in cosumerInit..", clientConsumerMap);

    }

    onMessage = (message: RMQ.Message) => {
        try {
            const data = message.getContent();
            const consumerTag = message.fields?.consumerTag
            if(data == null) {
                logger.error('Null data recieved in onMessage', data);
                return message.ack(true)
            }
            if (!data?.type || (data?.type !== RMQQMsgType.TAG && data?.type !== RMQQMsgType.CONFIG && data?.type !== RMQQMsgType.BULK)) {
                logger.error('Received invalid data from queue');
                return message.ack(true)
            }
            logger.info("before emitting message")
            this.sendConfigMessage(data).then((result: any) => {
                logger.debug("Inside then with result", result)
                return message.ack(true)
            }).catch((err: any) => {
                logger.error('Failed to ack message for config')
                return
            })

            // if data received from devicemanager or HHD queue
            //   if (data?.type === RMQQMsgType.TAG) {
            //     this.syncTagData(data).then(() => {
            //       return message.ack(true)
            //     }).catch((err: any) => {
            //       logger.error('Failed to ack message for Tag', err)
            //       return
            //     })
            //   }

        } catch (err: any) {
            logger.error('failed to process message received from queue', message.getContent(), err.message);
            return
        }

    }

    async sendConfigMessage(data: any) {
        let message: any = {};
        message.msgType = localConstant.SyncMessageType.SYNCCONFIGDATA
        message.type = ""
        message.seqNo = this.seqNo++
        message.data = data
       return this.emitMsg(message)

    }


    async emitMsg(data: any) {
        try {
            logger.info("Data for emit..")
            this.socket?.emit('sync-config-data', data)
            return Promise.resolve(SUCCESS)
        } catch (err: any) {
            logger.error(`Failed to emit msg data ${data}`)
            return Promise.reject(FAILURE)
        }


    }
    /**
     * This function is responsible to sync all initial data with newly connected client
     * It will send all data to cloud Station and only tenant specific data for HHD and OnPrem
     * This is called when a socket connection is established
     * @returns 
     */
    async syncExistingData() {

        logger.info('syncExistingData: ', this.deviceIdentifier, this.deviceType, this.tenantId)
        try {
            // delete existing sync info in case of reSync data
            if(this.reSyncData) await ClientSyncInfo.destroy({ where: { deviceId: this.deviceIdentifier, deviceType: this.deviceType } })

            let clientSyncInfo = await ClientSyncInfo.findOne({ where: { deviceId: this.deviceIdentifier, deviceType: this.deviceType }, raw: true });
            logger.debug('clientsyncinfo findone ', clientSyncInfo)
            if (clientSyncInfo?.isExistingDataSynced) {
                logger.info('Existing data is already synced for device', this.deviceIdentifier)
                return Promise.resolve(true)
            }
            if(!clientSyncInfo) {
                // first time syncing: clientSyncInfo object does not exist 
                const data = {
                    deviceId: this.deviceIdentifier,
                    deviceType: this.deviceType,
                    tenantId: this.tenantId ? this.tenantId : '',
                    isExistingDataSynced: false, 
                   // queueCreatedAt: await convertTSepTimeToYYMMDDHHMMSS(new Date().toISOString())
                }
                logger.debug('clientsyncinfo creating..')
                clientSyncInfo = await ClientSyncInfo.create(data)
                logger.debug('clientsyncinfo:', clientSyncInfo)
            }

            

            //This function obtains data for each entity in the decreasing order of update time and 
            //send this data to the device. After successful sending of the data to the devic, it 
            //updates the ClientSyncInfo table for that device and entity with the latest updated time
            //of data for that entity 
            logger.info("Syncing Tenants..")
             await this.syncTenants(clientSyncInfo)
            logger.info("Syncing Sites..")
             await this.syncSites(clientSyncInfo)
            logger.info("Syncing Zones..")
             await this.syncZones(clientSyncInfo)
            logger.info("Syncing Users..")
              await this.syncUsers(clientSyncInfo)
            logger.info("Syncing Products..")
             await this.syncProducts(clientSyncInfo)
            logger.info("Syncing Devices..")
              await this.syncDevices(clientSyncInfo)
            logger.info("Syncing Process..")
            await this.syncProcess(clientSyncInfo)
            logger.info("Syncing Workflow..")
            await this.syncWorkflows(clientSyncInfo)
            logger.info("Syncing StateMachine..")
            await this.syncStateMachine(clientSyncInfo)
            logger.info("Syncing NodeWorkflow..")
            await this.syncNodeWorkflows(clientSyncInfo)

            this.updateSyncingStatus(this.deviceIdentifier, this.tenantId)
            await this.syncAcknowledge();
            logger.info('Successfully synced existing data for device', this.deviceIdentifier)
            return Promise.resolve(true)
        } catch (err: any) {
            logger.error('Failed to sync existing data for device', this.deviceIdentifier, err.message);
            return Promise.reject(false)
        }

    }

    async syncTenants(clientSyncInfo: ClientSyncInfo) {
        try {
            if (clientSyncInfo?.tenantSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                let tenants: any = []
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.tenantSyncedAt ? clientSyncInfo?.tenantSyncedAt : ''
                logger.info('fetching data for tenants')
                if (this.tenantId == localConstant?.CLOUD)
                    tenants = await this.fetchExistingData(to, from, localConstant.TENANT_END_POINTS.TENANTS)
                else {
                    let tenantsResponse = await this.fetchExistingData(to, from, `${localConstant.TENANT_END_POINTS.TENANTBYID}/${this.tenantId}`)
                    tenants = {
                        statusCode: tenantsResponse.statusCode,
                        result: { rows: [tenantsResponse.result] },
                    }
                }
                logger.debug("Sync Tenant Data...", tenants)
                this.sendSyncExistingData(tenants?.result?.rows, SyncDataEntity.TENANTS)
            }
            logger.info("Succesfully sync Tenants")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync Tenants")
            return Promise.reject(err)
        }

    }

    async syncSites(clientSyncInfo: ClientSyncInfo) {
        try {
            let sites = []
            // fetch sites
            if (clientSyncInfo?.siteSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.siteSyncedAt ? clientSyncInfo?.siteSyncedAt : ''
                logger.info('fetching data for sites')
                sites = await this.fetchExistingData(to, from, localConstant.SITE_END_POINTS.SITES, this.tenantId)
                this.sendSyncExistingData(sites?.result?.rows, SyncDataEntity.SITES)

            }
            logger.info("Succesfully sync Sites")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync Sites")
            return Promise.reject(err)
        }

    }
    async syncZones(clientSyncInfo: ClientSyncInfo) {
        try {
            let zones = []
            // fetch zones
            if (clientSyncInfo?.zoneSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.zoneSyncedAt ? clientSyncInfo?.zoneSyncedAt : ''
                logger.info('fetching data for zones',this.tenantId)
                zones = await this.fetchExistingData(to, from, localConstant.ZONE_END_POINTS.ZONES, this.tenantId)
                this.sendSyncExistingData(zones?.result?.rows, SyncDataEntity.ZONES)
            }
            logger.info("Succesfully sync Zones")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync Zones")
            return Promise.reject(err)
        }

    }
    async syncUsers(clientSyncInfo: ClientSyncInfo) {
        try {
            let users = []
            if (clientSyncInfo?.userSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.userSyncedAt ? clientSyncInfo?.userSyncedAt : ''
                logger.info('fetching data for users',this.tenantId)
                users = await this.fetchExistingData(to, from, localConstant.USER_END_POINTS.USERS, this.tenantId)
                logger.debug("Users Data in syncUsers..", users)
                this.sendSyncExistingData(users?.result?.rows, SyncDataEntity.USERS)
            }
            logger.info("Succesfully sync Users")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync Users")
            return Promise.reject(err)
        }

    }
    async syncProducts(clientSyncInfo: ClientSyncInfo) {
        try {
            let products = []
            // fetch product
            if (clientSyncInfo?.productSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.productSyncedAt ? clientSyncInfo?.productSyncedAt : ''
                logger.info('fetching data for product')
                products = await this.fetchExistingData(to, from, localConstant.PRODUCT_END_POINTS.PRODUCTS, this.tenantId)
                this.sendSyncExistingData(products?.result?.rows, SyncDataEntity.PRODUCTS)
            }
            logger.info("Succesfully sync Products")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync Products")
            return Promise.reject(err)
        }

    }

    async syncProcess(clientSyncInfo: ClientSyncInfo) {
        try {
            let process = []
            // fetch product
            if (clientSyncInfo?.productSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.processSyncedAt ? clientSyncInfo?.processSyncedAt : ''
                logger.info('fetching data for process')
                process = await this.fetchExistingData(to, from, localConstant.PROCESS_END_POINTS.PROCESS, this.tenantId)
                this.sendSyncExistingData(process?.result?.rows, SyncDataEntity.PROCESSES)
            }
            logger.info("Succesfully sync Process")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync Process")
            return Promise.reject(err)
        }

    }
    // async syncProcess(clientSyncInfo: ClientSyncInfo) {
    //     try {
    //         let process : any = []
    //         // fetch process
    //         if (clientSyncInfo?.processSyncedAt !== clientSyncInfo?.queueCreatedAt) {
    //             const to = clientSyncInfo?.queueCreatedAt
    //             const from = clientSyncInfo?.processSyncedAt ? clientSyncInfo?.processSyncedAt : ''
    //             logger.debug('fetching data for process')
    //             let processResult = await this.fetchExistingData(to, from, localConstant.PROCESS_END_POINTS.PROCESS, this.tenantId)
                
    //             let workFlowsResult = await this.fetchExistingData(to, from, localConstant.PROCESS_END_POINTS.WORKFLOWS)
    //             logger.debug("workflow data",workFlowsResult)
    //             //TODO fetch workflow for each process
    //             //append workflow key in process json object
    //             let i :any
    //              processResult?.result?.rows?.map( (element: any) =>{
    //                 //  for( i = 0; i< workFlowsResult?.result?.length; i++) {
    //                     for( let workflow of workFlowsResult?.result){
    //                     if(workflow?.processId == element.id) {
    //                         element.workflow = workFlowsResult?.result
    //                         process.push(element)
    //                         logger.debug("process with workflow",element.id,workflow?.processId)
    //                         break
    //                     }
    //                  }
    //                 })
    //             logger.debug("Process data with workflow:::", process)
    //             this.sendSyncExistingData(process, SyncDataEntity.PROCESSES)
    //         }
    //         logger.info("Succesfully sync process")
    //         return Promise.resolve()
    //     } catch (err) {
    //         logger.error("Failed to sync process", err)
    //         return Promise.reject(err)
    //     }

    // }


    fetchWorkFlowForProcess= async (processId: string, endPoint: string) => {
        try{
            let params = {}
            if (processId && processId != "") {
                params = { ...params, processId: processId }
            }
            logger.info('fetching workflow for process id', processId)
            let res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${endPoint}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                },
                params: params
            });
            logger.info("Successfully sync workflow")
            logger.debug('fetchWorkFlowForProcess: response', res.data)
            return Promise.resolve(res.data)
        } catch(e: any) {
            logger.error('Caught exception in fetching workflow for process id', processId, e.message)
            return Promise.reject()
        }
        
    }


    async syncDevices(clientSyncInfo: ClientSyncInfo) {
        try {
            let devices: any = []
            logger.debug('syncing devices')
            // fetch devices
            if (clientSyncInfo?.deviceSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                logger.debug('inside syncing devices')
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.deviceSyncedAt ? clientSyncInfo?.deviceSyncedAt : ''

                //QUERY: why to and from is not used
             //   devices = await this.fetchAllDevices(this.tenantId)
                devices = await this.fetchExistingData(to, from, localConstant.DEVICE_END_POINTS.DEVICE, this.tenantId)

                 logger.debug("device data in sync devices", devices)
                this.sendSyncExistingData(devices?.result?.rows, SyncDataEntity.DEVICES)
                
            }
            logger.info("Succesfully sync devices")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync devices")
            return Promise.reject(err)
        }

    }
    async syncWorkflows(clientSyncInfo: ClientSyncInfo) {
        try {
            let workflows = []
            // fetch workflows
            if (clientSyncInfo?.workflowSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.workflowSyncedAt ? clientSyncInfo?.workflowSyncedAt : ''
                workflows = await this.fetchExistingData(to, from, localConstant.PROCESS_END_POINTS.WORKFLOWS)
                await this.sendSyncExistingData(workflows?.result, SyncDataEntity.WORKFLOWS)
            }
            logger.info("Succesfully sync workflow")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync workflow")
            return Promise.reject(err)
        }

    }

    // fetching and syncing statemachines
    async syncStateMachine(clientSyncInfo: ClientSyncInfo) {
        try {
            let statemachines = []
            // fetch statemachines
            if (clientSyncInfo?.stateMachineSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.stateMachineSyncedAt ? clientSyncInfo?.stateMachineSyncedAt : ''
                statemachines = await this.fetchExistingData(to, from, localConstant.PROCESS_END_POINTS.STATEMACHINE)
                await this.sendSyncExistingData(statemachines?.result, SyncDataEntity.STATEMACHINE)
            }
            logger.info("Succesfully sync statemachines")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync statemachines")
            return Promise.reject(err)
        }

    }

    // fetching and syncing node workflows
    async syncNodeWorkflows(clientSyncInfo: ClientSyncInfo) {
        try {
            let nodeWorkflows = []
            // fetch node workflows
            if (clientSyncInfo?.stateMachineSyncedAt !== clientSyncInfo?.queueCreatedAt) {
                const to = clientSyncInfo?.queueCreatedAt
                const from = clientSyncInfo?.stateMachineSyncedAt ? clientSyncInfo?.stateMachineSyncedAt : ''
                nodeWorkflows = await this.fetchExistingData(to, from, localConstant.PROCESS_END_POINTS.NODEWF)
                await this.sendSyncExistingData(nodeWorkflows?.result, SyncDataEntity.NODEWF)
            }
            logger.info("Succesfully sync nodeworkflow")
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync nodeworkflow")
            return Promise.reject(err)
        }

    }

    // for sending final aknowledgement to device data is synced or not
async syncAcknowledge() {
        try {
                const now = new Date();
                const response = { type: RMQQMsgType.SYNCCOMPLETE }
                
                logger.debug("Response for SyncComplete Data..", response)
                this.sendConfigMessage(response).then((result: any) => { }).catch((e: Exception) => {
                    logger.error('Exception caught in sync-complete emitMsg: ', e.message)
                    return
                })
            logger.info("Succesfully sync aknowledge")    
            return Promise.resolve()
        } catch (err) {
            logger.error("Failed to sync aknowledge")
            return Promise.reject(err)
        }

    }

    // fetch tenants updates after last sync time
    fetchExistingData = async (to: string, from: string, endPoint: string, tenantId?: string) => {
        try {
            let params: any = {sync: 1}
            if (to) {
                params = { ...params, to: to }
            }

            if (from && from === '') {
                params = { ...params, from: from }
            }
            if (tenantId && tenantId != localConstant.CLOUD && tenantId != "") {
                params = { ...params, tenantId: tenantId, tenant: tenantId } 
              logger.debug("params in fetchExistingData",params)  
            }
            let res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${endPoint}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                },
                params: params
            });
            logger.debug('fetchExistingData: response', res.data)
            return Promise.resolve(res.data)
        } catch (err: any) {
            logger.error(`Failed to fetch existing data for syncing ${endPoint}`);
            return Promise.reject(false)
        }
    }

    // fetch all devices
    fetchAllDevices = async (tenantId?: string) => {
        logger.debug("fetch all devices",tenantId)
        try {
            let where = {}
            logger.info("try check for fetch all device")
            if (tenantId && tenantId != "" && tenantId != localConstant.CLOUD) 
            {
                where = { ...where, tenantId: tenantId }
            }
            //const res = await DeviceConfig.findAll({ where: where, raw:true })

            const res = await DeviceConfig.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null,
                    }
                },
                include: [{
                    model: DeviceSiteZoneProcess,
                    where: where,
                },
                {
                    model: DeviceTypeModel,
                }],

            });

            // logger.debug("Where in deviceConfig..", where)

             logger.debug("device data in fetchAllDevices...", res);
            return Promise.resolve(res);
        } catch (err: any) {
            logger.error(`Failed to fetch existing data for syncing of device`);
            return Promise.reject(null)
        }
    }


    // create response for sync existing data
    async sendSyncExistingData(data: any, entity: SyncDataEntity) {
        // createResponseForSyncExistingData = async (tenants: any, users: any, sites: any, zones: any, process: any, product: any, devices: any, workflows:any, tenantId:string, deviceId:string) => {
        logger.debug('createResponseForSyncExistingData: Enter with ',entity)
        try {
            // let data: QMessageFormat[] = []
            //publish response to queues
            //   const routingKey = (tenantId && tenantId !== '' )? `${tenantId}.${deviceId}` : `${tenantId}.cloud`
            let latestUpdatedTime = ""
            await this.formatMsg(data, entity).then(async (result: any) => {

                if(result.length<=0){
                    logger.info('No Data For Syncing')
                    return
                }
                const response = { type: RMQQMsgType.BULK, result: result.formattedData }
                latestUpdatedTime = result?.latestUpdatedTime
                logger.debug("latestUpdatedTime..", latestUpdatedTime)
                logger.debug("Response for syncExisting Data..", response)
                this.sendConfigMessage(response).then((result: any) => { }).catch((e: Exception) => {
                    logger.error('Exception caught in emitMsg: ', e.message)
                    return
                })
               
                await this.updateEntitySyncTime(latestUpdatedTime, this.getEntityColumn(entity))

            }).catch((err: any) => {
                logger.error(`Failed to format message for ${entity} of device ${this.deviceIdentifier}`)
            })

            return Promise.resolve(true);
        } catch (err: any) {
            logger.error(`Failed to create response for existing data`);
            return Promise.reject(null)
        }
    }


    
    



    getEntityColumn(entity: string) : string {
        let columnName = ""
        try{
            
            switch(entity) {
                
                case SyncDataEntity.TENANTS :
                    columnName = localConstant.ClientSyncInfoColumn.TENANTS
                    break;
                case SyncDataEntity.SITES :
                    columnName = localConstant.ClientSyncInfoColumn.SITES
                    break;
                case SyncDataEntity.ZONES :
                    columnName = localConstant.ClientSyncInfoColumn.ZONES
                    break;
                case SyncDataEntity.DEVICES :
                    columnName = localConstant.ClientSyncInfoColumn.DEVICES
                    break;
                case SyncDataEntity.USERS :
                     columnName = localConstant.ClientSyncInfoColumn.USERS
                    break;
                case SyncDataEntity.PRODUCTS :
                    columnName = localConstant.ClientSyncInfoColumn.PRODUCTS
                    break;
                case SyncDataEntity.PROCESSES :
                     columnName = localConstant.ClientSyncInfoColumn.PROCESSES
                     break;
                case SyncDataEntity.WORKFLOWS :
                    columnName = localConstant.ClientSyncInfoColumn.WORKFLOWS
                    break;
                case SyncDataEntity.STATEMACHINE :
                    columnName = localConstant.ClientSyncInfoColumn.STATEMACHINES
                    break;
                case SyncDataEntity.NODEWF :
                    columnName = localConstant.ClientSyncInfoColumn.NODEWFS
                    break;

                default: 
                    logger.error('Default case for entity ', entity)
                    
            }

        }catch(err: any){
            logger.error("get error in getting colummn name for entity ", entity, err.message);
            return columnName
        }
        return columnName
    }



    // sync Tag Data
    // syncTagData = async (data: any) => {
    //     try {
    //         const actionOn = data?.actionOn
    //         switch (actionOn) {
    //             case SyncDataEntity.DEVICES:
    //                 // await this.syncDevices(data)
    //                 break;
    //             case SyncDataEntity.TAGS:
    //                 // await syncTags(data)
    //                 break;
    //             default:
    //                 break;
    //         }
    //         logger.debug('Received Tag data from device manager or HHD', data);
    //         return Promise.resolve()
    //     } catch (err: any) {
    //         logger.error('Failed to process received Tag data from device manager or HHD', data);
    //         return Promise.reject()
    //     }
    // }


    //update last sync
    // updateLastSyncForDMorHHD = async (deviceId: string, type: string) => {
    //     try {
    //         const date = new Date()
    //         const utcTime = date.toUTCString();

    //         if (type === localConstant.HHD) {
    //             await DeviceConfig.update({ lastSyncAt: utcTime }, { where: { mac: deviceId } })
    //         } else {
    //             await DeviceManager.update({ lastSyncAt: utcTime }, { where: { url: deviceId } })
    //         }
    //         return Promise.resolve()
    //     } catch (err: any) {
    //         logger.error(`Failed to update last sync for device ${deviceId}`)
    //         return Promise.reject()
    //     }
    // }

    // sync tags from device manager or HHD
    // syncTags = async (data: QMessageFormat) => {
    //     try {
    //         switch (data?.action) {
    //             case SyncDataAction.CREATE:
    //                 logger.info('Received tag read data', data);
    //                 //await tagExternalCommInstance.addTagData(data);
    //                 break;
    //             case SyncDataAction.UPDATE:

    //                 break;
    //             case SyncDataAction.DELETE:

    //                 break;
    //             case SyncDataAction.GET:

    //                 break;

    //             default:
    //                 break;
    //         }

    //         return Promise.resolve()
    //     } catch (err: any) {
    //         logger.error('Failed to sync tags data from solution')
    //         return Promise.reject()
    //     }

    // }


    // sync devices data from device manager or HHD
    // async syncDevices(data: QMessageFormat){
    //     try {
    //         if (data?.action === SyncDataAction.UPDATE) {
    //             if (data?.data?.url) {
    //                 DeviceManager.update({ status: data?.data?.status }, { where: { url: data.data?.url } })
    //             } else {
    //                 DeviceConfig.update({ status: data?.data?.status }, { where: { mac: data.data?.mac } })
    //             }
    //         }

    //         return Promise.resolve()
    //     } catch (err: any) {
    //         logger.error('Failed to sync devices data from solution')
    //         return Promise.reject()
    //     }

    // }

    // to format msg for publishing
    async formatMsg(inputData: any[], entity: string): Promise<any> {
        
        logger.debug("input data for formatMsg ",entity)
        try {
            let formattedData: QMessageFormat[] = [];
            let latestUpdatedTime:string = "1995-12-17T03:24:00";
            if (inputData.length <= 0) {
                logger.error('no data found for msg formatting')
                return Promise.resolve(formattedData)
            }
            
            inputData.map((element: any) => {
                // New properties to be added
                const newElement = this.getSendMessageKeys(entity, element);
                // logger.debug("Formatted element: ", newElement)
                const newObj: QMessageFormat = {
                    type: RMQQMsgType.CONFIG,
                    entity: entity,
                    action: SyncDataAction.CREATE,
                    tenantId: entity === SyncDataEntity.TENANTS ? element?.id : element?.tenantId,
                    data: newElement
                };
                formattedData.push(newObj)
               // const currentTimeStamp = Date.now()
               // if(latestUpdatedTime < newElement?.updatedAt){
                if(new Date(latestUpdatedTime) < new Date(newElement?.updatedAt)){
                    latestUpdatedTime = newElement?.updatedAt;
                }

            });
            return Promise.resolve({formattedData:formattedData, latestUpdatedTime: latestUpdatedTime})
        } catch (err: any) {
            logger.error('Failed to format message array for syncing', err.message);
            return Promise.reject()
        }
    }

    // this function will convert id to 'entityname+Id'
    getSendMessageKeys(entity: string, element: any) {
        try {
            let newElement = {}
            switch (entity) {
                case SyncDataEntity.TENANTS: {
                    newElement = { ...element, tenantId: element.id, tenantName: element.name }
                    break;
                }
                case SyncDataEntity.SITES: {
                    newElement = { ...element, siteId: element.id }
                    break;
                }
                case SyncDataEntity.ZONES: {
                    newElement = { ...element, zoneId: element.id }
                    break;
                }
                case SyncDataEntity.USERS: {
                    let newData = {siteId:element?.userRole?.siteId, homeSite:element?.userRole?.homeSite, tenantId: element?.userRole?.tenantId, roleId: element?.userRole?.roleId, roleName: element?.userRole?.roleName}
                    newElement = { userId: element.id, ...newData , ...element}
                    break;
                }
                case SyncDataEntity.PRODUCTS: {
                    newElement= { ...element, productId: element.id }
                    break;
                }
                case SyncDataEntity.PROCESSES: {
                    newElement = { ...element, processId: element.id, roleId: element.assign.roles }
                    break;
                }
                case SyncDataEntity.DEVICES: {
                    newElement = { ...element, deviceId: element.id }
                    break;
                }
                default: {
                    newElement = {...element}
                    break;
                }
            }
            return newElement;
        } catch (error: any) {
            logger.error('Failed to get sendMessage keys');
            return error;
        }
    }

    // update syncing status after for client in clienSyncInfo
    updateSyncingStatus = async (deviceId: string, tenantId: string) => {
        try {
            let whereObj: any = { deviceId: deviceId }
            if (tenantId && tenantId != "cloud") {
                whereObj = { ...whereObj, tenantId: tenantId }
            }


            const client = await ClientSyncInfo.findOne({ where: { ...whereObj } });
            if (!client) {
                logger.error('client not exist in clientsyncinfo table for device id', deviceId)
                return Promise.resolve(false)
            }
            await ClientSyncInfo.update({ isExistingDataSynced: true }, { where: { ...whereObj } });
            return Promise.resolve(true)
        } catch (error : any) {
            logger.error('Failed to update syncing status for device', deviceId, error.message)
            return Promise.reject()
        }
    }

    //update entity syncing time for already existing data syncing
    updateEntitySyncTime = async(latestUpdatedTime:any, entityColumn: string) => {
        try {
            logger.debug("entityColumn in updateSyncTime..", entityColumn, latestUpdatedTime)
            const client = await ClientSyncInfo.findOne({ where: { deviceId: this.deviceIdentifier } });
            if (!client) {
                logger.error('updateEntitySyncTime:client not exist in clientsyncinfo table for device id', this.deviceIdentifier)
                return Promise.resolve(false)
            }
            logger.debug("queueCreatedAt in updateSyncTime..", client.queueCreatedAt, latestUpdatedTime)
          //  const formattedDateTime = await convertTSepTimeToYYMMDDHHMMSS(latestUpdatedTime)
            const formattedDateTime = await latestUpdatedTime
            await ClientSyncInfo.update({ [entityColumn]: formattedDateTime }, { where: { deviceId: this.deviceIdentifier } });
            return Promise.resolve()
        }
        catch (error) {

            logger.error(`Failed to update syncing time for entity ${entityColumn} for device`, this.deviceIdentifier, error)
            return Promise.reject()
        }
    }
}