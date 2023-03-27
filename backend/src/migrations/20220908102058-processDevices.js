'use strict';

module.exports = {
  async up(query, Sequelize) {
  try{
    await query.createTable('processDevices',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        deviceId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        processId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        roleId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        siteId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        zoneId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        
      })
      }catch(error)
      {
        console.log("error at 20220908102058-processDevices.js",error)
      }
  },

  async down(queryInterface, Sequelize) {
   
     await queryInterface.dropTable('processDevices');
     
  }
};
