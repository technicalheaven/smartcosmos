'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission, RolePermission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'



module.exports = {
  async up (queryInterface, Sequelize) {

    try {
        let roleData = await Role.findAll()
        let permissionData = await Permission.findAll();
        let permZone = await Permission.findOne({where:{route:"/api/v1/zoneType",  action:"edit"}})
        let permDeviceManager = await Permission.findOne({where:{route:"/api/v1/devicemanager",action:"edit"}})
        let permZoneC = await Permission.findOne({where:{route:"/api/v1/zoneType",  action:"create"}})
        let permDeviceManagerC = await Permission.findOne({where:{route:"/api/v1/devicemanager",action:"create"}})
        let permZoneD = await Permission.findOne({where:{route:"/api/v1/zoneType",  action:"delete"}})
        let permDeviceManagerD = await Permission.findOne({where:{route:"/api/v1/devicemanager",action:"delete"}})
        let roleSupervisor = await Role.findOne({where:{name:"Supervisor"}})


        await RolePermission.destroy({where:{roleId:roleSupervisor.id , permissionId:permZone.id}})
        await RolePermission.destroy({where:{roleId:roleSupervisor.id , permissionId:permZoneC.id}})
        await RolePermission.destroy({where:{roleId:roleSupervisor.id , permissionId:permDeviceManager.id}})
        await RolePermission.destroy({where:{roleId:roleSupervisor.id , permissionId:permDeviceManagerC.id}})
        await RolePermission.destroy({where:{roleId:roleSupervisor.id , permissionId:permZoneD.id}})

        var permIdName = {}
        for (let permission of permissionData) {
            if (permission.route == '/api/v1/roles') {
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
        for (let role of roleData) {
            if (role.name == "Tenant Admin") {
                var ReadRolePermTA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.Rolesread.id,
                    name: permIdName?.Rolesread.name,
                    description: permIdName?.Rolesread.description,
                    action: permIdName?.Rolesread.action,
                    createdAt: new Date()

                }
            }
            if (role.name == "Project Manager") {
                var ReadRolePermPM = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.Rolesread.id,
                    name: permIdName?.Rolesread.name,
                    description: permIdName?.Rolesread.description,
                    action: permIdName?.Rolesread.action,
                    createdAt: new Date()

                }
            }
            if (role.name == "Supervisor") {
                var ReadRolePermS = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.Rolesread.id,
                    name: permIdName?.Rolesread.name,
                    description: permIdName?.Rolesread.description,
                    action: permIdName?.Rolesread.action,
                    createdAt: new Date()

                }
            }

        }

        rolePermArray.push(ReadRolePermPM)
        rolePermArray.push(ReadRolePermS)
        rolePermArray.push(ReadRolePermTA)

        await queryInterface.bulkInsert('rolePermissions',
        rolePermArray)

    }catch(err){
        logger.error("Error in permission update ")

    }
  }
}