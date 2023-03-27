'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
try{
      queryInterface.createTable('dashboardHeaderCounts',
        {
          id : {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
          tenantId: {
            type: Sequelize.UUID,
            allowNull: true,
          },
          siteId: {
            type: Sequelize.UUID,
            allowNull: true,
          },
          totalDevices: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          activeDevices: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          inActiveDevices: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          totalSites: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
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
      } catch(err) {
        console.log('error at 20221019124955-dashboardHeaderCount.js',err)
    
      }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('dashboardHeaderCounts');
  }
};
