'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
    queryInterface.createTable('deviceSiteZoneProcess',
    {
      id : {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      deviceId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      tenantId : {
        type: Sequelize.UUID,
        allowNull: false,
      },
      siteId : {
        type: Sequelize.UUID,
        allowNull: false,
      },
      zoneId : {
        type: Sequelize.UUID,
        allowNull: true,
      },
      processId : {
        type: Sequelize.UUID,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Active', 'Inactive','Deleted'],
        defaultValue: 'Active',
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
      console.log("error at 20220913100238-deviceSiteZoneProcess.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('deviceSiteZoneProcess');
  }
};
