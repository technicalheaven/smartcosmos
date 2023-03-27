import { Response, Request } from "express";
import sequelize, { Op } from "sequelize";
import BaseService from '../../../core/services/base';
const Exception = require('../../../middlewares/resp-handler/exception')
var constant = require('../../../middlewares/resp-handler/constants')
var localConstant = require('../utils/constants');
import { databaseInstance } from '../../../config/db'


export class ProcessActionService extends BaseService {
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
    }
    
    async processActionReadAll(req: Request) {
        try {
            //getting all the processAction
            let whereObj: any = {}
            const processAction = await this.model.findAndCountAll({
                where: whereObj,
                order: [['name', 'ASC']],
                distinct: true,
            });
            return Promise.resolve(processAction);
        }
        catch (err: any) {
            this.logger.error('Failed to get all processAction:')
            return Promise.reject(err)
        }
    }
    
    // this is to get zone by Id
    async processActionReadOne(req: Request) {
        try {
            // let user: any;
            const processAction = await this.model.findByPk(req.params.id);

            if (!processAction) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `ProcessAction with id ${req.params.id} doesn't exist`)
            }

            return Promise.resolve(processAction);
        }
        catch (err) {
            this.logger.error('Failed to get processAction by Id:')
            return Promise.reject(err)
        }
    }
}