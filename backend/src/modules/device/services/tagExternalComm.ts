import axios from 'axios';
import { logger } from '../../../libs/logger';
import { config } from '../../../config';
var localConstant = require('../utils/constants');
import Exception from '../../../middlewares/resp-handler/exception';
var constant = require('../../../middlewares/resp-handler/constants');

class TagExternalComm {

    async tagReadByIdExComm(tagId: any) {
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.tagReadById}/${tagId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting Manufacturer Tag data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error);
        }
    }

    async digitizedTagReadByIdExComm(diId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.digitizedTagReadById}/${diId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting Digitized data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error);
        }
    }

    async checkTagReadByIdSyncExComm(diId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.checkDigitizedTagReadById}/${diId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting Digitized data for syncing check-tag...");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error);
        }
    }

    async duplicateTagReadByIdExComm(diId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.duplicateTagReadById}/${diId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting Duplicate data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error);
        }
    }

    async trackNTraceTagReadByIdExComm(zoneId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.trackNTraceTagReadById}/${zoneId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting Track and Trace data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error);
        }
    }

    async addDigitizeDataExComm(data: any) {
        try {
            logger.debug("data of addDigitizeDataExComm", data);
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.addDigitizeData}`, data, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting adding Digitized data ",error.message);
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error.message);
        }
    }


    async commonDataProcessingExComm(data: any) {
        try {
            logger.debug("data of commonDataProcessingExComm", data);
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.commonDataProcessing}`, data, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting adding Tag data ", error);
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TAGNOTFOUND);
            else return Promise.reject(error);
        }
    }

    async getProcessType(processType: any) {
        logger.debug("data inside getProcessType...", processType)
        try {
            if (!processType) {
                logger.info('No processType defined');
                return Promise.reject(null);
            }
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.FEATURE_END_POINTS.FEATUREBYID}/${processType}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        } catch (error: any) {
            logger.error('Failed to get process type');
            return Promise.reject(error);
        }
    }

    // expected count 
    async lastvalidcountDataExComm(data: any) {
        try {
            logger.debug("data of lastvalidcountDataExComm", data);
            // const deviceId=data.data.uuid;
            const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TAG_END_POINTS.lastvalidcount}`, data, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting adding Track and Trace data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.UUIDNOTFOUND);
            else return Promise.reject(error);
        }
    }

}

export const tagExternalCommInstance = new TagExternalComm();
