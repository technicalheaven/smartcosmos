import { Request, Response } from "express";
import { Feature } from "../../../config/db";
import { FeatureService } from "../services/feature";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');


export class FeatureController extends BaseController {
  constructor({ logger, models }: any) {
    super({
      service: new FeatureService({ model: Feature, logger, models }),
      model: Feature,
      models,
      logger
    })
  }

  async readAll(req: Request, res: Response) {

    try {
      const data = await this.service.readAllFeature(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("error ")
      respHndlr.sendError(res, error);
    }
  }

  async readOne(req: Request, res: Response) {
    try {
      const data = await this.service.readOneFeature(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("error ")
      respHndlr.sendError(res, error);
    }
  }



  async create(req: Request, res: Response) {
    try {

      const data = await this.service.createFeature(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }
    catch (error) {
      this.logger.error("error ")
      respHndlr.sendError(res, error);
    }
  }


  async update(req: Request, res: Response) {
    try {
      const data = await this.service.updateFeature(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }
    catch (error) {
      this.logger.error("error ", error)
      respHndlr.sendError(res, error);
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const data = await this.service.deleteFeature(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }
    catch (error) {
      this.logger.error("error ")
      respHndlr.sendError(res, error);
    }
  }

} 
