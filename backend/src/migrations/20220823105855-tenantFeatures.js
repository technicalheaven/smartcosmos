'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   try{
    queryInterface.createTable('tenantFeatures',
    {
      id : {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      tenantId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      featureId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true,
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
    console.log("error at 20220823105855-tenantFeatures.js",error)
  }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tenantFeatures');
  }
};
