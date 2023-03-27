import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Process } from "../../../config/db";
import { ProcessService } from "../services/process";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
var constant = require('../../../middlewares/resp-handler/constants')

export class ProcessController extends BaseController {
  constructor({ logger, models }: any) {
    super({
      service: new ProcessService({ model: Process, logger, models }),
      model: Process,
      models,
      logger
    })
  }

  async create(req: Request, res: Response) {
    this.service.createProcess(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }

  


  async readOne(req: Request, res: Response) {
    this.service.getProcessById(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }


  async readAll(req: Request, res: Response) {
    this.service.readAll(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }

  async update(req: Request, res: Response) {
    this.service.update(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }

  async delete(req: Request, res: Response) {
    this.service.deleteProcess(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }

  async deleteProcessByTenantId(req: Request, res: Response) {
    this.service.deleteProcessByTenantId(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }
  async deleteProcessByRoleId(req: Request, res: Response) {
    this.service.deleteProcessByRoleId(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }
  async deleteProcessBySiteId(req: Request, res: Response) {
    this.service.deleteProcessBySiteId(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }
  async deledeleteProcessByZoneId(req: Request, res: Response) {
    this.service.deleteProcessByZoneId(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }
  async unassignProcess(req: Request, res: Response) {
    try {
      const data = await this.service.unassignProcess(req);
      respHndlr.sendSuccess(res, data);
    }
    catch (error) {
      respHndlr.sendError(res, error);
    }
  }

  async getTenantProcess(req: Request, res: Response) {
    this.service.getTenantProcess(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }


  async processCount(req: Request, res: Response) {
    try {
      const data = await this.service.processCount(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("Getting error to count process")
      respHndlr.sendError(res, error);
    }
  }

  async readPredefinedProcesses(req: Request, res: Response) {
    try {
      const data = await this.service.getPredefinedProcesses(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("Getting error to count process")
      respHndlr.sendError(res, error);
    }
  }

  async createPredefinedProcess(req: Request, res: Response){
    this.service.createPreDefinedProcess(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS_CREATED);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });
  }

}
