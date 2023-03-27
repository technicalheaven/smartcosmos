import { Request, Response } from "express";
import sequelize, { Op } from "sequelize";
import BaseService from '../../../core/services/base';
import Exception from "../../../middlewares/resp-handler/exception";
var constant = require('../../../middlewares/resp-handler/constants')
var userConstant = require('../utils/constant')



export class RoleService extends BaseService {
    constructor({model,models,logger}:any){
      super({model, models, logger});
    }

    //this is to get all the role
    async roleReadAll(req: Request) {
        try {
            //getting all the role
            let whereObj: any = {}
            let isCustomObj: any = {}
            let tenantObj: any = {}
            let isPlatformRole = req.query.isPlatformRole
            // query filters
            if (req.query.isCustom != undefined) {
                isCustomObj.isCustom = req.query.isCustom
            }
            if (isPlatformRole != undefined) {
                isCustomObj.isPlatformRole = isPlatformRole
            }


            if (req.query.tenantId) {
                // whereObj.organizationId = req.query.organizationId,
                let tempWhereObj: any = {
                    [Op.or]: [{ tenantId: req.query.tenantId },{ type: null, tenantId: null }]
                }
                tenantObj = { ...tempWhereObj }
            }
            whereObj = { ...isCustomObj, ...tenantObj }
            const roles = await this.model.findAndCountAll({
                where: whereObj,
                order: [['name', 'ASC']],
                distinct: true,
                include: [
                    {
                        model: this.models.RolePermission,
                    }
                ]
            });
            return Promise.resolve(roles);
        }
        catch (err: any) {
            this.logger.error('Failed to get all roles:')
            return Promise.reject(err)
        }
    }
    
    // this is to get role by Id
    async readOne(req: Request) {
        try {
            // let user: any;
            const role = await this.model.findByPk(req.params.id,
                {
                    include: [
                        {
                            model: this.models.RolePermission,
                        }
                    ]
                });

            if (!role) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Role with id ${req.params.id} doesn't exist`)
            }

            return Promise.resolve(role);
        }
        catch (err) {
            this.logger.error('Failed to get role by Id:')
            return Promise.reject(err)
        }
    }


}

