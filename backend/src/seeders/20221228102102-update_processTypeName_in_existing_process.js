'use strict';
const { FeatureAction, Feature ,Process} = require('../config/db')
import { Op, Sequelize } from "sequelize"; 
module.exports = {
   async up(query, sequelize) {
       try {
          // deleting old data
          const processes = await Process.findAll({where:{processTypeName: null}});
          for (const process of processes) {
              let processName = await Feature.findOne({id:process.processType});

              await Process.update({processTypeName:processName.name},{where:{id:process.id}});
            }
       } catch (err) {
            console.log("Error in updating processTypeName in exiting process",err)
       }
   },
 
 
   async down(queryInterface, Sequelize) {
       /**
        * Add commands to revert seed here.
        *
        * Example:
        * await queryInterface.bulkDelete('People', null, {});
        */
   }
};
