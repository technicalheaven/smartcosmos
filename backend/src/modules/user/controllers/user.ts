import { Request, Response } from "express";
import { User } from "../../../config/db";
import { UserService } from "../services/user";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
var constant = require('../../../middlewares/resp-handler/constants')
export class UserController extends BaseController{
  constructor({logger, models}:any){
    super({
      service: new UserService({model:User, logger, models}),
      model: User,
      models,
      logger
    })
  }

  async create(req: Request, res: Response) {
    this.service.create(req).then((result: any) => {   
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


  async readAll(req: Request, res: Response) {
    this.service.readUser(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async update(req: Request, res: Response) {
    this.service.update(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async delete(req: Request, res: Response) {
    this.service.deleteUser(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  

  async checkUserWithSite(req: Request, res: Response) {
    this.service.checkUserWithSite(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async deleteSite(req: Request, res: Response) {
    this.service.deleteUserWithSite(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async deleteTenant(req: Request, res: Response) {
    this.service.deleteUserWithTenant(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async uploadImage(req: Request, res: Response) {
    this.service.uploadImagetoS3(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async restoreUserWithTenantId(req: Request, res: Response) {
    this.service.restoreUserWithTenant(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }
  
  async restoreUserWithSiteId(req: Request, res: Response) {
    this.service.restoreUserWithSite(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }




}
