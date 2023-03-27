'use strict';

const { v4: uuidv4 } = require("uuid");
const {DeviceTypeModel } = require('../config/db');
import { logger } from '../libs/logger'



module.exports = {
    async up(queryInterface, Sequelize) {
        try {

           let ch1= await DeviceTypeModel.update({modelType:'Mcon'},{where:{model:'Acceliot - STARFlex Reader STR-400-F'}})
           let ch2= await DeviceTypeModel.update({modelType:'Keonn'},{where:{model:'Keonn Advan Reader 70'}})
           let ch3= await DeviceTypeModel.update({modelType:'Denso'},{where:{model:'Denso BHT-80'}})
            
          } 
            catch (err)   
            {
            logger.error("Error in adding the data")
            }
      },

    async down(queryInterface, Sequelize) {
            await DeviceTypeModel.update({modelType:''},{where:{model:'Acceliot - STARFlex Reader STR-400-F'}})
            await DeviceTypeModel.update({modelType:''},{where:{model:'Keonn Advan Reader 70'}})
            await DeviceTypeModel.update({modelType:''},{where:{model:'Denso BHT-80'}})
    }
}
