import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Tenant } from "../../../config/db";
import { TenantService } from "../services/tenant";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');

export class TenantController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new TenantService({model:Tenant, logger, models}),
      model: Tenant,
      models,
      logger
    })
  }
  
// read all

  async readAll(req:Request, res:Response){
   
         try{
                const data = await this.service.readAllTenant(req);
                respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
            }
            catch(error){
              this.logger.error("Getting error in read all tenant ")
              respHndlr.sendError(res, error);
            }
      }
    
  async readOne(req:Request, res:Response){
            try{
              const data = await this.service.readOneTenant(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            this.logger.error("Getting error in read single tenant")
            respHndlr.sendError(res, error);
          }
  }
  
  

  async create(req:Request, res:Response){
    try{
      const data = await this.service.createTenant(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
      catch(error){
          this.logger.error("Getting error in creating new tenant ")
          respHndlr.sendError(res, error);
      }
  }


  async update(req:Request, res:Response){
    try{
      const data = await this.service.updateTenant(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update tenant ")
          respHndlr.sendError(res, error);
      }
  }

  async delete(req:Request, res:Response){
    try{
      const data = await this.service.deleteTenant(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update tenant ")
          respHndlr.sendError(res, error);
      }
  }
  async restore(req:Request, res:Response){
    try{
      const data = await this.service.restoreTenant(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in restore tenant ")
          respHndlr.sendError(res, error);
      }
  }

  

  async uploadImage(req: Request, res: Response) {
    this.service.uploadImagetoS3(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

} 
