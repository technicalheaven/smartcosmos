// import axios from 'axios';
import { logger } from '../../../libs/logger';
class FeatureExternalComm {


    async syncFeatureDataAdd(featureId: any, featureData: any) {
        try{
              let payload = { featureId: featureId, data: featureData };
              let res='';
            //  res = await axios.post('http://localhost:8080/smartcosmos/sync/feature', payload,{headers: {
            //     'service-token': process.env.SERVICE_TOKEN!!
            // }});
            logger.info("Feature Data send to Sync-serivce Successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error at Feature Data send to Sync-service ");
            return Promise.reject(error);
        }
    }
    
    async syncFeatureDataUpdate(featureId: any, featureData: any) {
         try{   
             let payload = { featureId: featureId, datat: featureData };
             let res='';
             // res = await axios.patch('http://localhost:8080/smartcosmos/sync/feature', payload,{headers: {
            //     'service-token': process.env.SERVICE_TOKEN!!
            // }});
            logger.info("Updated Feature Data send to Sync-serivce Successfully");
            return Promise.resolve(res);
            }
            catch(error:any)
            {
                logger.error("Error at Updated Feature Data send to Sync-service ");
                return Promise.reject(error);
            }
    }

    async syncFeatureDataDelete(featureId: any) {
        try{
            let res='';
           //  res = await axios.delete('http://localhost:8080/smartcosmos/sync/feature', featureId,{headers: {
            //     'service-token': process.env.SERVICE_TOKEN!!
            // }});
            logger.info("Deleted Feature Data ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error at Deleted Feature Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

}



export const featureExternalCommInstance = new FeatureExternalComm();