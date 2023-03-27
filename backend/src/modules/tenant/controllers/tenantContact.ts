import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { TenantContact } from "../../../config/db";
import { TenantContactService } from "../services/tenantContact";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');


export class TenantContactController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new TenantContactService({model:TenantContact, logger, models}),
      model: TenantContact,
      models,
      logger
    })
  }
  
// read all

  async readAll(req:Request, res:Response){
   
         try{
                const data = await this.service.readAllTenantContact(req);
                respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
            }
            catch(error){
              this.logger.error("Getting error in read all tenant contact ")
              respHndlr.sendError(res, error);
            }
      }
    
  async readOne(req:Request, res:Response){
            try{
              const data = await this.service.readOneTenantContact(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            this.logger.error("Getting error in read single tenant contact")
            respHndlr.sendError(res, error);
          }
  }
  
  

  async create(req:Request, res:Response){
    try{
      const data = await this.service.createTenantContact(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
      catch(error){
          this.logger.error("Getting error in creating new tenant contact")
          respHndlr.sendError(res, error);
      }
  }


  async update(req:Request, res:Response){
    try{
      const data = await this.service.updateTenantContact(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update tenant contact ")
          respHndlr.sendError(res, error);
      }
  }

  async delete(req:Request, res:Response){
    try{
      const data = await this.service.deleteTenantContact(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete tenant contact")
          respHndlr.sendError(res, error);
      }
  }

  
} 
