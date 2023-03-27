import { Request, Response } from 'express';
import { respHndlr } from '../../../middlewares/resp-handler';
import { publishMsg } from '../sync-service/rmq/helpers/publishMsg';
import { SyncDataAction, SyncDataEntity } from '../sync-service/rmq/helpers/rmqConfig';
import { logger } from '../../../libs/logger'
var constant = require('../../../middlewares/resp-handler/constants');

export class ProductController {
  
  constructor({ logger }: any) {
     
  } 


  async syncProduct(req: Request, res: Response) {
    try {
      const {tenantId, data: productData, action } = req.body;
      logger.info('Product ready for syncing...','Tenant ID => ',tenantId, 'ProductData=>',productData);
      await publishMsg(productData, tenantId, SyncDataEntity.PRODUCTS, action)
      respHndlr.sendSuccessWithMsg(res, "Product data synced");
    }
    catch (error) {
      logger.error("Error while syncing Product in device module ")
      respHndlr.sendError(res, error);
    }
  }


  async syncProductUpdate(req: Request, res: Response) {
    try {
        const tenantId = req.body.tId;
        const productData = req.body.data;
        logger.info('Product ready for Product updated data...','Product ID => ',tenantId, 'ProductData=>',productData);
        respHndlr.sendSuccessWithMsg(res, "Product updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Updated Product data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncProductUpdateByUpc(req: Request, res: Response) {
    try {
        const tenantId = req.body.tenantId;
        const productData = req.body;
        const upc = req.body.upc
        const params = {upc}
        logger.info('Product updated data ready for syncing...','Product ID => ',tenantId, 'ProductData=>',productData);
        await publishMsg(productData, productData?.tenantId, SyncDataEntity.PRODUCTS, SyncDataAction.UPDATE, params)
        respHndlr.sendSuccessWithMsg(res, "Product updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Updated Product data in device module ")
      respHndlr.sendError(res, error);
    }
  }
  
  async syncProductdelete(req: Request, res: Response) {
    try {
      const id=req.params.id; 
    
      logger.info("Delete id for Product synced", id);
      respHndlr.sendSuccessWithMsg(res, "Product updated data received");
    }
    catch (error) {
      logger.error("Error while receiving Product deleted data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  async syncProductBulkdelete(req: Request, res: Response) {
    try {
      const productArray=req.body.productIds; 
      const tenantId=req.body.tenantId; 

      productArray.forEach(async (element:any) => {
        const productData = {productId:element, tenantId:tenantId}
        const params = {productId:element}
         await publishMsg(productData, tenantId, SyncDataEntity.PRODUCTS, SyncDataAction.DELETE, params)
         logger.info('Product Delete data ready for syncing...','Product ID => ',tenantId, 'ProductData=>',productData);
        });
        
        respHndlr.sendSuccessWithMsg(res, "Product delete data received");
    }
    catch (error) {
      logger.error("Error while receiving Product deleted data in device module ")
      respHndlr.sendError(res, error);
    }
  }

  

}
