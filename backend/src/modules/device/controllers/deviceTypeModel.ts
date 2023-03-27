import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { DeviceTypeModel } from "../../../config/db";
import { DeviceTypeModelService } from "../services/deviceTypeModel";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');


export class DeviceTypeModelController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new DeviceTypeModelService({model:DeviceTypeModel, logger, models}),
      model: DeviceTypeModel,
      models,
      logger
    })
  }
  
// read all

  async readAll(req:Request, res:Response){
   
         try{
                const data = await this.service.readAll(req);
                respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
            }
            catch(error){
              this.logger.error("Getting error in read all device Type Model list ")
              respHndlr.sendError(res, error);
            }
      }
    
  async readOne(req:Request, res:Response){
            try{
              const data = await this.service.readOne(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            this.logger.error("Getting error in read single device Type Model")
            respHndlr.sendError(res, error);
          }
  }
  
  

  async create(req:Request, res:Response){
    try{
      const data = await this.service.create(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
      catch(error){
          this.logger.error("Getting error in creating new device Type Model ")
          respHndlr.sendError(res, error);
      }
  }


  async update(req:Request, res:Response){
    try{
      const data = await this.service.update(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update device Type Model ")
          respHndlr.sendError(res, error);
      }
  }

  async delete(req:Request, res:Response){
    try{
      const data = await this.service.delete(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete device Type Model ")
          respHndlr.sendError(res, error);
      }
  }


  async uniuqeType(req:Request, res:Response){
    try{
      const data = await this.service.readDistinctType(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in getting unique device Type ")
          respHndlr.sendError(res, error);
      }
  }
  

} 
