'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(query, sequelize) {
    await query.bulkInsert('zoneTypes',
      [
        {
          id: uuidv4(),
          name: 'Sold',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Hold',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Returns',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Faulty',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Retired',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Stock',
          description: '',
          isCustom: null, 
          isActive:true,
          createdAt: new Date()
        },
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
