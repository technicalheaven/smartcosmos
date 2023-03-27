'use strict';

/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require("uuid");
const { RolePermission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'


module.exports = {
  async up (queryInterface, Sequelize) {

    try{

      let rolePermData = await RolePermission.findAll({ where: { 
        name: 'DeviceManager',
        action: 'delete'
       } 
      });
      
      let roleData;
      // let permS;
  
      if(rolePermData.length>0){
        for (let perm of rolePermData) {
            roleData = await Role.findOne({ where: { 
              id: perm.roleId,
              name: 'Supervisor'
             } 
            });
            if(roleData){
              // permS = perm;
              break;
            } 
        }
      }
  
      let res;
      if(roleData){
        res = await RolePermission.destroy({
          where: {
            roleId: roleData.id,
            name: 'DeviceManager',
            action: 'delete'
          }
        });
      }

      

    }
    catch (err){
      logger.error("error in removing delete device manager perm for Supervisor");
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
