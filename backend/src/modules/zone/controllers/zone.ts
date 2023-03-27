import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Zone } from "../../../config/db";
import { ZoneService } from "../services/zone";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
var constant = require('../../../middlewares/resp-handler/constants')


export class ZoneController extends BaseController{
  constructor({logger,models}:any){
    super({
      service: new ZoneService({model:Zone, logger, models}),
      model: Zone,
      models,
      logger
    })
  }

  async create(req: Request, res: Response) {
    this.service.createZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }


  async readOne(req: Request, res: Response) {
    this.service.getZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }


  async readAll(req: Request, res: Response) {
    this.service.readAllZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async update(req: Request, res: Response) {
    this.service.updateZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async updateSiteName(req: Request, res: Response) {
    this.service.updateSiteName(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async getNumberOfZone(req: Request, res: Response) {
    this.service.getNumberOfZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async combineCheckOnTenantSiteZone(req: Request, res: Response) {
    this.service.combineCheckOnTenantSiteZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }


  async delete(req: Request, res: Response) {
    this.service.deleteZone(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async deleteSite(req: Request, res: Response) {
    this.service.deleteZoneBySiteId(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async deleteTenant(req: Request, res: Response) {
    this.service.deleteZoneByTenantId(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async restorezoneViaTenantId(req: Request, res: Response) {
    this.service.restoreZoneViaTenantId(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

  async restorezoneViaSiteId(req: Request, res: Response) {
    this.service.restoreZoneViaSiteId(req).then((result: any) => {   
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
        respHndlr.sendError(res, err);
      });

  }

}
