import { Request, Response } from "express";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from "../../../middlewares/resp-handler";
import PreDefinedStateMachine from "../models/predefinedStatemachine";
import { StateMachineService } from "../services/stateMachine";
var constant = require('../../../middlewares/resp-handler/constants')

export class StateMachineController extends BaseController {
  constructor({ logger, models }: any) {
    super({
      service: new StateMachineService(),
      model: PreDefinedStateMachine,
      models,
      logger
    })
  }

  async readAll(req: Request, res: Response) {
    this.service.fetchStateMachine(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });
  }

}
