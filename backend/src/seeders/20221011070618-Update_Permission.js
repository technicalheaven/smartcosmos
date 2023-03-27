
'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')




module.exports = {
    async up(queryInterface, Sequelize) {
        let permissionData = await Permission.findAll();
        var permIdName = {}
        for (let permission of permissionData) { 
            if (permission.name == 'RolesDetails' ){
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
 
                if (role.name == "Project Manager") {
                    var RolesDetailsPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesDetailsread.id,
                        name: permIdName?.RolesDetailsread.name,
                        description: permIdName?.RolesDetailsread.description,
                        action: permIdName?.RolesDetailsread.action,
                        createdAt: new Date()
                    }
                }
                if (role.name == "Supervisor") {
                    var RolesDetailsPermS = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesDetailsread.id,
                        name: permIdName?.RolesDetailsread.name,
                        description: permIdName?.RolesDetailsread.description,
                        action: permIdName?.RolesDetailsread.action,
                        createdAt: new Date()
                    }
                }
            }

            rolePermArray.push(RolesDetailsPermPM)
            rolePermArray.push(RolesDetailsPermS) 
            await queryInterface.bulkInsert('rolePermissions',
            rolePermArray)


        
    }
}