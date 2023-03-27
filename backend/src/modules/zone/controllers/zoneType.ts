import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { ZoneType } from "../../../config/db";
import { ZoneTypeService } from "../services/zoneType";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
var constant = require('../../../middlewares/resp-handler/constants')


export class ZoneTypeController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new ZoneTypeService({model:ZoneType, logger, models}),
      model: ZoneType,
      models,
      logger
    })
  }

  async create(req: Request, res: Response) {
    this.service.createZoneType(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }


  async readOne(req: Request, res: Response) {
    this.service.readOne(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async readByName(req: Request, res: Response) {
    this.service.getZoneTypeByName(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }


  async readAll(req: Request, res: Response) {
    this.service.zoneTypeReadAll(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async update(req: Request, res: Response) {
    this.service.updateZoneType(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async delete(req: Request, res: Response) {
    this.service.deleteZoneType(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

}
