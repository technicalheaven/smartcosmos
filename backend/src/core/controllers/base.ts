import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { respHndlr } from "../../middlewares/resp-handler";
var constant = require('../../middlewares/resp-handler/constants')


export default class BaseController {
    service:any;
    model:any;
    logger:any;
    models:any;
    constructor({service, model, models, logger}:any){
        this.service = service;
        this.model = model;
        this.logger= logger;
        this.models = models;
    }
    async readAll(req:Request, res:Response){
        try{
            const data = await this.service.readAll(req);
            respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }

    async readOne(req:Request, res:Response){
        try{
            const data = await this.service.readOne(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }

    async create(req:Request, res:Response){
        try{
            const data = await this.service.create(req);
              respHndlr.sendSuccess(res, data);
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }

    async update(req:Request, res:Response){
        try{
            const data = await this.service.update(req);
              respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }

    async delete(req:Request, res:Response){
        try{
            const data = await this.service.delete(req);
              respHndlr.sendSuccess(res, data), constant.RESPONSE_STATUS.SUCCESS;
        }
        catch(error){
            respHndlr.sendError(res, error);
        }
    }
}