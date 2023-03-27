const axios = require('axios')
import { Json } from 'sequelize/types/utils';
import { config } from '../../../config';
var localConstant = require('../utils/constants');
import { logger } from '../../../libs/logger';
import Exception from '../../../middlewares/resp-handler/exception';
import { FEATURES_NAME_BY_ID, PROCESS_NAME_BY_ID } from '../../tag/utils/constant';
var constant = require('../../../middlewares/resp-handler/constants');


class externalCommunication {
    async getTenant(tenantId: any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TENANT_END_POINTS.TENANTBYID}/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error:any) {
                logger.error("Error while getting tenant data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND);
                else return Promise.reject(error);
        }
    }

    async getFeatureIdByName(featureName: any) {
        try {
            let payload ={featureName:featureName}
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.FEATURE_NAME.FEATURE_BY_NAME}?processType=${featureName}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error:any) {
                logger.error("Error while getting feature data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.FEATURE_NOT_FOUND);
                else return Promise.reject(error);
        }
    }

    async getFeaturesById(featureId: any) {
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${FEATURES_NAME_BY_ID}${featureId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
            } catch (error:any) {
                logger.error("Error while getting feature data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.FEATURE_NOT_FOUND);
                else return Promise.reject(error);
        }
    }

    async getProduct(productId: any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.PRODUCT_END_POINTS.PRODUCTBYID}/${productId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error:any) {
                logger.error("Error while getting product data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.PRODUCT_NOT_FOUND);
                else return Promise.reject(error);
        }
    }

    async getDevice(deviceId:any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYID}/${deviceId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error:any) {
                logger.error("Error while getting device data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND);
                else return Promise.reject(error);
        }
    }

    async getRole(roleId:any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ROLE_END_POINTS.ROLEBYID}/${roleId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error:any) {
                logger.error("Error while getting role data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ROLE_NOT_FOUND);
                else return Promise.reject(error);
        } 
    }
    
    async getSite(siteId: any) {
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.SITE_END_POINTS.SITEBYID}/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error:any){
                logger.error("Error while getting site data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
                else return Promise.reject(error);
        }
    }

    async getZone(zoneId:any) {
        try{
        let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONE_END_POINTS.ZONEBYID}/${zoneId}`,{headers: {
            'service-token': process.env.SERVICE_TOKEN!!
        }})
            return Promise.resolve(res)
            } catch (error:any){
                logger.error("Error while getting zone data ");
                if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONE_NOT_FOUND);
                else return Promise.reject(error);
        } 
    }

    
    // restoreDeviceViaTenantId = (tenantId: any) => {
    //     return new Promise((resolve, reject) => {
    //         let patchUrl = `${config.BASE_URL}${config.API_PREFIX}/device/tenant/${tenantId}`
    //         return axios({
    //             url: patchUrl, // Endpoint
    //             timeout: localConstant.TIMEOUT, // e.g. 10s
    //             method: localConstant.REQUEST_METHOD.PATCH
    //         }).then((response:any) => {
    //             resolve(response.data);  // return results
    //         }).catch((error:any) => {
    //             reject(localConstant.DEVICE_NOT_RESTORE);
    //         });
    //     });
    // }
    
    async AssignProcessToDevice(data: any) {
        
        try {
            let payload = data;
           let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_ASSIGN_END_POINTS.DEVICESBYID}`, payload,{headers: {
            'service-token': process.env.SERVICE_TOKEN!!
        }});
            logger.info("assign process Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error in assign process ");
            return Promise.reject(error);
        }
    }


    async UnAssignProcess(processId: any) {
        
        try {
            let payload = {processId:processId};
           let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICES_END_POINTS.DEVICESBYID}/${processId}`, payload,{headers: {
            'service-token': process.env.SERVICE_TOKEN!!
        }});
            logger.info("unassign process Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error in unassign process ");
            return Promise.reject(error);
        }
    }

    // for sync
   

    async syncCreateProcess(processId: any, processData: any,) {
        
        try {
            let payload = { processId: processId, data: processData};
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/process`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Process Data sent to Sync-Service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Process Data Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncUpdateProcess(processId: any, processData: any) {
            try {
                let payload = { processId: processId, data: processData };
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/process/${processId}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
                logger.info("Updated Process Data sent to Sync-Service Successfully");
                return Promise.resolve(res);
            }
            catch (error: any) {
                logger.error("Error at send Updated Process Data Sync-service ");
                return Promise.reject(error);
            }
    } 
    async syncDeleteProcess(processId: any, tenantId:string) {
        try {
            let payload = { tenantId: tenantId, processId: processId };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/process-delete`,payload,{ headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Deleted Process ID sent to Sync-Service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Deleted Process Data to Sync-service");
            return Promise.reject(error);
        }
    }
   

    async syncBulkDeleteProcess(deletedProcessIds: any, tenantId:string) {
        try {
            let payload = { tenantId: tenantId, deletedProcessIds: deletedProcessIds };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/process-bulkdelete`, payload,{
            headers: { 'service-token': process.env.SERVICE_TOKEN!! }
            });
            logger.info("Data sent to Sync-Service Successfully for Deleted process IDs");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Data to sync-service for Deleted process IDs");
            return Promise.reject(error);
        }
    }
    async getFeatureNameById(id: any)
    {
        try{    
           logger.debug("getFeatureNameById",id)
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${FEATURES_NAME_BY_ID}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("getgetFeatureNameById_getting_result");
            logger.info("Process id details fetched successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error getFeatureNameById_84 ");
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Process Type of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }

}

let processexternalComm = new externalCommunication()
export default processexternalComm