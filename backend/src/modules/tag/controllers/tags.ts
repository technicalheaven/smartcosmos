import { Request, Response } from "express";
import { respHndlr } from "../../../middlewares/resp-handler";
import { TagService } from "../services/tags";
import { logger } from '../../../libs/logger';
var constant = require('../../../middlewares/resp-handler/constants')

const tagServiceInstance = new TagService()

export class TagController {

    async readAll(req: Request, res: Response) {
        tagServiceInstance.readAll(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readById(req: Request, res: Response) {
        tagServiceInstance.readById(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readAllDigitized(req: Request, res: Response) {
        tagServiceInstance.readAllDigitized(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readByIdDigitized(req: Request, res: Response) {
        tagServiceInstance.readByIdDigitized(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readByIdCheckDigitizedTag(req: Request, res: Response) {
        tagServiceInstance.readByIdCheckDigitizedTag(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readAllDuplicateTags(req: Request, res: Response) {
        tagServiceInstance.readAllDuplicateDigitizedTag(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readByIdDuplicateTags(req: Request, res: Response) {
        tagServiceInstance.readByIdDuplicateDigitized(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }


    async readAllTrackNTrace(req: Request, res: Response) {
        tagServiceInstance.readAllTrackNTrace(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async readByIdTrackNTrace(req: Request, res: Response) {
        tagServiceInstance.readByIdTrackNTrace(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async commonDuplicateDigitizedRead(req: Request, res: Response) {
        tagServiceInstance.commonDuplicateDigitizedRead(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }
    

    async create(req: Request, res: Response) {
        tagServiceInstance.create(req).then((result: any) => {
            respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS_CREATED);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async digitize(req: Request, res: Response) {
        tagServiceInstance.digitize(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async trackNTrace(req: Request, res: Response) {
        tagServiceInstance.trackNTrace(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }


    async commonDataProcessing(req: Request, res: Response) {
        tagServiceInstance.commonDataProcessing(req).then((result: any) => {
            // if(result?.duplicate){
            //     respHndlr.sendSuccessDuplicate(res, result);
            // }
            // else{
                respHndlr.sendSuccess(res, result);
            //}
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }


    async delete(req: Request, res: Response) {
        tagServiceInstance.delete(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }


    async readDistinct(req: Request, res: Response) {
        
        tagServiceInstance.readDistinctTagType(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    // read batch collection
    async readBatchByTenantId(req: Request, res: Response) {
        
        tagServiceInstance.readBatchByTenantId(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async exportData(req:any, res:any){
        try{
            await tagServiceInstance.exportData(req, res);
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }

    async exportTagData(req:any, res:any){
        try{
            await tagServiceInstance.exportTagData(req, res);
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }

    async lastExpectedCount(req: Request, res: Response) {
        tagServiceInstance.lastExpectedCount(req,res).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async deEnablement(req: Request, res: Response) {
        try{
            let result = await tagServiceInstance.deEnabledTag(req);
            respHndlr.sendSuccess(res, result);
        }
        catch(err: any) {
            respHndlr.sendError(res, err);
        }
    }

    async createProcessState(req: Request, res: Response){
        try {
            let result = await tagServiceInstance.createProcessState(req);
            respHndlr.sendSuccess(res, result);
        }
        catch (error: any) {
            respHndlr.sendError(res, error);
        }
    }

    async updateProcessState(req: Request, res: Response){
        try {
            let result = await tagServiceInstance.updateProcessState(req);
            respHndlr.sendSuccess(res, result);
        }
        catch (error: any) {
            respHndlr.sendError(res, error);
        }
    }
    async updateSiteNameInDI(req: Request, res: Response){
        try {
            let result = await tagServiceInstance.updateSiteNameInDI(req);
            respHndlr.sendSuccess(res, result);
        }
        catch (error: any) {
            respHndlr.sendError(res, error);
        }
    }
    async updateZoneNameInDI(req: Request, res: Response){
        try {
            let result = await tagServiceInstance.updateZoneNameInDI(req);
            respHndlr.sendSuccess(res, result);
        }
        catch (error: any) {
            respHndlr.sendError(res, error);
        }
    }

    async getDiExportChunkNumber(req: Request, res: Response){
        try {
            let result = await tagServiceInstance.getDiExportChunkNumber(req,res);
            respHndlr.sendSuccess(res, result);
        }
        catch (error: any) {
            respHndlr.sendError(res, error);
        }
    }

    async getTagsExportChunkNumber(req: Request, res: Response){
        try {
            let result = await tagServiceInstance.getTagsExportChunkNumber(req,res);
            respHndlr.sendSuccess(res, result);
        }
        catch (error: any) {
            respHndlr.sendError(res, error);
        }
    }
    

    
    // for secure authentication
    async retrieveTagMetaData(req: Request, res: Response) {
        tagServiceInstance.retrieveTagMetaData(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }
    async updateLastValidCounter(req: Request, res: Response) {
        tagServiceInstance.updateLastValidCounter(req, res).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }
    async activateTag(req: Request, res: Response) {
        tagServiceInstance.activateTag(req.body.tagId, req.body.activated).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    async activateBatch(req: Request, res: Response) {
        tagServiceInstance.activateBatch(req.body.batchId, req.body.activated).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }
    async isTagActivated(req: Request, res: Response) {
        tagServiceInstance.isTagActivated(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

}