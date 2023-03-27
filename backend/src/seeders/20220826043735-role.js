'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(query, sequelize) {
    await query.bulkInsert('roles',
      [
        {
          id: uuidv4(),
          name: 'Platform Super Admin',
          description: 'Platform Super Admin can control the whole system ,create admins of the platform .',
          tenantId: null,
          isPlatformRole:true, 
          isActive:true,
          isCustom: false,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Platform Admin',
          description: ' Platform Admin can create tenant in the system, set up factory lists .',
          tenantId: null,
          isPlatformRole:true,
          isActive:true,
          isCustom: false,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Tenant Admin',
          description: 'Tenant Admin can control a particular tenant , create users in it.',
          tenantId: null,
          isPlatformRole:false,
          isActive:true,
          isCustom: false,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Project Manager',
          description: '',
          tenantId: null,
          isPlatformRole:false,
          isActive:true,
          isCustom: false,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Supervisor',
          description: '',
          tenantId: null,
          isPlatformRole:false,
          isActive:true,
          isCustom: false,
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'Operator',
          description: '',
          tenantId: null,
          isPlatformRole:false,
          isActive:true,
          isCustom: false,
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
