'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      queryInterface.createTable('enablements',
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
          enabledCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          deEnabledCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          date: {
            type: Sequelize.DATEONLY,
            allowNull: true,
          },
          month: {
            type: Sequelize.INTEGER,
            allowNull: true,
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
        console.log('error at 20221014185721-enablement.js',err)
  
      }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('enablements');
  }
};
