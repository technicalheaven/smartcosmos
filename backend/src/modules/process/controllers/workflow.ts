import { Request, Response } from "express";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
import { WorkFlowSchemaService } from "../services/workflow";
import ProcessWorkFlowSchema from "../models/processWorkflow";
var constant = require('../../../middlewares/resp-handler/constants')

export class WorkflowController extends BaseController {
  constructor({ logger, models }: any) {
    super({
      service: new WorkFlowSchemaService(),
      model: ProcessWorkFlowSchema,
      models,
      logger
    })
  }

  async readAll(req: Request, res: Response) {
    this.service.fetchWorkflows(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });
  }

}
