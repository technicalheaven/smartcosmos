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
        var permIdName = {}
        for (let permission of permissionData) {
            if ((permission.route == '/api/v1/site' && permission.action =='create')||(permission.route == '/api/v1/user' && permission.action =='edit'||(permission.route == '/api/v1/user' && permission.action =='read'))) {
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
          if (role.name == "Project Manager") {
            var CreateSitePM = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.Sitecreate.id,
                name: permIdName?.Sitecreate.name,
                description: permIdName?.Sitecreate.description,
                action: permIdName?.Sitecreate.action,
                createdAt: new Date()

            }
        }
        if (role.name == "Supervisor") {
          var EditUserS = {
              id: uuidv4(),
              roleId: role.id,
              permissionId: permIdName.Usersedit.id,
              name: permIdName?.Usersedit.name,
              description: permIdName?.Usersedit.description,
              action: permIdName?.Usersedit.action,
              createdAt: new Date()

          }
          var ReadUserS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersread.id,
            name: permIdName?.Usersread.name,
            description: permIdName?.Usersread.description,
            action: permIdName?.Usersread.action,
            createdAt: new Date()

        }
      }

        }

        rolePermArray.push(CreateSitePM)
        rolePermArray.push(EditUserS)
        rolePermArray.push(ReadUserS)

        await queryInterface.bulkInsert('rolePermissions',
        rolePermArray)

    }catch(err){
        logger.error("Error in permission update ")

    }
  }
}