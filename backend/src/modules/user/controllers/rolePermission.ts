import { Request, Response } from "express";
import Exception from "../../../middlewares/resp-handler/exception";
import {  RoleService } from "../services/role";
import { transformRoleDetailData, transformRolesListData } from "../services/rolePermission";
var constant = require('../../../middlewares/resp-handler/constants')
import { logger } from "../../../libs/logger/index";
import { Role } from "../models/role";
import { models } from "../../../config/db";
import { respHndlr } from "../../../middlewares/resp-handler";


export class RolePermissionController {

    constructor() {
        
    }
    getRolesList = (req: Request, res: Response) => {
        const roleServiceInstance = new RoleService({model:Role, logger, models})
        try {
            roleServiceInstance.readAll(req)
                .then(async (result: any) => {
                    // transform role api's response to get useful data
                    let transformedData : any = await transformRolesListData(result?.rows);

                    if (transformedData) {
                        respHndlr.sendSuccess(res, { count: transformedData.length,rows: transformedData })
                    } else {
                        logger.info('Failed to transform read role data');
                        respHndlr.sendError(res, 'Failed to transform role data');
                    }
                })
                .catch((err: any) => {
                    respHndlr.sendError(res, err);
                });

        } catch (err) {
            logger.error("Failed to get role list from role");
            respHndlr.sendError(res, err);
        }
    }

    // get role details
    getRoleDetails = async (req: Request, res: Response) => {
        const roleServiceInstance = new RoleService({model:Role, logger, models})
        try {
            roleServiceInstance.readOne(req)
                .then(async (result: any) => {
                    // transform role api's response to get useful data
                    let transformedData = await transformRoleDetailData(result);
                    if (transformedData) {
                        respHndlr.sendSuccess(res, { message: transformedData });
                    } else {
                        logger.info('Transformed role detail data is malformed: ')
                        respHndlr.sendError(res, 'Failed to transform data for role details');
                    }
                })
                .catch((err: any) => {
                    if(err ===  null) {
                        respHndlr.sendError(res, new Exception(constant.ERROR_TYPE.NOT_FOUND, `Role not found for id ${req.params.id}`))
                    } else {
                    respHndlr.sendError(res, err);
                    }
                })

        } catch (err) {
            logger.error('Failed to get role details');
            respHndlr.sendError(res, err);
        }
    }

}

