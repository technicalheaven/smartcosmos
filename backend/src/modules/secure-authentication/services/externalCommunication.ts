const axios = require('axios')
import { config } from '../../../config';
import { logger } from '../../../libs/logger';
import Exception from '../../../middlewares/resp-handler/exception';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');

class externalCommunication 
        {
                      // for getting tag data   RetrieveTagMetaDataAsync
                async RetrieveTagMetaDataAsync(tagId: any) {
                        try {
                            let resp=  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG.GET_TAG_DATA}/${tagId}`,{headers: {
                                'service-token': process.env.SERVICE_TOKEN!!
                            }})
                            return Promise.resolve(resp)
                            } catch (error){
                              console.log("ErrorIn__22") 
                            return Promise.reject(error)
                        }
                    }
                    // for getting tag activate  IsTagActivatedAsync
                    async IsTagActivatedAsync(tagId: any) {
                        try {
                            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG.GET_TAG_ACTIVE}/${tagId}`,{headers: {
                                'service-token': process.env.SERVICE_TOKEN!!
                            }})
                            return Promise.resolve(res)
                            } catch (error){
                                console.log("Error in rolling code externalCommunication line number 34")
                                return Promise.reject(error)

                        }
                    }

                // geting d ActivateTagAsync    
                
                async ActivateTagAsync(tagId: any, activated: any) {
                        try {
                                let payload={tagId:tagId,activated:activated};
                            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG.UPDATE_TAG_ACTIVE}`,{payload},{headers: {
                                'service-token': process.env.SERVICE_TOKEN!!
                            }})
                            return Promise.resolve(res)
                            } catch (error){
                            return Promise.reject(error)
                        }
                    }
                   
                    // update tag last counter
                        
                async UpdateLastValidCounterAsync(tagId:any, newCounter:any) {
                        try {
                                let payload={tagId:tagId,newCounter:newCounter};
                                let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG.UPDATE_TAG_LAST_COUNTER}`,{payload},{headers: {
                                'service-token': process.env.SERVICE_TOKEN!!
                            }})
                            return Promise.resolve(res)
                            } catch (error){
                            return Promise.reject(error)
                        }
                    }

        }

let secureAuthExternalComm = new externalCommunication()
export default secureAuthExternalComm