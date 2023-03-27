import { Request, Response } from "express";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
import PreDefinedWorkflow from "../models/predefinedWorkflow";
import { NodeWFService } from "../services/nodeWorkflow";
var constant = require('../../../middlewares/resp-handler/constants')

export class NodeWFController extends BaseController {
  constructor({ logger, models }: any) {
    super({
      service: new NodeWFService(),
      model: PreDefinedWorkflow,
      models,
      logger
    })
  }

  async readAll(req: Request, res: Response) {
    this.service.fetchNodePredefineWf(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });
  }

}
