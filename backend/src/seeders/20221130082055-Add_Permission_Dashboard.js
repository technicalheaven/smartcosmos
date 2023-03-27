'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
const { RolePermission } = require('../config/db')
import { logger } from '../libs/logger'



module.exports = {
    async up(query, Sequelize) {
        // PM 

        try {

            await query.bulkInsert("permissions", [
                {
                    id: uuidv4(),
                    name: "Dashboard",
                    description:
                        "This Permission allows a user to read Dashboard.",
                    method: "get",
                    action: "read",
                    route: "/api/v1/report/dashboard",
                    isCustom: false,
                    createdAt: new Date(),
                },
            ])

            let permissionData = await Permission.findAll()
            var permIdName = {}
            for (let permission of permissionData) {
                if ((permission?.route == '/api/v1/rolesdetails' || permission.name == 'Dashboard')) {
                    let key = permission?.name + permission?.action;
                    permIdName[key] = {
                        id: permission?.id,
                        action: permission?.action,
                        description: permission?.description,
                        name: permission?.name
                    };

                }
            }
            var rolePermArray = []
            let roleData = await Role.findAll()
            await Role.update({ description: "Supervisor can  control the device , process and device managera and below users ," }, { where: { name: "Supervisor" } })
            await Role.update({ description: "Project Manager can  control the device , process and device managera and below users ," }, { where: { name: "Project Manager" } })
            await Role.update({ description: "Operator can  only operate Station," }, { where: { name: "Operator" } })
            await Role.update({ description: "API Operator can Read and Write with External API " }, { where: { name: "API Operator" } })
            await Role.update({ description: "API Operator (Read Only) can Read with External API  " }, { where: { name: "API Operator (Read Only)" } })




            for (let role of roleData) {
                if (role.name == "Platform Super Admin") {
                    var ReadDashboardPermPSA = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Dashboardread.id,
                        name: permIdName?.Dashboardread.name,
                        description: permIdName?.Dashboardread.description,
                        action: permIdName?.Dashboardread.action,
                        createdAt: new Date()
                    }
                }
                if (role.name == "Platform Admin") {
                    var ReadDashboardPermPA = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Dashboardread.id,
                        name: permIdName?.Dashboardread.name,
                        description: permIdName?.Dashboardread.description,
                        action: permIdName?.Dashboardread.action,
                        createdAt: new Date()
                    }
                }
                if (role.name == "Tenant Admin") {
                    var ReadDashboardPermTA = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Dashboardread.id,
                        name: permIdName?.Dashboardread.name,
                        description: permIdName?.Dashboardread.description,
                        action: permIdName?.Dashboardread.action,
                        createdAt: new Date()
                    }
                }
                if (role.name == "Project Manager") {
                    var ReadDashboardPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Dashboardread.id,
                        name: permIdName?.Dashboardread.name,
                        description: permIdName?.Dashboardread.description,
                        action: permIdName?.Dashboardread.action,
                        createdAt: new Date()
                    }
                }
                if (role.name == "Supervisor") {
                    var ReadDashboardPermS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Dashboardread.id,
                        name: permIdName?.Dashboardread.name,
                        description: permIdName?.Dashboardread.description,
                        action: permIdName?.Dashboardread.action,
                        createdAt: new Date()
                    }
                }


            }

            rolePermArray.push(ReadDashboardPermPSA)
            rolePermArray.push(ReadDashboardPermPA)
            rolePermArray.push(ReadDashboardPermPM)
            rolePermArray.push(ReadDashboardPermTA)
            rolePermArray.push(ReadDashboardPermS)


            await query.bulkInsert('rolePermissions', rolePermArray)


        } catch (err) {
            logger.error("Error in Adding Permmison for Dashboard")
        }
    },
    async down(queryInterface, Sequelize) {

    }
}
