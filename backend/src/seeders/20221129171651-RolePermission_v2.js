'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'



/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (query, Sequelize) {

    try{

      let permissionData = await Permission.findAll()
      var permIdName = {}
      for (let permission of permissionData) {
        {
          if (
              (permission?.route == '/api/v1/user') ||
              (permission?.route == '/api/v1/users') || 
              (permission?.route == '/api/v1/resendinvite') ||
              (permission?.route == '/api/v1/process' )
              ){
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

      var rolePermArray = []
      let roleData = await Role.findAll()
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

          var CreateUserPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Userscreate.id,
            name: permIdName?.Userscreate.name,
            description: permIdName?.Userscreate.description,
            action: permIdName?.Userscreate.action,
            createdAt: new Date()
          }

          var EditUserPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersedit.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }

          var DeleteUserPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersdelete.id,
            name: permIdName?.Usersdelete.name,
            description: permIdName?.Usersdelete.description,
            action: permIdName?.Usersdelete.action,
            createdAt: new Date()
          }

          var ReadProcessPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processread.id,
            name: permIdName?.Processread.name,
            description: permIdName?.Processread.description,
            action: permIdName?.Processread.action,
            createdAt: new Date()

          }

          var EditProcessPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processedit.id,
            name: permIdName?.Processedit.name,
            description: permIdName?.Processedit.description,
            action: permIdName?.Processedit.action,
            createdAt: new Date()

          }

          var CreateProcessPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processcreate.id,
            name: permIdName?.Processcreate.name,
            description: permIdName?.Processcreate.description,
            action: permIdName?.Processcreate.action,
            createdAt: new Date()
          }

          var DeleteProcessPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processdelete.id,
            name: permIdName?.Processdelete.name,
            description: permIdName?.Processdelete.description,
            action: permIdName?.Processdelete.action,
            createdAt: new Date()
          }

          var ResendInvitePermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName?.ResendInvitecreate.id,
            name: permIdName?.ResendInvitecreate.name,
            description: permIdName?.ResendInvitecreate.description,
            action: permIdName?.ResendInvitecreate.action,
            createdAt: new Date()

          }

        }
        if  (role.name == 'Project Manager'){
          var ResendInvitePermPm = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName?.ResendInvitecreate.id,
            name: permIdName?.ResendInvitecreate.name,
            description: permIdName?.ResendInvitecreate.description,
            action: permIdName?.ResendInvitecreate.action,
            createdAt: new Date()

          }
        }
      }

      rolePermArray.push(ReadUserPermS)
      rolePermArray.push(CreateUserPermS)
      rolePermArray.push(EditUserPermS)
      rolePermArray.push(DeleteUserPermS)
      rolePermArray.push(EditProcessPermS)
      rolePermArray.push(CreateProcessPermS)
      rolePermArray.push(DeleteProcessPermS)
      rolePermArray.push(ReadProcessPermS)
      rolePermArray.push(ResendInvitePermS)
      rolePermArray.push(ResendInvitePermPm)

      await query.bulkInsert('rolePermissions', rolePermArray)

    }
    catch (err){
      logger.error("error");
    }
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
