'use strict';
const { Feature } = require('../config/db')
const { v4: uuidv4 } = require('uuid');
import { logger } from '../libs/logger'

module.exports = {
  async up (query, Sequelize) {
      try{
        await query.bulkInsert('features',
          [
            {
              id: uuidv4(),
              name: 'Digitization',
              description: 'Digitization',
              isActive:'Yes',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: uuidv4(),
              name: 'TrackNTrace',
              description: 'TrackNTrace',
              isActive:'Yes',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ]
        )

        let featureData = await Feature.findAll()
        var permIdName = {}
        for (let data of featureData) {
          {
            let key = data?.name;
            permIdName[key] = {
              id: data?.id
            };
          }
        }
        await query.bulkInsert('featureActions',
        [
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Digitization',
            description: 'Digitization',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Scan Barcode',
            description: 'Scan Barcode',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Scan QR Code',
            description: 'Scan QR Code',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Scan NFC',
            description: 'Scan NFC',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Scan UHF',
            description: 'Scan UHF',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Encode NFC',
            description: 'Encode NFC',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Encode UHF',
            description: 'Encode UHF',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.Digitization.id,
            name: 'Add Input Field',
            description: 'Add Input Field',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.TrackNTrace.id,
            name: 'Scan Tag',
            description: 'Scan Tag',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.TrackNTrace.id,
            name: 'GPIO-Light',
            description: 'GPIO-Light',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.TrackNTrace.id,
            name: 'GPIO-Sound',
            description: 'GPIO-Sound',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          ,
          {
            id: uuidv4(),
            featureId:permIdName.TrackNTrace.id,
            name: 'File Upload',
            description: 'File Upload',
            isActive:'Yes',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          
        ]
      )




        }
        catch(error)
          {
            logger.error("Error in excuting feature seeder ", error);
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
