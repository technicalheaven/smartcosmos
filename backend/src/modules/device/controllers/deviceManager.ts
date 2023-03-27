import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { DeviceManager } from "../../../config/db";
import { DeviceManagerService } from "../services/deviceManager";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');


export class DeviceManagerController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new DeviceManagerService({model:DeviceManager, logger, models}),
      model: DeviceManager,
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
              this.logger.error("Getting error in read all device manager list ")
              respHndlr.sendError(res, error);
            }
      }
    
  async readOne(req:Request, res:Response){
            try{
              const data = await this.service.readOne(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            this.logger.error("Getting error in read single device manager")
            respHndlr.sendError(res, error);
          }
  }
  
  

  async create(req:Request, res:Response){
    try{
      const data = await this.service.create(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
      catch(error){
          this.logger.error("Getting error in creating new device manager ")
          respHndlr.sendError(res, error);
      }
  }


  async update(req:Request, res:Response){
    try{
      const data = await this.service.update(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update device manager ")
          respHndlr.sendError(res, error);
      }
  }

  async delete(req:Request, res:Response){
    try{
      const data = await this.service.delete(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete device manager ")
          respHndlr.sendError(res, error);
      }
  }

  // for data sync

  async syncDeviceManager(req: Request, res: Response) {
    try {
      const deviceId = req.body.deviceId;
      const deviceData = req.body.data;
      this.logger.info('Device Manager ready for syncing...','Device ID => ',deviceId, 'deviceData=>',deviceData);
     // await publishMsg(deviceData, deviceData?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.CREATE)

      respHndlr.sendSuccessWithMsg(res, "Device Manager data synced");
    }
    catch (error) {
      this.logger.error("Error while syncing Device Data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncDeviceManagerUpdate(req: Request, res: Response) {
    try {
      const deviceId = req.body.deviceId;
      const deviceData = req.body.data;
      const params = {deviceId:deviceId}
      this.logger.info('Device Manager ready for syncDeviceUpdate...','Device ID => ',deviceId, 'deviceData=>',deviceData);
      //await publishMsg(deviceData, deviceData?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.UPDATE, params)

        respHndlr.sendSuccessWithMsg(res, "Device updated data received");
    }
    catch (error) {
      this.logger.error("Error while receiving Device Manager updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncDeviceManagerDelete(req: Request, res: Response) {
    try {
      
      const deviceId=req.params.id; 
      this.logger.info("Delete id for Device Manager synced", deviceId);
      const tenantId = req?.body?.tenantId
      const deviceData = {deviceId:deviceId, tenantId:tenantId}
      const params = {deviceId:deviceId}
     // await publishMsg(deviceData, deviceData?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.DELETE, params)
      respHndlr.sendSuccessWithMsg(res, "Device Manager updated  data received");
    }
    catch (error) {
      this.logger.error("Error while receiving Device Manager updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

} 
