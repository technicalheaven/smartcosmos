import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { config} from '../../../config';
import { logger } from '../../../libs/logger';
import { tenantEndpoints,DEVICE_DETAILS,DeviceNotFound ,FEATURES_NAME_BY_ID,FEATURES_NAME_NOT_FOUND,PROCESS_NAME_BY_ID, Product, Site,Zone,TagReport,EnablementReport, ZoneType} from '../utils/constant';
var constant = require('../../../middlewares/resp-handler/constants');
import Exception from '../../../middlewares/resp-handler/exception';
import { productExternalCommInstance } from '../../product/services/externalComm';

class ExternalComm {
   

    async getTenantById(id: any)
    {
        try{    
           
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${tenantEndpoints.TENANTBYID}/${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("GettingTenantFromProduct");
            logger.info("Tenant id fetched successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error getTenantById92 ");
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Tenant of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }

    async getDeviceDetails(id: any, mac:any = '')
    {
        try{    
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${DEVICE_DETAILS}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            },
            params: {type:mac}
        });
            logger.info("getDeviceDetails_tag_externalComm_38");
            logger.info("Tenant id fetched successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error getDeviceDetails_tag_externalComm_44 ");
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Device of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }

    // get device by id 
    async getDeviceById(id: any)
    {
        try{    
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${DEVICE_DETAILS}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            },
        });
            logger.info("getDeviceDetails_tag_externalComm_38");
            logger.info("Tenant id fetched successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error getDeviceDetails_tag_externalComm_44 ");
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Device of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }




    async getUserById(id: any)
    {
        try{    
           
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${tenantEndpoints.USER}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("GettingUserFromProduct");
            logger.info("User id fetched successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error getUserById92 ");
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }

    // getting process type name
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

    async getProcessNameById(id: any) {
        try{
            
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${PROCESS_NAME_BY_ID}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("getProcessNameById")
            logger.info("Process name fetched successfully")
            return Promise.resolve(res)
        }
        catch(error)
        {
            logger.error("error in getProcessNameById")
            return Promise.reject(error)
        }
    }

    async getProductById(id: any){
        try{
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${Product}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("getProductById")
            logger.info("Product fetched successfully")
            return Promise.resolve(res)
        }
        catch(error)
        {
            logger.error("error in getProductById")
            return Promise.reject(error)
        }
    }

    async getSiteById(id: any){
        try{
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${Site}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("getSiteById")
            logger.info("Site fetched successfully")
            return Promise.resolve(res)
        }
        catch(error)
        {
            logger.error("error in getSiteById")
            return Promise.reject(error)
        }
    }

    async getZoneById (id : any) {
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${Zone}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("getZoneById")
            logger.info("Zone fetched successfully")
            return Promise.resolve(res)
        }
        catch(error)
        {
            logger.error("error in getZoneById")
            return Promise.reject(error)
        }
    }

    async creatingReportTag (tenantId: any,counts: any) {
        try {
            let payload= { tenantId:tenantId, counts:counts};
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}${TagReport}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            logger.info("tag report created successfully from external comm")
            return Promise.resolve(res)
        }
        catch(error) {
            logger.error("error in creating report tag from external comm")
            return Promise.reject(error)
        }
    }

    async creatingReportEnablement (tenantId: any, siteId:any, processId: any, upc: any, beforeStatus: any, status: any, type: any) {
        try {
            logger.info("inside creatingReportEnablement")
            let payload = {tenantId: tenantId, siteId:siteId, processId: processId, upc: upc, beforeStatus: beforeStatus, status: status, type: type}
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}${EnablementReport}`,payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            logger.info("enablement report created successfully from external comm")
            return Promise.resolve(res)
        }
        catch(error) {
            logger.error("error in creating report tag from external comm")
            return Promise.reject(error)
        }
    }

    async getZoneTypeById (id : any) {
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${ZoneType}${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
           // logger.info("getZoneTypeById",res)
            logger.info("ZoneType fetched successfully")
            return Promise.resolve(res)
        }
        catch(error)
        {
            logger.error("error in getZoneTypeById")
          //  return Promise.reject(error)
        }
    }

}



export const ExternalCommInstance = new ExternalComm();