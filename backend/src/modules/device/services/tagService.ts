import { Response, Request } from "express";
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');
import { tagExternalCommInstance } from './tagExternalComm';
import { logger } from '../../../libs/logger';




export class TagSyncService {

    // read manufacturer tag by tag id
    async tagReadById(req: any) {
        try {
            let tagId = req.params?.id || req;
           
            let tagReadResponse;
            // external comm calling
            tagReadResponse = await tagExternalCommInstance.tagReadByIdExComm(tagId);
            return Promise.resolve(tagReadResponse.data);
        }
        catch (error: any) {
            logger.error("Error Reading Tag by Tag Id by Station")
            return Promise.reject("Error Reading Tag by Tag Id by Station")
        }
    }

    // reading digitized tag by tag
    async digitizedTagReadById(req: Request) {
        try {
            let { diId } = req.params
            let digitizedTagResponse;
            // external comm calling
            digitizedTagResponse = await tagExternalCommInstance.digitizedTagReadByIdExComm(diId);
            return Promise.resolve(digitizedTagResponse);
        }
        catch (error: any) {
            logger.error("Error Reading Digitized Tag by Tag Id by Station")
            return Promise.reject("Error Reading Digitized Tag by Tag Id by Station")
        }
    }

    // Reading Duplicate Tags By Tag Id
    async duplicateTagReadById(req: Request) {
        try {
            let { diId } = req.params
            let duplicateTagResponse;
            // external comm calling
            duplicateTagResponse = await tagExternalCommInstance.duplicateTagReadByIdExComm(diId);
            return Promise.resolve(duplicateTagResponse);
        }
        catch (error: any) {
            logger.error("Error Reading Duplicate Tag by Tag Id by Station")
            return Promise.reject("Error Reading Duplicate Tag by Tag Id by Station")
        }
    }

    // reading Track and Trace Tag by Tag Id
    async trackNTraceTagReadById(req: Request) {
        try {
            let { diId } = req.params
            let tntTagResponse;
            // external comm calling
            tntTagResponse = await tagExternalCommInstance.trackNTraceTagReadByIdExComm(diId);
            return Promise.resolve(tntTagResponse);
        }
        catch (error: any) {
            logger.error("Error Reading Track and Trace Tag by Tag Id by Station")
            return Promise.reject("Error Reading Track and Trace Tag by Tag Id by Station")
        }
    }


    // adding digitized data to collection

    async addDigitizeData(req: Request) {
        try {
            let { diId } = req.body
            if (!diId) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.TAGNOTFOUND + diId)
            }
            // external comm calling
            let digitizedResponse = await tagExternalCommInstance.addDigitizeDataExComm(req.body);
            return Promise.resolve(digitizedResponse);
        }
        catch (error: any) {
            logger.error("Error Reading Track and Trace Tag by Tag Id by Station")
            return Promise.reject("Error in digitizing the tag by Station")
        }
    }

    // syncAddTrackNTraceData
    async addTrackAndTraceData(req: Request) {
        try {
            let { diId } = req.body
            if (!diId) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.TAGNOTFOUND + diId)
            }
            // external comm calling
            let trackAndTraceResponse = await tagExternalCommInstance.commonDataProcessingExComm(req.body);
            return Promise.resolve(trackAndTraceResponse);
        }
        catch (error: any) {
            logger.error("Error Reading Track and Trace Tag by Tag Id by Station")
            return Promise.reject("Error in adding tag in track and trace by Station")
        }
    }

    async lastvalidcount(req: Request) {
        try {
            let { uuid } = req.body.data.uuid
            if (!uuid) 
            {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.UUIDNOTFOUND + uuid)
            }
            // external comm calling
            let lastvalidcountData = await tagExternalCommInstance.lastvalidcountDataExComm(req.body);
            return Promise.resolve(lastvalidcountData);
        }
        catch (error: any) {
            logger.error("Error Reading lastvalidcountData_122 in tagService device manager")
            return Promise.reject("Error in getting last valid count by Station")
        }
    }

}