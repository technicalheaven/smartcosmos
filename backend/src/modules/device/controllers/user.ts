import { Request, Response } from 'express';
import { logger } from '../../../libs/logger';
import { respHndlr } from '../../../middlewares/resp-handler';
import { publishMsg } from '../sync-service/rmq/helpers/publishMsg';
import { SyncDataAction, SyncDataEntity } from '../sync-service/rmq/helpers/rmqConfig';

var constant = require('../../../middlewares/resp-handler/constants');

export class UserController {
 
  constructor({ logger }: any) {
  } 

   async syncUser(req: Request, res: Response) {
    try {      
      const userId = req.body.userId;
      const userData = req.body.data;
      await publishMsg(userData, userData?.tenantId, SyncDataEntity.USERS, SyncDataAction.CREATE)
      respHndlr.sendSuccessWithMsg(res, "User data synced");
    }
    catch (error) {
      logger.error("Error while syncing User in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncUserUpdate(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const userData = req.body.data;
        logger.info('User ready for syncing Update...','User ID => ',userId, 'UserData=>',userData);
        const params = {userId:userId}
        await publishMsg(userData, userData?.tenantId, SyncDataEntity.USERS, SyncDataAction.UPDATE, params)
        respHndlr.sendSuccessWithMsg(res, "User updated data received");
    }
    catch (error) {
      logger.error("Error while receiving User updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncUserdelete(req: Request, res: Response) {
    try {
      const userId = req?.body?.userId;
      const tenantId = req?.body?.tenantId
      const userData = {userId:userId, tenantId:tenantId}
      const params = {userId:userId} 
      await publishMsg(userData, userData?.tenantId, SyncDataEntity.USERS, SyncDataAction.DELETE, params)
      respHndlr.sendSuccessWithMsg(res, "User updated data received");
    }
    catch (error) {
      logger.error("Error while receiving User updated data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncUserulkdelete(req: Request, res: Response) {
    try {

      const tenantId = req?.body?.tenantId
      const deletedUser = req?.body?.deletedUser
      
      deletedUser.forEach(async (element:any) => {
          logger.info(element);
          const userData = {userId:element, tenantId:tenantId}
          const params = {userId:element}
        
           await publishMsg(userData, userData?.tenantId, SyncDataEntity.USERS, SyncDataAction.DELETE, params)
          });
          respHndlr.sendSuccessWithMsg(res, "User updated data received");
    }
    catch (error) {
      logger.error("Error while receiving multiple User deleted data in device module")
      respHndlr.sendError(res, error);
    }
  }

}
