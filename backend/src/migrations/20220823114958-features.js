'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
    queryInterface.createTable('features',
    {
      id : {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true,
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
    console.log("error at 20220823114958-features.js",error)
  }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('features');
  }
};
