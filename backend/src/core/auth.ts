var constants = require("../middlewares/resp-handler/constants");
import { Request, NextFunction, Response } from "express";

import { JwtPayload, verify } from "jsonwebtoken";
import { Permission, RolePermission, User } from "../config/db";
import { logger } from "../libs/logger";
import { Exception, respHndlr } from "../middlewares/resp-handler";
import { UserRole } from "../modules/user/models/userRole";
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { config } from "../config";
import { inactive } from "../modules/user/utils/constant";



export interface PermissionRequest {
    url: Request['body']
    params: Request['params']
    method: Request['method']
    body: Request['body']
    headers: Request['headers']
    query: Request['query']
    originalUrl: Request['originalUrl']
}
const SERVICE_SECRET = 'service-management'
// checking permissions for users
// let Cognito = CognitoService.Instance
export class Validation {
    constructor() { }
    async checkValidation(request: any, res: Response, next: NextFunction) {
        try {
            if (request.headers['service-token']) {
                let token = request.headers['service-token']
                let verirfyToken: any = verify(token?.toString(), SERVICE_SECRET)
                if (verirfyToken) {
                    return next()
                }
                logger.error('Failed to verify service token')
            }

            let idToken = request.headers['id-token'];
            let accessToken = request.headers['access-token'];

            if (!idToken && !accessToken) {
                throw new Exception(constants.ERROR_TYPE.NOT_FOUND, 'Id token and Access token not Found.',
                )
            }

            if (idToken && accessToken) {

                //getting verification tokenid
                let verifyIdToken :any=  jwt_decode(accessToken);
                const currentTime = Date.now();
                
                let jwtExpirationTime = verifyIdToken.exp * 1000
                

                if (currentTime >= jwtExpirationTime) {
                    throw new Exception(constants.ERROR_TYPE.BAD_REQUEST,'Invalid token')
                }
                
               
                // check user exist or not
                let user = await User.findOne({where : {username:verifyIdToken.name, status: "active"}})
                if (user == null) {
                    throw new Error(constants.ERROR_TYPE.UNAUTHORIZED)
                }

               
                // find user role for requesting user
                let userRole = await UserRole.findOne({
                    where:
                    {
                        userId: user.id
                    },
                })

                // get permission for request endpoint and method
                let permission = await Permission.findOne({
                    where: {
                        route: trim(request),
                        method: request.method.toLowerCase(),
                    }
                })


                // get for roleid and permissionid 
                let rolePermission = await RolePermission.findOne({
                    where: {
                        roleId: userRole?.roleId,
                        permissionId: permission?.id,

                    }
                })

               

                // checking role permission found or not
                if (!rolePermission) {
                    throw new Exception(
                        constants.ERROR_TYPE.FORBIDDEN,
                        'Access denied, not have permission to access this route.',
                    )
                }
                return next()
            }
            throw new Exception(
                constants.ERROR_TYPE.BAD_REQUEST,
                'Token Required',
            )
        } catch (err) {
            logger.error('Auth Error : ', err)
            return respHndlr.sendError(res, err);


        }
    }


}

function trim(req: PermissionRequest) {
    let url = req.url
    if (Object.keys(req.query).length && Object.keys(req.params).length) {
        let queryTrimedUrl = url.substring(0, url.lastIndexOf('?'))
        return queryTrimedUrl.substring(0, url.lastIndexOf('/'))
    } else if (Object.keys(req.query).length) {
        return url.substring(0, url.lastIndexOf('?'))
    } else if (Object.keys(req.params).length) {
        for (let param of Object.keys(req.params)) {
            url = url.replace("/" + req.params[param], "");
        }
        return url
    } else if (url[url.length - 1] == '/') {
        return url.substring(0, url.lastIndexOf('/'))
    } else {
        return url
    }
}
