import { Request, Response } from "express";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
import { Role } from "../models/role";
import { RoleService } from "../services/role";
var constant = require('../../../middlewares/resp-handler/constants')

export class RoleController extends BaseController{
  constructor({logger, models}:any){
    super({
      service: new RoleService({model:Role, logger, models}),
      model: Role,
      models,
      logger
    })
  }

  async readOne(req: Request, res: Response) {
    this.service.readOne(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    })
      .catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async readAll(req: Request, res: Response) {
    this.service.roleReadAll(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    })
      .catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }



}
