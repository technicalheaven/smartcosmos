import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { config} from '../../../config';
import { productEndpoints } from '../utils/constant';
import { logger } from '../../../libs/logger';
var constant = require('../../../middlewares/resp-handler/constants');
import Exception from '../../../middlewares/resp-handler/exception';

class ProductExternalComm {

    async syncProductData(payload:any) {
        try{
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/${productEndpoints.SYNC_PRODUCT}`, payload);
            logger.info("Product Data send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
             logger.error("Error at Product Data send to Sync-service ");
             return Promise.reject(error);
        }
    }
 
    async syncProductDataUpdate(payload:any) {
         try{   
            const {id,...body} = payload;
            const res = await axios.patch(`${config.BASE_URL}/smartcosmos/sync/product/`+id, body,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info(`Updated Product Data of ID: ${id} send to Sync-service Successfully`);
            return Promise.resolve(res);

            }
            catch(error:any)
            {
                // logger.error("Error at Updated Product Data Syncing ", error);
                // return Promise.reject(error);
            }
    }

    async syncProductDataUpdateByUPC(payload:any) {
         try{               
            const res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/product/upc/`+payload.upc, {...payload, otherAttributes: JSON.stringify(payload.otherAttributes)},{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info(`Updated Product Data of UPC: ${payload.upc} send to Sync-service Successfully`);
            return Promise.resolve(res);

            }
            catch(error:any)
            {
                // logger.error("Error at Updated Product Data Syncing ", error);
                // return Promise.reject(error);
            }
    }



    async syncProductDataDelete(productId: any, tenantId:string) 
    {
        try{
           const res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/sync/product/${productId}`,{data:{tenantId:tenantId},headers: {
            'service-token': process.env.SERVICE_TOKEN!!
        }});
            logger.info("Deleted Product Data ID  send to Sync-serivce Successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            // logger.error("Error at Deleted Product Data Syncing ", error);
            // return Promise.reject(error);
        }
    }

    async syncProductBulkDelete(productIds: any, tenantId:string) 
    {
        try{
            let payload={ productIds:productIds,tenantId:tenantId}
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/product-bulk-delete`, payload, {headers: {
            'service-token': process.env.SERVICE_TOKEN!!
        }});
            logger.info("Deleted Product Data ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            // logger.error("Error at Deleted Product Data Syncing ", error);
            // return Promise.reject(error);
        }
    }

   

    async getTenantById(id: any)
    {
        try{    
           
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${productEndpoints.TENANTBYID}/${id}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("GettingTenantFromProduct");
            logger.info("Tenant id fetched successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error getTenantById92 ", error);
            if(!error.response.data.statusCode)  throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Tenant of id ${id} doesn't exist.`);
            else return Promise.reject(error);
        }
    }



}



export const productExternalCommInstance = new ProductExternalComm();