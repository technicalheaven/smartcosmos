import { Request, Response } from 'express';
import { respHndlr } from '../../../middlewares/resp-handler';
import { publishMsg } from '../sync-service/rmq/helpers/publishMsg';
import { SyncDataAction, SyncDataEntity } from '../sync-service/rmq/helpers/rmqConfig';
import { logger } from '../../../libs/logger'
var constant = require('../../../middlewares/resp-handler/constants');

export class ProcessController {
  
 constructor({ logger }: any) {
     
  } 


  async syncProcess(req: Request, res: Response) {
    try {
      const processId = req.body.processId;
      const processData = req.body.data;
      logger.info('Process ready for syncing...','Process ID => ',processId);
      await publishMsg(processData, processData?.tenantId, SyncDataEntity.PROCESSES, SyncDataAction.CREATE)
      respHndlr.sendSuccessWithMsg(res, "Process data synced");
    }
    catch (error) {
      logger.error("Error while syncing Process in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncProcessUpdate(req: Request, res: Response) {
    try {
        const processId = req.body.processId;
        let processData = req.body.data;
        processData.processId=req.body.processId;
        const params = {processId:processId}
        logger.info('Process ready for syncing Update...','Process ID => ',processId);
        processData.dataValues.workflow = processData?.workflow
        await publishMsg(processData?.dataValues, processData?.dataValues?.tenantId, SyncDataEntity.PROCESSES, SyncDataAction.UPDATE, params)
        respHndlr.sendSuccessWithMsg(res, "Process data synced");
    }
    catch (error) {
      logger.error("Error while receiving Process updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncProcessdelete(req: Request, res: Response) {

    logger.debug("Req inside syncProcessdelete...", req.body, req.params)
    try {
     
      const tenantId = req?.body?.tenantId
      const processId = req?.body?.processId
      const processData = {processId:processId, tenantId:tenantId}
      const params = {processId:processId}
      await publishMsg(processData, processData?.tenantId, SyncDataEntity.PROCESSES, SyncDataAction.DELETE, params)
      respHndlr.sendSuccessWithMsg(res, "Process updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Process updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncProcessBulkdelete(req: Request, res: Response) {
    try {

      const tenantId = req?.body?.tenantId
      const deletedProcessIds = req?.body?.deletedProcessIds
      
      deletedProcessIds.forEach(async (element:any) => {
          const processData = {processId:element, tenantId:tenantId}
          const params = {processId:element}
        
          await publishMsg(processData, processData?.tenantId, SyncDataEntity.PROCESSES, SyncDataAction.DELETE, params)
          });
          respHndlr.sendSuccessWithMsg(res, "Process updated data received");
    }
    catch (error) {
      logger.error("Error while receiving multiple Process deleted data in device module")
      respHndlr.sendError(res, error);
    }
  }
}