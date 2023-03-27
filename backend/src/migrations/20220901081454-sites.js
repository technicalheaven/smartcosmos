'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
try{
    queryInterface.createTable('sites',
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
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      siteIdentifier: {
        type: Sequelize.STRING,
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
    console.log("error at 20220901081454-sites.js",error)
  }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sites');
  }
};
