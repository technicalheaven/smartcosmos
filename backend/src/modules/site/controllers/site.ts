import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Site } from "../../../config/db";
import { SiteService } from "../services/site";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');


export class SiteController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new SiteService({model:Site, logger, models}),
      model: Site,
      models,
      logger
    })
  }
  
// read all

  async readAll(req:Request, res:Response){
   
         try{
                const data = await this.service.readAllSite(req);
                respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
            }
            catch(error){
              this.logger.error("Getting error in read all site ")
              respHndlr.sendError(res, error);
            }
      }
    
  async readOne(req:Request, res:Response){
            try{
              const data = await this.service.readOneSite(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            this.logger.error("Getting error in read single site")
            respHndlr.sendError(res, error);
          }
  }
  
  async siteCount(req:Request, res:Response){
    try{
      const data = await this.service.siteCount(req); 
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
  }
  catch(error){
    this.logger.error("Getting error to count site")
    respHndlr.sendError(res, error);
  }
}

  async getTenantSite(req:Request, res:Response){
            try{
              const data = await this.service.getTenantSite(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            respHndlr.sendError(res, error);
          }
  }
  
  

  async create(req:Request, res:Response){
    try{
      const data = await this.service.createSite(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
      catch(error){
          this.logger.error("Getting error in creating new site ")
          respHndlr.sendError(res, error);
      }
  }


  async update(req:Request, res:Response){
    try{
      const data = await this.service.updateSite(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update site ")
          respHndlr.sendError(res, error);
      }
  }

  async delete(req:Request, res:Response){
    try{
      const data = await this.service.deleteSite(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete site ")
          respHndlr.sendError(res, error);
      }
  }

  async deleteTenant(req:Request, res:Response){
    try{
      
      const data = await this.service.deleteSiteViaTenantId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete site ")
          respHndlr.sendError(res, error);
      }
  }

  async assignDevice(req:Request, res:Response){
    try{
      const data = await this.service.updateDeviceCount(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in device assignment ")
          respHndlr.sendError(res, error);
      }
  }

  async updateSiteStatus(req:Request, res:Response){
    try{
      const data = await this.service.updateSiteStatus(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in chaning site status ")
          respHndlr.sendError(res, error);
      }
  }

  

} 
