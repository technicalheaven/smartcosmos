import { Request, Response } from 'express';
import { respHndlr } from '../../../middlewares/resp-handler';
import { publishMsg } from '../sync-service/rmq/helpers/publishMsg';
import { SyncDataAction, SyncDataEntity } from '../sync-service/rmq/helpers/rmqConfig';
import BaseController from '../../../core/controllers/base';
import { logger } from '../../../libs/logger'

export class ZoneController {
  
  constructor({ logger, models }: any) {
    
  } 


  async syncZone(req: Request, res: Response) {
    try {
      const zoneId = req.body.zoneId;
      const zoneData = req.body.data;
      logger.info('Zone ready for syncing...','Zone ID => ',zoneId, 'ZoneData=>',zoneData);
      await publishMsg(zoneData, zoneData?.tenantId, SyncDataEntity.ZONES, SyncDataAction.CREATE)

      respHndlr.sendSuccessWithMsg(res, "zone data synced");
    }
    catch (error) {
      logger.error("Error while syncing zone in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncZoneUpdate(req: Request, res: Response) {
    try {      
        const zoneId = req.body.zoneId;
      const zoneData = req.body.data;
      const params = {zoneId:zoneId}
      logger.info('Zone ready for syncing update...','Zone ID => ',zoneId, 'ZoneData=>',zoneData);
      await publishMsg(zoneData, zoneData?.tenantId, SyncDataEntity.ZONES, SyncDataAction.UPDATE, params)

        respHndlr.sendSuccessWithMsg(res, "Zone updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Zone updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncZonedelete(req: Request, res: Response) {
    try {
       const tenantId = req?.body?.tenantId
       const zoneId = req?.body?.zoneId
       const zoneData = {zoneId:zoneId, tenantId:tenantId}
       const params = {zoneId:zoneId}
       await publishMsg(zoneData, zoneData?.tenantId, SyncDataEntity.ZONES, SyncDataAction.DELETE, params)
      respHndlr.sendSuccessWithMsg(res, "Zone updated data received");
      return "Zone updated data received";
    }
    catch (error) {
      logger.error("Error while receiving Zone updated data in device module_59")
      respHndlr.sendError(res, error);
    }
  }

  async syncZoneBulkdelete(req: Request, res: Response) {
    try {
        logger.debug("Req Body in syncZoneBulkdelete..", req.body, req.params)
      const tenantId = req?.body?.tenantId
      const zoneIdArray = req?.body?.zoneIdArray
      logger.debug("zoneIdArray__68",zoneIdArray)
      zoneIdArray.forEach(async (element:any) => {
          logger.info(element);
          const zoneData = {zoneId:element, tenantId:tenantId}
          logger.debug("ZoneData..", zoneData)
          const params = {zoneId:element}
        
          await publishMsg(zoneData, zoneData?.tenantId, SyncDataEntity.ZONES, SyncDataAction.DELETE, params)
          });
          respHndlr.sendSuccessWithMsg(res, "Zone updated data received");
    }
    catch (error) {
       logger.error("Error while receiving multiple zone deleted data in device module")
      respHndlr.sendError(res, error);
    }
  }
}