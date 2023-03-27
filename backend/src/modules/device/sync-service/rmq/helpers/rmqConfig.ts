const localConstant = require('../../../utils/constants')

export enum RMQExchangeConfig {
    SolutionToDeviceExchangeType = 'topic',
    SolutionToDeviceExchangeName = 'solutionToDevice-exchange',
    DeviceToSolutionExchangeType = 'topic',
    DeviceToSolutionExchangeName = 'deviceToSolution-exchange'

}

export const solutionQueueConfig = {
    durable: true,
    arguments:{"x-queue-mode": "lazy"}
}

export const deviceQueueConfig = {
    durable: true,
    arguments:{"x-queue-mode": "lazy"}
}

export const getRoutingKeyForDMQ = async(tenantId:string) => {
    return `${tenantId}.`;
}

export const getBindingKeyForSolQConsumer = async(tenantId:string, deviceId:string) => {
    if(tenantId === localConstant.CLOUD) {
        return [`*.${deviceId}`, '*.ALL'];
    }

    return [`${tenantId}.${deviceId}`, `${tenantId}.ALL`];
}

export const getBindingKeyForDMQConsumer = (tenantId:string, deviceId:string) => {
    return [`${tenantId}.*`];
}

export interface QMessageFormat {
    type: string
    entity:string
    action:string
    params?:any
    tenantId:string
    data: any
}

export enum RMQQMsgType {
    TAG = 'tag',
    CONFIG = 'config',
    BULK = 'bulk',
    DEVICE = 'device',
    SYNCCOMPLETE = 'sync-complete'
}

//constants for sync data type
export enum SyncDataEntity {
    USERS = 'users',
    ZONES = 'zones',
    DEVICES = 'devices',
    SITES = 'sites',
    TENANTS = 'tenants',
    PRODUCTS = 'products',
    PROCESSES = 'processes',
    TAGS = 'tags',
    WORKFLOWS = 'workflows',
    STATEMACHINE = 'statemachines',
    NODEWF = 'nodeWorkflows'
}

//constants for sync data method
export enum SyncDataAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    GET = 'get'
}
