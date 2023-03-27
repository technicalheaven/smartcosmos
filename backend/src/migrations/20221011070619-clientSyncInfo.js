'use strict';

module.exports = {
  async up (queryInterface, sequelize) {
    try{
     queryInterface.createTable('clientSyncInfo',
      {
        id: {
          type: sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        tenantId: {
          type: sequelize.UUID,
          allowNull: false,
        },
        deviceId: {
          type: sequelize.UUID,
          allowNull: false,
        },
        deviceType: {
          type: sequelize.STRING,
          allowNull: false,
        },

        isExistingDataSynced: {
          type: sequelize.BOOLEAN,
          allowNull: false,
          defaultValue:false
        },
        userSyncedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },  
        tenantSyncedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },
        siteSyncedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },
        zoneSyncedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },
        deviceSyncedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },
        processSyncedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },
        productSyncedAt:{
          type: sequelize.DATE,
          allowNull: true,
        }, 
        tagSyncedAt:{
          type: sequelize.DATE,
          allowNull: true,
        },
        queueCreatedAt:{
          type: sequelize.DATE,
          allowNull: false,
        },
    
        // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
        createdAt: {
          type: sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: sequelize.DATE,
          allowNull: true,
        },
      }
        )
      } catch(err) {
        console.log('error at 20221011070619-clientSyncInfo.js',err)
  
      }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('clientSyncInfo');
  }
};
