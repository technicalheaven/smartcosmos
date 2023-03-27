import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { DeviceConfig } from "../../../config/db";
import { DeviceService } from "../services/device";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
import { SyncDataAction, SyncDataEntity } from "../sync-service/rmq/helpers/rmqConfig";
import { publishMsg } from "../sync-service/rmq/helpers/publishMsg";
var constant = require('../../../middlewares/resp-handler/constants');


export class DeviceController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new DeviceService({model:DeviceConfig, logger, models}),
      model: DeviceConfig,
      models,
      logger
    })
  }
  
// read all

  async readAll(req:Request, res:Response){
   
         try{
                const data = await this.service.readAllDevice(req);
                respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
            }
            catch(error){
              this.logger.error("Getting error in read all device list ")
              respHndlr.sendError(res, error);
            }
      }
    
  async readOne(req:Request, res:Response){
            try{
              const data = await this.service.readOneDevice(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
          }
          catch(error){
            this.logger.error("Getting error in read single device")
            respHndlr.sendError(res, error);
          }
  }

  async readDeviceByZoneId(req:Request, res:Response){
    try{
      const data = await this.service.readDeviceSiteZoneProcessByZoneId(req);

      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch(error){
      this.logger.error("Getting error in reading device by zone id")
      respHndlr.sendError(res, error);
    }
  }

  async readDeviceBySiteId(req: Request, res: Response) {
    try{
      const data = await this.service.readDeviceSiteZoneProcessBySiteId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch(error){
      this.logger.error("Getting error in reading device by site id")
      respHndlr.sendError(res, error);
    }
  }


  async deviceCount(req:Request, res:Response){
    try{
      const data = await this.service.deviceCount(req);  
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
  }
  catch(error){
    this.logger.error("Getting error to count device")
    respHndlr.sendError(res, error);
  }
}
  
  

  async create(req:Request, res:Response){
    try{
      const data = await this.service.createDevice(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
      catch(error){
          this.logger.error("Getting error in creating new device ")
          respHndlr.sendError(res, error);
      }
  }


  async update(req:Request, res:Response){
    try{
      const data = await this.service.updateDevice(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in update device ")
          respHndlr.sendError(res, error);
      }
  }

  async updateDeviceSiteZoneProcess(req:Request, res:Response){
    try{
      const data = await this.service.updateDeviceSiteZoneProcess(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch(error){
      this.logger.error("Getting error in updating deviceSiteZoneProcess")
      respHndlr.sendError(res, error);
    }
  }

  async getDeviceSiteZoneProcess(req:Request, res:Response){
    try{
      const data = await this.service.getDeviceSiteZoneProcess(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch(error){
      this.logger.error("Getting error in updating deviceSiteZoneProcess")
      respHndlr.sendError(res, error);
    }
  }

  async delete(req:Request, res:Response){
    try{
      const data = await this.service.deleteDevice(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete device ")
          respHndlr.sendError(res, error);
      }
  }

  async updateStatus(req:Request, res:Response){
    try{
      const data = await this.service.updateDeviceStatus(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in device status update ")
          respHndlr.sendError(res, error);
      }
  }

  

  async checkRunningProcessUsingSiteId(req:Request, res:Response){
    try{
      const data = await this.service.checkRunningProcessUsingSiteId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in checkRunningProcessUsingSiteId controller error")
          respHndlr.sendError(res, error);
      }
  }

  async checkRunningProcessUsingZoneId(req:Request, res:Response){
    try{
      const data = await this.service.checkRunningProcessUsingZoneId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in checkRunningProcessUsingZoneId controller error")
          respHndlr.sendError(res, error);
      }
  }
  
  async deleteViaTenantId(req:Request, res:Response){
    try{
      const data = await this.service.deleteDeviceViaTenantId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete device via tenant id")
          respHndlr.sendError(res, error);
      }
  }
  async restoreViaTenantId(req:Request, res:Response){
    try{
      const data = await this.service.restoreDeviceViaTenantId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in restore device via tenant id")
          respHndlr.sendError(res, error);
      }
  }
  
  async deleteViaSiteId(req:Request, res:Response){
    try{
      const data = await this.service.deleteDeviceViaSiteId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in delete device via siteid")
          respHndlr.sendError(res, error);
      }
  }

  async getAllDeviceCount(req:Request, res:Response){
    try{
      const data = await this.service.getAllDeviceCount(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in device count via siteid")
          respHndlr.sendError(res, error);
      }
  }
  
 

  async assignSiteZone(req:Request, res:Response){
    try{
      const data = await this.service.assignSiteZone(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in device assignment ")
          respHndlr.sendError(res, error);
      }
  }

  async unassignDeviceViaProcessId(req:Request, res:Response){
    try{
      const data = await this.service.unassigProcess(req)
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){ 
        this.logger.error("Getting error in device assignment ")
          respHndlr.sendError(res, error);
      }
  }

  async unassignDeviceViaZoneId(req:Request, res:Response){
    try{
      const data = await this.service.unassignDeviceViaZoneId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in device assignment ")
          respHndlr.sendError(res, error);
      }
  }

  
  async unassignDeviceViaTenantId(req:Request, res:Response){
    try{
      this.logger.info("unassignDeviceViaTenantId Controller")
      const data = await this.service.unassignDeviceViaTenantId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in unassign device via tenant Id unassignDeviceViaTenantId")
          respHndlr.sendError(res, error);
      }
  }

  async unassignDeviceViaSiteId(req:Request, res:Response){
    try{
      this.logger.info("unassignDeviceViaSiteId Controller")
      const data = await this.service.unassignDeviceViaSiteId(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in unassign device via tenant Id unassignDeviceViaSiteId")
          respHndlr.sendError(res, error);
      }
  }
  


  

  // for sync
  // for synced data

  async syncDevice(req: Request, res: Response) {
    try {
      const deviceId = req.body.deviceId;
      const deviceData = req.body.data;
      this.logger.info('Device ready for syncing...','Device ID => ',deviceId, 'deviceData=>',deviceData);
      await publishMsg(deviceData, deviceData?.deviceSiteZoneProcess[0]?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.CREATE)

      respHndlr.sendSuccessWithMsg(res, "Device data synced");
    }
    catch (error) {
      this.logger.error("Error while syncing Device Data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncDeviceUpdate(req: Request, res: Response) {
    try {
      const deviceId = req.body.deviceId;
      const deviceData = req.body.data;
      const params = {deviceId:deviceId}
      this.logger.info('Device ready for syncDeviceUpdate...','Device ID => ',deviceId, 'deviceData=>',deviceData);
      await publishMsg(deviceData, deviceData?.deviceSiteZoneProcess[0]?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.UPDATE, params)

        respHndlr.sendSuccessWithMsg(res, "Device updated data received");
    }
    catch (error) {
      this.logger.error("Error while receiving Device updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncDeviceDelete(req: Request, res: Response) {

    this.logger.debug("Req body inside syncDeviceDelete...", req.body, req.params)
    try {
    
      this.logger.info("Delete id for Device synced");
      const tenantId = req?.body?.tenantId
      const deviceId = req?.body?.deviceId
      const deviceData = {deviceId:deviceId, tenantId:tenantId}
      const params = {deviceId:deviceId}
      await publishMsg(deviceData, deviceData?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.DELETE, params)
      respHndlr.sendSuccessWithMsg(res, "Device updated data received");
    }
    catch (error) {
      this.logger.error("Error while receiving Device updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  // for bulk
  async syncDeviceBulkdelete(req: Request, res: Response) {
    try {

      const tenantId = req?.body?.tenantId
      const deletedDeviceId = req?.body?.deletedDeviceId
      
      deletedDeviceId.forEach(async (element:any) => {
          this.logger.info(element);
          const deviceData = {deviceId:element, tenantId:tenantId}
          const params = {deviceId:element}
           await publishMsg(deviceData, deviceData?.tenantId, SyncDataEntity.DEVICES, SyncDataAction.DELETE, params)
          });
          respHndlr.sendSuccessWithMsg(res, "Device updated data received");
    }
    catch (error) {
      this.logger.error("Error while receiving multiple Device deleted data in device module")
      respHndlr.sendError(res, error);
    }
  }

} 
