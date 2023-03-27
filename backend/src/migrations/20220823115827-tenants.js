'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
    queryInterface.createTable('tenants',
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
        allowNull: false,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Active', 'Inactive','Deleted'],
        defaultValue: 'Active',
      },
      type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['smartcosmos','tenant', 'subTenant'],
        defaultValue: 'tenant',
      },
      parent: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      path: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false,
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
    console.log("error at 20220823115827-tenants.js",error)
  }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tenants');
  }
};
