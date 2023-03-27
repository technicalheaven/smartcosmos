import { Express, Request, Response } from 'express';
import BaseController from '../../../core/controllers/base';
import { Enablement } from "../../../config/db";
import { DashboardService } from '../services/dashboard';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');

export class DashboardController extends BaseController{
  constructor({ logger, models }: any) {
    super({
      service: new DashboardService({ model: Enablement, logger, models }),
      model: Enablement,
      models,
      logger
    })
  }

  async getReportDashboard(req: Request, res: Response) {
    try {
      const data = await this.service.getReportDashboard(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);

    }
    catch (error) {
      respHndlr.sendError(res, error);
    }

  }

  async createHeaderReport(req: Request, res: Response){
    
    
    try {
      const result = await this.service.createHeaderReport(req);
      let msg = "Report data saved";
      if(result){
        respHndlr.sendSuccessWithMsg(res, msg, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
    }
    catch (error) {
      respHndlr.sendError(res, error);
    }
  }

  async createReportEnablement(req: Request, res: Response) {
    try {
      const result = await this.service.createReportEnablement(req);
      let msg = "Tag report data saved";
      if(result){
        respHndlr.sendSuccessWithMsg(res, msg, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
    }
    catch (error) {
      respHndlr.sendError(res, error);
    }

  }


  async createReportTag(req: Request, res: Response) {
    try {
      const result = await this.service.createReportTag(req);
      let msg = "Tag report data saved";
      if(result){
        respHndlr.sendSuccessWithMsg(res, msg, constant.RESPONSE_STATUS.SUCCESS_CREATED);
      }
    }
    catch (error) {
      respHndlr.sendError(res, error);
    }

  }

  async deleteTagData(req: Request, res: Response){
    try{
      const data = await this.service.deleteDashboardTagData(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
      }
      catch(error){
        this.logger.error("Getting error in deleting tag count and enablement count ")
          respHndlr.sendError(res, error);
      }
  }

}