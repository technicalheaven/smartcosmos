import { Request, Response } from 'express';
import { respHndlr } from '../../../middlewares/resp-handler';
import { publishMsg } from '../sync-service/rmq/helpers/publishMsg';
import { SyncDataAction, SyncDataEntity } from '../sync-service/rmq/helpers/rmqConfig';
import { logger } from '../../../libs/logger'
var constant = require('../../../middlewares/resp-handler/constants');

export class SiteController {
  
  constructor({ logger }: any) {
     
  } 


  async syncSite(req: Request, res: Response) {
    try {
      const siteId = req.body.siteId;
      const siteData = req.body.data;
      logger.info('Site ready for syncing...','Site ID => ',siteId, 'SiteData=>',siteData);
      await publishMsg(siteData, siteData?.tenantId, SyncDataEntity.SITES, SyncDataAction.CREATE)
      respHndlr.sendSuccessWithMsg(res, "Site data synced");
    }
    catch (error) {
      logger.error("Error while syncing Site in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncSiteUpdate(req: Request, res: Response) {
    try {      
        const siteId = req.body.siteId;
        const siteData = req.body.data;
        const params = {siteId:siteId}
        logger.info('Site ready for syncing updated data...','Site ID => ',siteId, 'SiteData=>',siteData);
        await publishMsg(siteData, siteData?.siteTenant[0]?.tenantId, SyncDataEntity.SITES, SyncDataAction.UPDATE, params)

        respHndlr.sendSuccessWithMsg(res, "Site updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Site updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncSitedelete(req: Request, res: Response) {
    try {      
      const tenantId = req?.body?.tenantId
      const siteId = req?.body?.siteId
      const siteData = {siteId:siteId, tenantId:tenantId}
      const params = {siteId:siteId}
      await publishMsg(siteData, siteData?.tenantId, SyncDataEntity.SITES, SyncDataAction.DELETE, params)
      respHndlr.sendSuccessWithMsg(res, "Site updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Site updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  // for bulk delete
  async syncSiteBulkdelete(req: Request, res: Response) {
    try {

      const tenantId = req?.body?.tenantId
      const siteArray = req?.body?.siteIdArray
      siteArray.forEach(async (element:any) => {
          const siteData = {siteId:element, tenantId:tenantId}
          const params = {siteId:element}
           await publishMsg(siteData, siteData?.tenantId, SyncDataEntity.SITES, SyncDataAction.DELETE, params)
          });
          respHndlr.sendSuccessWithMsg(res, "Site updated data received");
        }
    catch (error) {
      logger.error("Error while receiving multiple Site deleted data in device module")
      respHndlr.sendError(res, error);
    }
  }

}
