import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { ProcessAction } from "../../../config/db";
import { ProcessActionService } from "../services/processAction";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
//import { ProcessAction } from "../models/processAction";
var constant = require('../../../middlewares/resp-handler/constants')


export class ProcessActionController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new ProcessActionService({model:ProcessAction, logger, models}),
      model: ProcessAction,
      models,
      logger
    })
  }

  async readOne(req: Request, res: Response) {
    this.service.processActionReadOne(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }


  async readAll(req: Request, res: Response) {
    this.service.processActionReadAll(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

}
