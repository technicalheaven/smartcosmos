import { Request, Response } from "express";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
import { Permission } from "../../../config/db";
import {PermissionService} from "../services/permissions" 
var constant = require('../../../middlewares/resp-handler/constants')

export class PremissionController extends BaseController{
  constructor({logger, models}:any){
    super({
      service: new PermissionService({model:Permission, logger, models}),
      model: Permission,
      // models,
      logger
    })
  }

  async readOne(req: Request, res: Response) {
    this.service.getPermissionById(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    })
      .catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async readAll(req: Request, res: Response) {
    this.service.getPermission(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    })
      .catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }



}
