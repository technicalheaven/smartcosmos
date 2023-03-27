'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'





module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.bulkInsert('roles',
                [
                    {
                        id: uuidv4(),
                        name: 'API Operator',
                        description: '',
                        tenantId: null,
                        isPlatformRole: true,
                        isActive: true,
                        isCustom: false,
                        createdAt: new Date()
                    },
                    {
                        id: uuidv4(),
                        name: 'API Operator(Read Only)',
                        description: '',
                        tenantId: null,
                        isPlatformRole: true,
                        isActive: true,
                        isCustom: false,
                        createdAt: new Date()
                    },
                    {
                        id: uuidv4(),
                        name: 'Factory Tag Operator',
                        description: 'This Role is  for uploading the Factory Tag Operator',
                        tenantId: null,
                        isPlatformRole: true,
                        isActive: true,
                        isCustom: false,
                        createdAt: new Date()
                    },

                ]
            )
            await queryInterface.bulkInsert("permissions", [
                {
                    id: uuidv4(),
                    name: "OpenAPI",
                    description:
                        "This Permission allows a user to Create  Open API ",
                    method: "post",
                    action: "create",
                    route: "/api/v1/openApi",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "OpenAPI",
                    description:
                        "This Permission allows a user to View Open API ",
                    method: "get",
                    action: "read",
                    route: "/api/v1/openApi",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "OpenAPI",
                    description:
                        "This Permission allows a user to View or Edit Open API",
                    method: "patch",
                    action: "edit",
                    route: "/api/v1/openApi",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "OpenAPI",
                    description:
                        "This Permission allows a user to Delete Open API",
                    method: "delete",
                    action: "delete",
                    route: "/api/v1/openApi",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "UploadTag",
                    description:
                        "This Permission allows a user to to upload tag",
                    method: "post",
                    action: "create",
                    route: "/api/v1/tag/upload-tags",
                    isCustom: false,
                    createdAt: new Date(),
                }

            ])

            let permissionData = await Permission.findAll();
            var permIdName = {}
            for (let permission of permissionData) {
                if (permission.name == 'OpenAPI' || permission.name == 'UploadTag' ){
                    let key = permission?.name + permission?.action
                    permIdName[key] = {
                        id: permission?.id,
                        action: permission?.action,
                        description: permission?.description,
                        name: permission?.name
                    }
                }
            }
            var rolePermArray = []
            let roleData = await Role.findAll()
            for (let role of roleData) {
                if (role.name == "API Operator") {
                    var ReadOpenApiPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.OpenAPIread.id,
                        name: permIdName?.OpenAPIread.name,
                        description: permIdName?.OpenAPIread.description,
                        action: permIdName?.OpenAPIread.action,
                        createdAt: new Date()
                    }
                    var CreateOpenApiPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.OpenAPIcreate.id,
                        name: permIdName?.OpenAPIcreate.name,
                        description: permIdName?.OpenAPIcreate.description,
                        action: permIdName?.OpenAPIcreate.action,
                        createdAt: new Date()
                    }
                    var EditOpenApiPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.OpenAPIedit.id,
                        name: permIdName?.OpenAPIedit.name,
                        description: permIdName?.OpenAPIedit.description,
                        action: permIdName?.OpenAPIedit.action,
                        createdAt: new Date()
                    }
                    var DeleteOpenApiPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.OpenAPIdelete.id,
                        name: permIdName?.OpenAPIdelete.name,
                        description: permIdName?.OpenAPIdelete.description,
                        action: permIdName?.OpenAPIdelete.action,
                        createdAt: new Date()
                    }
                }
                if (role.name == "API Operator(Read Only)") {
                    var ReadOpenApiPermR = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.OpenAPIread.id,
                        name: permIdName?.OpenAPIread.name,
                        description: permIdName?.OpenAPIread.description,
                        action: permIdName?.OpenAPIread.action,
                        createdAt: new Date()
                    }
                    
                } 
                if (role.name == "Factory Tag Operator") {
                    var CreateUploadPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.UploadTagcreate.id,
                        name: permIdName?.UploadTagcreate.name,
                        description: permIdName?.UploadTagcreate.description,
                        action: permIdName?.UploadTagcreate.action,
                        createdAt: new Date()
                    }
                } 
                
            }


            rolePermArray.push(ReadOpenApiPermPM)
            rolePermArray.push(CreateOpenApiPermPM)
            rolePermArray.push(EditOpenApiPermPM)
            rolePermArray.push(DeleteOpenApiPermPM)
            rolePermArray.push(ReadOpenApiPermR)
            rolePermArray.push(CreateUploadPermPM)
            await queryInterface.bulkInsert('rolePermissions',
            rolePermArray)




        } catch (err) {
            logger.error("Error in Adding Data in Role",err)
        }
    }
}