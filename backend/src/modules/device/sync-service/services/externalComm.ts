
import axios from 'axios';
import { logger } from '../../../../libs/logger';
import { config} from '../../../../config';
import { lastValidCounter } from '../../utils/constants'






class ExternalComm { 
    async  expectedCount(req:any) {
        try {

            let lastExpectedCount = await axios.post(`${config.BASE_URL}${config.API_PREFIX}${lastValidCounter}`,req,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})

            logger.info("getting last valid counter successfully")
            return Promise.resolve(lastExpectedCount)
        }
        catch (error) {
            logger.error("error in getting last expected count",error)
            return Promise.reject(error)
        }
    }
}

export const ExternalCommInstance = new ExternalComm();




