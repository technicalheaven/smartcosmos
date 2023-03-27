import { logger } from "../../../libs/logger";
import { DeviceConfig } from "../models/deviceConfig";
import { DeviceManager } from "../models/deviceManager";
import { DeviceSiteZoneProcess } from "../models/deviceSiteZoneProcess";
import { SyncDataEntity } from "../sync-service/rmq/helpers/rmqConfig";

var localConstant = require('../utils/constants');

/**
 * this functions returns {isValidDevice,deviceID,tenantId}
 *  */ 
export const fetchDeviceInfo = async (deviceId?: string) =>{
    try {
        logger.debug('fetchDeviceInfo: enter with ', deviceId)
        
        let res:any, where = {}; 
        let finalRes = {
            isDeviceValid:true,
            deviceId:deviceId,
            tenantId:"",
            status: localConstant.ACTIVE
        } 
         
        //First search in Device Config Table
            
        where = { ...where, mac: deviceId }
        res = await DeviceConfig.findOne({ where, raw:true }) 
        logger.debug('fetchDeviceInfo: search result from Devie Config:',res)         
        if(res?.mac == deviceId)
        {
            
            res = await DeviceSiteZoneProcess.findOne({ where :{deviceId:res?.id}, raw:true })
            logger.debug('fetch result from DeviceSiteZoneProcess: ',res)
            finalRes.tenantId = res?.tenantId
            finalRes.status = res?.status
            return Promise.resolve(finalRes)

        }
        //If not found then search in Devie Manager Table                   
        logger.debug("After DeviceConfig..") 
        where = {}   
        where = { ...where, uuid: deviceId }
        res = await DeviceManager.findOne({ where, raw:true })
        logger.debug('Search result from Device Manager Table')
        
        if(res?.uuid == deviceId) {
            if(res?.type == localConstant.ONCD) finalRes.tenantId = localConstant.CLOUD
            else finalRes.tenantId = res.tenantId
        logger.debug("Final Result for deviceManager..", finalRes)
          
            return Promise.resolve(finalRes)
        }

        finalRes.isDeviceValid = false
        return Promise.resolve(finalRes)
        
    } catch (err: any) {
        
        logger.error(`Failed to fetch device data for syncing of device`, err.message);
        return Promise.reject(null)
    }
  }


  export async function getEntityColumnByName(entity: string){
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

export async function convertTSepTimeToYYMMDDHHMMSS(timeStr:string) {
    try {
        return timeStr.toString().replace(/T/, ' ').replace(/\..+/, '')
    } catch (error:any) {
        logger.error('failed to convert time to YY-MM-DD HH:MM:SS');
        return ''
    }
}
  
  
 
