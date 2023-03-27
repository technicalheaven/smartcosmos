import { Request, Response } from "express";
import { respHndlr } from "../../../middlewares/resp-handler";
import { TagSyncService } from "../services/tagService";
var constant = require('../../../middlewares/resp-handler/constants')

const SynctagServiceInstance = new TagSyncService()

export class SyncTagController {
    
   
    // read by tagId for tags collections
    async syncReadTagsById(req: Request, res: Response) {
        SynctagServiceInstance.tagReadById(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

   
    // read Digitized by diId 
    async syncReadDigitizedTagById(req: Request, res: Response) {
        SynctagServiceInstance.digitizedTagReadById(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

   // read DuplicateTags by diId 
    async syncReadDuplicateTagsById(req: Request, res: Response) {
        SynctagServiceInstance.duplicateTagReadById(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

    // read TrackNTrace data by diId 
    async syncReadTrackNTraceById(req: Request, res: Response) {
        SynctagServiceInstance.trackNTraceTagReadById(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }
    // create digitize data
    async syncAddDigitizeData(req: Request, res: Response) {
        SynctagServiceInstance.addDigitizeData(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }
    // create Track and Trace data
    async syncAddTrackNTraceData(req: Request, res: Response) {
        SynctagServiceInstance.addTrackAndTraceData(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }


    async lastvalidcount(req: Request, res: Response) {
        SynctagServiceInstance.lastvalidcount(req).then((result: any) => {
            respHndlr.sendSuccess(res, result);
        }).catch((err: any) => {
            respHndlr.sendError(res, err);
        });
    }

 
}