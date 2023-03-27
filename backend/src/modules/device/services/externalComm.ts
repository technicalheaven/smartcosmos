import axios from 'axios';
import { logger } from '../../../libs/logger';
import { config } from '../../../config';
var  localConstant = require('../utils/constants');
import Exception from '../../../middlewares/resp-handler/exception';
var constant = require('../../../middlewares/resp-handler/constants');

class DeviceExternalComm {

    async getTenant(tenantId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TENANT_END_POINTS.TENANTBYID}/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            //logger.info(`Tenant Data of id ${tenantId}`, res);
            return Promise.resolve(res);
           }
        catch (error: any) {
            logger.error("Error while getting tenant data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND);
            else return Promise.reject(error);
        }
    }

    async getsite(siteId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.SITE_END_POINTS.SITEBYID}/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting site data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
            else return Promise.reject(error);
        }
    }

    async getDeviceManager(tenantId: any) {
        try {
            
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICEMANAGER_END_POINTS.CHECKMANAGER}${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting getDeviceManager data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_MANAGER_NOT_FOUND);
            else return Promise.reject(error);
        }
    }
    
    async getZone(zoneId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONE_END_POINTS.ZONEBYID}/${zoneId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting Zone data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONE_NOT_FOUND);
            else return Promise.reject(error);
        }
    }

    async combineCheckOnTenantSiteZone(data:any) {
        try {
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONE_END_POINTS.ALLCHECK}`, data,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting combine check ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_SITE_ZONE_NOT_MATCHED);
            else return Promise.reject(error);
        }
    }

    async syncDeviceDataAdd(deviceId: any, deviceData: any) {
        try {
            let payload = { deviceId: deviceId, data: deviceData };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/devices`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
         // let res = await syncDevice(payload);
            logger.info("Device Data sent to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Device Data Sync-service");
            return Promise.reject(error);
        }
    }

    async syncDeviceDataUpdate(deviceId: any, deviceData: any) {
        try {
            let payload = { deviceId: deviceId, data: deviceData };
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/device/${deviceId}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Updated Device Data sent to Sync-service Successfully");
            return Promise.resolve(res);

        }
        catch (error: any) {
            logger.error("Error at send Updated Device Data Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncDeviceDataDelete(deviceId: any, tenantId:any) 
    {
        try {
            let payload = { tenantId: tenantId, deviceId: deviceId }; 
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/device-delete`,payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Deleted Device ID sent to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Deleted Device Data Sync-service");
            return Promise.reject(error);
        }
    }

    async createDashBoardHeaderReport(payload:any) {
        try {
        
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/report/dashboardHeader`, payload, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });

            logger.info("Dashboard Header Report created Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at creating Dashboard Header Report");
            return Promise.reject(error);
        }
    }
    
    async syncDeviceDataBulkDelete(deletedDeviceId: any, tenantId:string) {
        try {
            let payload = { tenantId: tenantId, deletedDeviceId: deletedDeviceId };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/device-bulkdelete`, payload,{
            headers: { 'service-token': process.env.SERVICE_TOKEN!! }
            });
            logger.info("Data sent to sync-service Successfully for Deleted device IDs");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Data to sync-service for Deleted device IDs");
            return Promise.reject(error);
        }
    }
    

    // sync device Manager Data
    async syncDeviceManagerDataAdd(id: any, deviceData: any) {
        try {
            let payload = { deviceManagerId: id, data: deviceData };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/device-manager`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});            
            logger.info("Device Manager Data sent to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at  Device Manager Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncDeviceManagerDataUpdate(id: any, deviceData: any) {
        try {
            let payload = { deviceManagerId: id, data: deviceData };
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/device-manager/${id}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Updated Device Manager Data sent to Sync-service Successfully");
            return Promise.resolve(res);

        }
        catch (error: any) {
            logger.error("Error at Updated Device Manager Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncDeviceManagerDataDelete(id: any) {
        try {
            let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/sync/device-manager/${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Deleted Device Manager ID sent to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Deleted Device Manager Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async getProcess() {
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/process`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            
            return Promise.resolve(res);
           }
        catch (error: any) {
            logger.error("Error while getting process data ");
            return Promise.reject(error);
        }
    }

    async getDevice(){
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/devices`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            
            return Promise.resolve(res);
           }
        catch (error: any) {
            logger.error("Error while getting devices data ");
            return Promise.reject(error);
        }
    }

    async getDeviceById(id:any){
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/deviceSiteZoneProcess/device/${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            
            return Promise.resolve(res);
           }
        catch (error: any) {
            logger.error("Error while getting devices data ");
            return Promise.reject(error);
        }
    }
        
}

export const deviceExternalCommInstance = new DeviceExternalComm();
