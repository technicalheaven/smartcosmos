import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { config} from '../../../config';
import { reportEndpoints } from '../utils/constant';
import { logger } from '../../../libs/logger';
var constant = require('../../../middlewares/resp-handler/constants');
import Exception from '../../../middlewares/resp-handler/exception';

class ReportExternalComm {

    async getTenantById(id: any)
    {
        try{    
           
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.TENANTBYID}/${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Tenant of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }

    async getTenantSite({tenantId,siteId}:any)
    {
        try{    
           
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.TENANTSITE}/${tenantId}/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Site of id ${siteId} doesn't exist.`);
            else return Promise.reject(error);
        }
    }



    async getTenantProcess({tenantId,processId}:any)
    {
        try{    
           
            const result = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.TENANTPROCESS}/${tenantId}/${processId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            
            if(!result?.data?.result)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `process of id ${processId} doesn't exist.`);
            return Promise.resolve(result);
        }
        catch(error:any)
        {
            return Promise.reject(error);
        }
    }


    async getTenantProduct({tenantId,upc}:any)
    {
        try{    
           
            const result = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.TENANTUPC}/${tenantId}/${upc}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});

            if(!result?.data?.result) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `product of upc ${upc} doesn't exist.`);
            return Promise.resolve(result);
        }
        catch(error:any)
        {   
            return Promise.reject(error);
        }
    }

    async getSiteCount({tenantId}:any)
    {
        try{    
           
            const result = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.SITECOUNT}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});

            if(!result?.data?.result) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, "getting error to count site");
            return Promise.resolve(result?.data);
        }
        catch(error:any)
        {   
            return Promise.reject(error);
        }
    }

    async getDeviceCount({tenantId}:any)
    {
        try{    
           
            const result = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.DEVICECOUNT}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});

            if(!result?.data?.result) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, "getting error to count device");
            return Promise.resolve(result?.data);
        }
        catch(error:any)
        {   
            return Promise.reject(error);
        }
    }

    async getProductCount({tenantId}:any)
    {
        try{    
           
            const result = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.PRODUCTCOUNT}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});

            if(!result?.data?.result) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, "getting error to count product");
            return Promise.resolve(result?.data);
        }
        catch(error:any)
        {   
            return Promise.reject(error);
        }
    }

    async getProcessCount({tenantId}:any)
    {
        try{    
           
            const result = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${reportEndpoints.PROCESSCOUNT}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});

            if(!result?.data?.result) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, "getting error to count process");
            return Promise.resolve(result?.data);
        }
        catch(error:any)
        {   
            return Promise.reject(error);
        }
    }


}



export const reportExternalCommInstance = new ReportExternalComm();