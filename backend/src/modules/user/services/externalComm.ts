import axios from "axios";
import { config } from '../../../config';
import { logger } from '../../../libs/logger';

class UserExternalComm {
    // To get the Tenant Details
    async getTenant(tenantId: any, value: any) {
        // axio
        try{
            let res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/tenant/${tenantId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
            
        }catch(err){
            return Promise.reject(err);
        }
    }

    // To notify the Device Manager 
    async deleteUser(userId: any, tenantId: any) {    
        logger.debug("TenantId and userId.. in syncSiteDataDelete", tenantId, userId)    
        try {
            let payload = { tenantId: tenantId, userId: userId };     
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/user-delete`,payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Deleted User ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Deleted User Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncUserDataBulkDelete(deletedUser: any, tenantId:string) {
        try {
            let payload = { tenantId: tenantId, deletedUser: deletedUser };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/user-bulkdelete`, payload,{
            headers: { 'service-token': process.env.SERVICE_TOKEN!! }
            });
            logger.info("Data send to sync-service Successfully for Deleted user IDs");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Data to sync-service for Deleted user IDs");
            return Promise.reject(error);
        }
    }


    async createUser(userId: any, userData: any) {
        
        try {
            let payload = { userId: userId, data: userData };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/user`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("User Data send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send User Data to Sync-service ");
            return Promise.reject(error);
        }
    }

    async updateUser(userId: any, userData: any) {
            try {
                let payload = { userId: userId, data: userData };
                let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/user/${userId}`, payload,{headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }});
                logger.info("Updated User Data send to Sync-serivce Successfully");
                return Promise.resolve(res);
            }
            catch (error: any) {
                logger.error("Error at Updated User Data send to Sync-service");
                return Promise.reject(error);
            }
    }

}



export const userExternalCommInstance = new UserExternalComm();


