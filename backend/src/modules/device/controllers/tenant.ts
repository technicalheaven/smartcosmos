import { Request, Response } from 'express';
import { respHndlr } from '../../../middlewares/resp-handler';
import { publishMsg } from '../sync-service/rmq/helpers/publishMsg';
import { SyncDataAction, SyncDataEntity } from '../sync-service/rmq/helpers/rmqConfig';
import { logger } from '../../../libs/logger'
var constant = require('../../../middlewares/resp-handler/constants');

export class TenantController {
 
  constructor({ logger }: any) {
     
  } 


  async syncTenant(req: Request, res: Response) {
    try {
      const tenantId = req.body?.data?.tenantId;
      const tenantData = req.body?.data;
      logger.info('Tenant ready for syncing...','Tenant ID => ',tenantId);
      await publishMsg(tenantData, tenantData?.tenantId, SyncDataEntity.TENANTS, SyncDataAction.CREATE)
     
     respHndlr.sendSuccessWithMsg(res, "Tenant data synced");
    }
    catch (error) {
      logger.error("Error while syncing Tenant in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncTenantUpdate(req: Request, res: Response) {
    try {
        const tenantId = req.body.tenantId;
        const tenantData = req.body.data;
        const params = {tenantId:tenantId}
        logger.info('Tenant updated data ready for syncing...',"Tenant ID => ",tenantId);
        await publishMsg(tenantData, tenantData?.tenantId, SyncDataEntity.TENANTS, SyncDataAction.UPDATE, params)
        respHndlr.sendSuccessWithMsg(res, "Tenant updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Tenant updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncTenantdelete(req: Request, res: Response) {
    try {
      const tenantId=req.params.id; 
      logger.info("Delete id for tenant synced", tenantId);
      const tenantData = {tenantId:tenantId}
      const params = {tenantId:tenantId}
      await publishMsg(tenantData, tenantData?.tenantId, SyncDataEntity.TENANTS, SyncDataAction.DELETE,params)
      respHndlr.sendSuccessWithMsg(res, "Tenant updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Tenant updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

}