'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(query, sequelize) {
    await query.bulkInsert('processActions',
      [
        {
          id: uuidv4(),
          name: 'ScanBarcode',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'TapNFC',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'ScanUHF',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'EncodeNFC',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'ScanQRCode',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'EncodeUHF',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'ScanUHFTagviaMCON',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'ScanMCON',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'ScanKEONN',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'ScanOrEnterASN',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'PrintViaPrinter ',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'PrintViaERP',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'AddInputField',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        }


      ]
    )
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
