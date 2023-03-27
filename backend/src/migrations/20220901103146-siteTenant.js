'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
    queryInterface.createTable('siteTenant',
    {
      id : {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      siteId : {
        type: Sequelize.UUID,
        allowNull: false,
      },
      tenantId : {
        type: Sequelize.UUID,
        allowNull: false,
      },
      numberOfDevice: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      }
    })
    }catch(error)
    {
      console.log("error at 20220901103146-siteTenant.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('siteTenant');
  }
};
