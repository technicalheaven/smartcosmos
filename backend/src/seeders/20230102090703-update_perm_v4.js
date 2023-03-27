'use strict';

const { RolePermission } = require('../config/db');
const { Role } = require('../config/db');
const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
import { logger } from '../libs/logger'



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (query, Sequelize) {
    try{
     
      let permissionData = await Permission.findAll({ where: { 
        route: '/api/v1/users',
        action: 'read'
       }});
       var permIdName = {}
      if(permissionData){
        for (let permission of permissionData) {
          {
            if (permission?.route == '/api/v1/users') 
            {
              let key = permission?.name + permission?.action;
              permIdName[key] = {
                id: permission?.id,
                action: permission?.action,
                description: permission?.description,
                name: permission?.name
              };
            }
  
          }
        }
      }

      var rolePermArray = []
      let roleData = await Role.findAll({ where: { 
        name: 'Supervisor',
       }});

      if(roleData){
        for (let role of roleData) {
          if (role.name == 'Supervisor'){

            var ReadUserPermS = {
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
      }
       
      rolePermArray.push(ReadUserPermS);

      await query.bulkInsert('rolePermissions', rolePermArray);
        
    }
    catch (err) {
      logger.error("Error in adding read permission for Supervisor")
    }
  },

  async down (queryInterface, Sequelize) {
    
  }
};
