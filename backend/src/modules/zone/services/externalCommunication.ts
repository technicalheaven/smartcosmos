const axios = require('axios')
import { config } from '../../../config';
import { logger } from '../../../libs/logger';
import Exception from '../../../middlewares/resp-handler/exception';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');

class externalCommunication {
    async getSite(siteId: any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.SITE_END_POINTS.SITEBYID}/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error){
            return Promise.reject(error)
        }
    }

    async getZoneType(zoneType: any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONETYPE_END_POINTS.ZONETYPE}/${zoneType}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error){
            return Promise.reject(error)
        }
    }

    async getTenant(tenantId: any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TENANT_END_POINTS.TENANTBYID}/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error) {
            return Promise.reject(error)
        }
    }

    async getsyncsitedataupdated(tenantId: any) {
        try {
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/site`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error) {
            return Promise.reject(error)
        }
    }

    async unassignDevice(zoneId:any) 
    {
        try {
            let payload = { zoneId:zoneId};
            const res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYID}`,payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    
    async unassignDeviceViaZoneId(zoneId:any) 
    {
        try {
            let payload = { zoneId:zoneId};
            const res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYZONEID}`,payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async checkRunningProcessOnDevice(zoneId:any) 
    {
        try {
            const res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.RUNNINGSTATUSVIAZONEID}/${zoneId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async unassignDeviceViaTenantId(tenantId:any) 
    {
        try {
            let payload = { tenantId:tenantId};
            const res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYTENANTID}`,payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async unassignDeviceViaSiteId(siteId:any) 
    {
        try {
            let payload = { siteId:siteId};
            const res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYSITEID}`,payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    

    async deleteProcessBySiteId(siteId:any) 
    {
        try {
            let res =  await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/processes/site/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async deleteDeviceBySiteId(siteId: any) 
    {
        try {
            let res =  await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/device/site/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }


    async restoredeviceViaSiteId(siteId: any)
    {
        try {
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/device/site/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(localConstant. DEVICE_NOT_RESTORE);
        }

    }
    async restoreprocessViaSiteId(siteId: any)
    {
        try {
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/processes/site/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(localConstant. PROCESS_NOT_RESTORE);
        }

    }


    async deleteZoneViaSiteIdData(siteId: any) {
        try {
            const siteID = {
                siteId: siteId
            }

            let deleteProcess = this.deleteProcessBySiteId(siteID);
            let deleteDevices = this.deleteDeviceBySiteId(siteID);
            // for rollback
           // let restoreDevice = this.restoredeviceViaSiteId(siteID);
            //let restoreProcess = this.restoreprocessViaSiteId(siteID);

            let resDevice: any, resProcess: any;
            [ resDevice, resProcess] = await Promise.all([ deleteDevices, deleteProcess]);
            if ( resDevice.status !== localConstant.RESPONSE_STATUS.SUCCESS && resProcess.status !== localConstant.RESPONSE_STATUS.SUCCESS ) 
            {
                // restoring data
                //await Promise.all([ restoreDevice, restoreProcess]);
                throw new Exception(constant.ERROR_TYPE.FORBIDDEN, localConstant.DATA_NOT_DELETED);
            }
            else {
                return Promise.resolve(localConstant.DATA_DELETED);
            }
        }
        catch (error) {
            logger.error("Error at Deleting zone Data from every where In zone ExternalCom deleteZoneViaSiteIdData");
            return Promise.reject(error);
        }

    }

    async deleteProcessByTenantId(tenantId:any) 
    {
        try {
            let res =  await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/processes/tenant/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async deleteDeviceByTenantId(tenantId: any) 
    {
        try {
            let res =  await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/device/tenant/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async restoredeviceViaTenantId(tenantId: any)
    {
        try {
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/device/tenant/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(localConstant. DEVICE_NOT_RESTORE);
        }

    }
    async restoreprocessViaTenantId(tenantId: any)
    {
        try {
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/processes/tenant/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(localConstant. PROCESS_NOT_RESTORE);
        }

    }

    async deleteZoneViaTenantIdData(tenantId: any) {
        try {
            const tenantID = {
                sittenantIdeId: tenantId
            }

            let deleteProcess = this.deleteProcessByTenantId(tenantID);
            let deleteDevices = this.deleteDeviceByTenantId(tenantID);
            

            // for rollback
            // let restoreDevice = this.restoredeviceViaTenantId(tenantID);
            //let restoreProcess = this.restoreprocessViaTenantId(tenantID);

            let resDevice: any, resProcess: any;

            [ resDevice, resProcess] = await Promise.all([ deleteDevices, deleteProcess]);
            if ( resDevice.status !== localConstant.RESPONSE_STATUS.SUCCESS && resProcess.status !== localConstant.RESPONSE_STATUS.SUCCESS ) 
            {
                // restoring data
              //  await Promise.all([ restoreDevice, restoreProcess]);
                throw new Exception(constant.ERROR_TYPE.FORBIDDEN, localConstant.DATA_NOT_DELETED);
            }
            else {
                return Promise.resolve(localConstant.DATA_DELETED);
            }
        }
        catch (error) {
            logger.error("Error at Deleting zone Data from every where in zone ExternalCom deleteZoneViaTenantIdData");
            return Promise.reject(error);
        }
    }

    async syncZoneDataAdd(zoneId: any, zoneData: any) {
        try {
            let payload = { zoneId: zoneId, data: zoneData };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/zone`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Zone Data send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Zone Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncZoneDataUpdate(zoneId: any, zoneData: any) {
        try {
            let payload = { zoneId: zoneId, data: zoneData };
            
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/zone/${zoneId}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Updated Zone Data send to Sync-service Successfully");
            return Promise.resolve(res);

        }
        catch (error: any) {
            logger.error("Error at Updated Zone Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncZoneDataDelete(zoneId: any, tenantId:any) {
        logger.debug("TenantId and ZoneId.. in syncZoneDataDelete", tenantId, zoneId)
        try {
            let payload = { tenantId: tenantId, zoneId: zoneId }; 
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/zone-delete`, payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Deleted zone ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Deleted zone Data send to Sync-service");
            return Promise.reject(error);
        }
    }

    async syncZoneDataBulkDelete(zoneIdData: any, tenantId:string) {
        try {
            let payload = { tenantId: tenantId, zoneIdArray: zoneIdData };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/zone-bulkdelete`, payload,{
            headers: { 'service-token': process.env.SERVICE_TOKEN!! }
            });
            logger.info("Data send to sync-service Successfully for Deleted zone IDs");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Data to sync-service for Deleted zone IDs");
            return Promise.reject(error);
        }
    }

    async updateDeviceSiteZoneProcess(deviceId: any, zoneData: any){
        try{
            let payload = { deviceId: deviceId, data: zoneData, flag: 'zone' };

            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/deviceSiteZoneProcess/device/${deviceId}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Updated Zone Data send to DeviceSiteZoneProcess Successfully");
            return Promise.resolve(res);
        }
        catch (error: any){
            logger.error("Error in updating DeviceSiteZoneProcess");
            return Promise.reject(error);
        }
    }

    async getDeviceSiteZoneProcessByZoneId(zoneId: any){
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/deviceSiteZoneProcess/zone/${zoneId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error) {
            return Promise.reject(error)
        }
    }

    async updateExistingDigitizedTagWithZoneName(zoneId:any,name:any){
        try {
            let payload = { zoneId: zoneId, zoneName: name };
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/tags/update-zone-name-in-di-data/${zoneId}`,payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error) {
            return Promise.reject(error)
        }
    } 
 
}

    

let zoneExternalComm = new externalCommunication()
export default zoneExternalComm