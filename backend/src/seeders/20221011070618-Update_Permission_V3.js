'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission, RolePermission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'



module.exports = {
    async up(queryInterface, Sequelize) {

        try {
            await Permission.update({name:'Roles'},{where:{name:'RolesDetails'}})
            await Permission.update({name:'Roles'},{where:{name:'RolesList'}})
            await queryInterface.bulkInsert("permissions", [
                {
                    id: uuidv4(),
                    name: "ZoneType",
                    description:
                        "This Permission allows a tenant to get zoneType list",
                    method: "get",
                    action: "reads",
                    route: "/api/v1/zoneTypes",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ZoneType",
                    description:
                        "This Permission allows a tenant to get particular zoneTypes data",
                    method: "get",
                    action: "read",
                    route: "/api/v1/zoneType",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ZoneType",
                    description:
                        "This Permission allows a tenant to Create zoneType data",
                    method: "post",
                    action: "create",
                    route: "/api/v1/zoneType",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ZoneType",
                    description:
                        "This Permission allows a tenant to update zoneType ",
                    method: "patch",
                    action: "edit",
                    route: "/api/v1/zoneType",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ZoneType",
                    description:
                        "This Permission allows a tenant to delete zoneType",
                    method: "delete",
                    action: "delete",
                    route: "/api/v1/zoneType",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ProcessAction",
                    description:
                        "This Permission allows a tenant to get all Process Actions",
                    method: "get",
                    action: "reads",
                    route: "/api/v1/processActions",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ProcessAction",
                    description:
                        "This Permission allows a tenant to get all Process Actions",
                    method: "get",
                    action: "read",
                    route: "/api/v1/processAction",
                    isCustom: false,
                    createdAt: new Date(),
                },

            ])

            let permissionData = await Permission.findAll();
            var permIdName = {}
            for (let permission of permissionData) {
                if (permission.name == 'ZoneType' || permission.name == 'ProcessAction' || permission.name == 'Users') {
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
                if (role.name == "Platform Super Admin") {
                    var ReadZoneTypeSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTyperead.id,
                        name: permIdName?.ZoneTyperead.name,
                        description: permIdName?.ZoneTyperead.description,
                        action: permIdName?.ZoneTyperead.action,
                        createdAt: new Date()

                    }
                    var ReadsZoneTypePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypereads.id,
                        name: permIdName?.ZoneTypereads.name,
                        description: permIdName?.ZoneTypereads.description,
                        action: permIdName?.ZoneTypereads.action,
                        createdAt: new Date()

                    }
                    var EditZoneTypePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypeedit.id,
                        name: permIdName?.ZoneTypeedit.name,
                        description: permIdName?.ZoneTypeedit.description,
                        action: permIdName?.ZoneTypeedit.action,
                        createdAt: new Date()
                    }
                    var DeleteZoneTypePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypedelete.id,
                        name: permIdName?.ZoneTypedelete.name,
                        description: permIdName?.ZoneTypedelete.description,
                        action: permIdName?.ZoneTypedelete.action,
                        createdAt: new Date()
                    }
                    var CreateZoneTypePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypecreate.id,
                        name: permIdName?.ZoneTypecreate.name,
                        description: permIdName?.ZoneTypecreate.description,
                        action: permIdName?.ZoneTypecreate.action,
                        createdAt: new Date()
                    }
                    var ReadProcessActionSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionread.id,
                        name: permIdName?.ProcessActionread.name,
                        description: permIdName?.ProcessActionread.description,
                        action: permIdName?.ProcessActionread.action,
                        createdAt: new Date()

                    }
                    var ReadsProcessActionSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionreads.id,
                        name: permIdName?.ProcessActionreads.name,
                        description: permIdName?.ProcessActionreads.description,
                        action: permIdName?.ProcessActionreads.action,
                        createdAt: new Date()

                    }
                }
                if (role.name == "Platform Admin") {
                    var ReadZoneTypePa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTyperead.id,
                        name: permIdName?.ZoneTyperead.name,
                        description: permIdName?.ZoneTyperead.description,
                        action: permIdName?.ZoneTyperead.action,
                        createdAt: new Date()

                    }
                    var ReadsZoneTypePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypereads.id,
                        name: permIdName?.ZoneTypereads.name,
                        description: permIdName?.ZoneTypereads.description,
                        action: permIdName?.ZoneTypereads.action,
                        createdAt: new Date()

                    }
                    var EditZoneTypePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypeedit.id,
                        name: permIdName?.ZoneTypeedit.name,
                        description: permIdName?.ZoneTypeedit.description,
                        action: permIdName?.ZoneTypeedit.action,
                        createdAt: new Date()
                    }
                    var DeleteZoneTypePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypedelete.id,
                        name: permIdName?.ZoneTypedelete.name,
                        description: permIdName?.ZoneTypedelete.description,
                        action: permIdName?.ZoneTypedelete.action,
                        createdAt: new Date()
                    }
                    var CreateZoneTypePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypecreate.id,
                        name: permIdName?.ZoneTypecreate.name,
                        description: permIdName?.ZoneTypecreate.description,
                        action: permIdName?.ZoneTypecreate.action,
                        createdAt: new Date()
                    }
                    var ReadProcessActionPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionread.id,
                        name: permIdName?.ProcessActionread.name,
                        description: permIdName?.ProcessActionread.description,
                        action: permIdName?.ProcessActionread.action,
                        createdAt: new Date()

                    }
                    var ReadsProcessActionPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionreads.id,
                        name: permIdName?.ProcessActionreads.name,
                        description: permIdName?.ProcessActionreads.description,
                        action: permIdName?.ProcessActionreads.action,
                        createdAt: new Date()

                    }

                }
                if (role.name == "Tenant Admin") {
                    var ReadZoneTypeTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTyperead.id,
                        name: permIdName?.ZoneTyperead.name,
                        description: permIdName?.ZoneTyperead.description,
                        action: permIdName?.ZoneTyperead.action,
                        createdAt: new Date()

                    }
                    var ReadsZoneTypePermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypereads.id,
                        name: permIdName?.ZoneTypereads.name,
                        description: permIdName?.ZoneTypereads.description,
                        action: permIdName?.ZoneTypereads.action,
                        createdAt: new Date()

                    }
                    var EditZoneTypePermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypeedit.id,
                        name: permIdName?.ZoneTypeedit.name,
                        description: permIdName?.ZoneTypeedit.description,
                        action: permIdName?.ZoneTypeedit.action,
                        createdAt: new Date()
                    }
                    var DeleteZoneTypePermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypedelete.id,
                        name: permIdName?.ZoneTypedelete.name,
                        description: permIdName?.ZoneTypedelete.description,
                        action: permIdName?.ZoneTypedelete.action,
                        createdAt: new Date()
                    }
                    var CreateZoneTypePermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypecreate.id,
                        name: permIdName?.ZoneTypecreate.name,
                        description: permIdName?.ZoneTypecreate.description,
                        action: permIdName?.ZoneTypecreate.action,
                        createdAt: new Date()
                    }
                    var ReadProcessActionTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionread.id,
                        name: permIdName?.ProcessActionread.name,
                        description: permIdName?.ProcessActionread.description,
                        action: permIdName?.ProcessActionread.action,
                        createdAt: new Date()

                    }
                    var ReadsProcessActionTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionreads.id,
                        name: permIdName?.ProcessActionreads.name,
                        description: permIdName?.ProcessActionreads.description,
                        action: permIdName?.ProcessActionreads.action,
                        createdAt: new Date()

                    }
                }
                if (role.name == "Project Manager") {
                    var ReadZoneTypePM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTyperead.id,
                        name: permIdName?.ZoneTyperead.name,
                        description: permIdName?.ZoneTyperead.description,
                        action: permIdName?.ZoneTyperead.action,
                        createdAt: new Date()

                    }
                    var ReadsZoneTypePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypereads.id,
                        name: permIdName?.ZoneTypereads.name,
                        description: permIdName?.ZoneTypereads.description,
                        action: permIdName?.ZoneTypereads.action,
                        createdAt: new Date()

                    }
                    var EditZoneTypePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypeedit.id,
                        name: permIdName?.ZoneTypeedit.name,
                        description: permIdName?.ZoneTypeedit.description,
                        action: permIdName?.ZoneTypeedit.action,
                        createdAt: new Date()
                    }
                    var DeleteZoneTypePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypedelete.id,
                        name: permIdName?.ZoneTypedelete.name,
                        description: permIdName?.ZoneTypedelete.description,
                        action: permIdName?.ZoneTypedelete.action,
                        createdAt: new Date()
                    }
                    var CreateZoneTypePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypecreate.id,
                        name: permIdName?.ZoneTypecreate.name,
                        description: permIdName?.ZoneTypecreate.description,
                        action: permIdName?.ZoneTypecreate.action,
                        createdAt: new Date()
                    }
                    var ReadProcessActionPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionread.id,
                        name: permIdName?.ProcessActionread.name,
                        description: permIdName?.ProcessActionread.description,
                        action: permIdName?.ProcessActionread.action,
                        createdAt: new Date()

                    }
                    var ReadsProcessActionPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionreads.id,
                        name: permIdName?.ProcessActionreads.name,
                        description: permIdName?.ProcessActionreads.description,
                        action: permIdName?.ProcessActionreads.action,
                        createdAt: new Date()

                    }
                }
                if (role.name == "Supervisor") {
                    var ReadZoneTypeS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTyperead.id,
                        name: permIdName?.ZoneTyperead.name,
                        description: permIdName?.ZoneTyperead.description,
                        action: permIdName?.ZoneTyperead.action,
                        createdAt: new Date()

                    }
                    var ReadsZoneTypePermS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypereads.id,
                        name: permIdName?.ZoneTypereads.name,
                        description: permIdName?.ZoneTypereads.description,
                        action: permIdName?.ZoneTypereads.action,
                        createdAt: new Date()

                    }
                    var EditZoneTypePermS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypeedit.id,
                        name: permIdName?.ZoneTypeedit.name,
                        description: permIdName?.ZoneTypeedit.description,
                        action: permIdName?.ZoneTypeedit.action,
                        createdAt: new Date()
                    }
                    var DeleteZoneTypePermS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypedelete.id,
                        name: permIdName?.ZoneTypedelete.name,
                        description: permIdName?.ZoneTypedelete.description,
                        action: permIdName?.ZoneTypedelete.action,
                        createdAt: new Date()
                    }
                    var CreateZoneTypePermS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ZoneTypecreate.id,
                        name: permIdName?.ZoneTypecreate.name,
                        description: permIdName?.ZoneTypecreate.description,
                        action: permIdName?.ZoneTypecreate.action,
                        createdAt: new Date()
                    }
                    var ReadProcessActionS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionread.id,
                        name: permIdName?.ProcessActionread.name,
                        description: permIdName?.ProcessActionread.description,
                        action: permIdName?.ProcessActionread.action,
                        createdAt: new Date()

                    }
                    var ReadsProcessActionS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ProcessActionreads.id,
                        name: permIdName?.ProcessActionreads.name,
                        description: permIdName?.ProcessActionreads.description,
                        action: permIdName?.ProcessActionreads.action,
                        createdAt: new Date()

                    }

                    var CreateUserS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Userscreate.id,
                        name: permIdName?.Userscreate.name,
                        description: permIdName?.Userscreate.description,
                        action: permIdName?.Userscreate.action,
                        createdAt: new Date()

                    }
                }
            }

            rolePermArray.push(ReadZoneTypeSa)
            rolePermArray.push(ReadsZoneTypePermSa)
            rolePermArray.push(EditZoneTypePermSa)
            rolePermArray.push(DeleteZoneTypePermSa)
            rolePermArray.push(CreateZoneTypePermSa)
            rolePermArray.push(ReadProcessActionSa)
            rolePermArray.push(ReadsProcessActionSa)

            rolePermArray.push(ReadZoneTypePa)
            rolePermArray.push(ReadsZoneTypePermPa)
            rolePermArray.push(EditZoneTypePermPa)
            rolePermArray.push(DeleteZoneTypePermPa)
            rolePermArray.push(CreateZoneTypePermPa)
            rolePermArray.push(ReadProcessActionPa)
            rolePermArray.push(ReadsProcessActionPa)
            
            rolePermArray.push(ReadZoneTypeTa)
            rolePermArray.push(ReadsZoneTypePermTa)
            rolePermArray.push(EditZoneTypePermTa)
            rolePermArray.push(DeleteZoneTypePermTa)
            rolePermArray.push(CreateZoneTypePermTa)
            rolePermArray.push(ReadProcessActionTa)
            rolePermArray.push(ReadsProcessActionTa)

            rolePermArray.push(ReadZoneTypePM)
            rolePermArray.push(ReadsZoneTypePermPM)
            rolePermArray.push(EditZoneTypePermPM)
            rolePermArray.push(DeleteZoneTypePermPM)
            rolePermArray.push(CreateZoneTypePermPM)
            rolePermArray.push(ReadProcessActionPM)
            rolePermArray.push(ReadsProcessActionPM)

            rolePermArray.push(ReadZoneTypeS)
            rolePermArray.push(ReadsZoneTypePermS)
            rolePermArray.push(EditZoneTypePermS)
            rolePermArray.push(DeleteZoneTypePermS)
            rolePermArray.push(CreateZoneTypePermS)
            rolePermArray.push(ReadProcessActionS)
            rolePermArray.push(ReadsProcessActionS)

            await queryInterface.bulkInsert('rolePermissions',
            rolePermArray)

            await Permission.update({name:'Zone'},{where:{name:'ZoneType'}})
            await Permission.update({name:'Process'},{where:{name:'ProcessAction'}})

            await RolePermission.update({name:'Roles'},{where:{name:'RolesDetails'}})
            await RolePermission.update({name:'Roles'},{where:{name:'RolesList'}})
            await RolePermission.update({name:'Zone'},{where:{name:'ZoneType'}})
            await RolePermission.update({name:'Process'},{where:{name:'ProcessAction'}})




        } catch (err) {
            logger.error("Error in adding the data", err)
        }



    }

}