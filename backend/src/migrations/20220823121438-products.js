'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      queryInterface.createTable('products',
        {
          id : {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
          tenantId: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          imageURL: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          upc: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          experienceId: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          experienceTenantId: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          experienceStudioId: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          metadata: {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
          },
          status: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['active', 'inactive'],
            defaultValue: 'active',
          },
          createdBy: {
            type: Sequelize.UUID,
            allowNull: true,
          },
          updatedBy: {
            type: Sequelize.UUID,
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
      }catch(error)
      {
        console.log("error at 20220823121438-products.js",error)
      }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('products');
  }
};
