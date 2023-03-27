import { Request, Response } from "express";
import { User } from "../../../config/db";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
import { AuthenticationService } from "../services/authentication";

export class AuthenticationController extends BaseController{
  constructor({logger, models}:any){
    super({
      service: new AuthenticationService({model:User, logger, models}),
      model: User,
      models,
      logger
    })
  }
  
  async login(req:Request, res:Response){
    try{
        const data = await this.service.login(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async logout(req:Request, res:Response){
    try{
        const data = await this.service.logout(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async resetToken(req:Request, res:Response){
    try{
        const data = await this.service.resetToken(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async changePassword(req:Request, res:Response){
    try{
        const data = await this.service.changePassword(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async forgotPasswordSendEmail(req:Request, res:Response){
    try{
        const data = await this.service.forgotPasswordSendEmail(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async forgotPassword(req:Request, res:Response){
    try{
        const data = await this.service.forgotPassword(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async resendInvite(req:Request, res:Response){
    try{
        const data = await this.service.resendInvite(req);
        respHndlr.sendSuccess(res, data);
    }
    catch(error){
        respHndlr.sendError(res, error);
    }    
  }

  async refreshToken(req:Request, res:Response) {
    try{
      const data = await this.service.refreshToken(req)
      respHndlr.sendSuccess(res, data)
    }
    catch(error) {
      respHndlr.sendError(res,error)
    }
  }
}
