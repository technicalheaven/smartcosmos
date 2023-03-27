'use strict';

const { v4: uuidv4 } = require("uuid");
const {Process,Feature } = require('../config/db');
import { logger } from '../libs/logger'


module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            const featureData= await Feature.findOne({where:{name:'TrackNTrace'}});
            await Process.update({actions:{createdFile:true}, processType:featureData.id},{where:{tenantId:' '}})
            } 
            catch (err) 
            {
            logger.error("Error in adding the data")
            }
      },

    async down(queryInterface, Sequelize) {
      
        await Process.update({actions:{}, processType:''},{where:{tenantId:' '}})
    }
}
