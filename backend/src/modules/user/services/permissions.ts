import { Request, Response } from "express"; import sequelize, { Op } from "sequelize";
import BaseService from "../../../core/services/base";
import Exception from "../../../middlewares/resp-handler/exception";
var constant = require('../../../middlewares/resp-handler/constants');
var userConstant = require('../utils/constant')


export class PermissionService extends BaseService {
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
    }
    //this is to get all the permission
    async getPermission(req: Request) {
        try {
            //getting all the permission
            let permission: any
            let whereObj: any = {}

            // query filters 
            if (req.query.name) {
                whereObj.name = req.query.name
            }
            if (req.query.isCustom) {
                whereObj.isCustom = req.query.isCustom
            }
            if (req.query.method) {
                whereObj.method = req.query.method
            }
            if (req.query.action) {
                whereObj.action = req.query.action
            }
            await this.model.findAndCountAll({ where: whereObj })
                .then((result: any) => {
                    permission = result
                })
                .catch((err: any) => {
                    return Promise.reject(err)
                })
            return Promise.resolve(permission)
        }
        catch (err: any) { return Promise.reject(err) }
    }

    // this is to get permission by Id
    async getPermissionById(req: Request) {
        try {
            let permissionExist = await this.model.findByPk(req.params.id)
            if (!permissionExist) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `permission with id ${req.params.id} does not exist`)
            }
            return Promise.resolve(permissionExist)
        }
        catch (err) { return Promise.reject(err) }
    }
}