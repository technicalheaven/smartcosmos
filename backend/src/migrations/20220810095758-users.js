'use strict';

module.exports = {
  async up (queryInterface, sequelize) {
    try{
     queryInterface.createTable('users',
      {
        id: {
          type: sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        username: {
          type: sequelize.STRING,
          allowNull: false,
          unique:true,
        },
        name: {
          type: sequelize.STRING,
          allowNull: true,
        },
        imageUrl: {
          type: sequelize.STRING,
          allowNull: true,
        },

        gender: {
          type: sequelize.STRING,
          allowNull: true,
        },
        password: {
          type: sequelize.STRING,
          allowNull: true,
        },  
        contact: {
          type: sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: sequelize.STRING,
          allowNull: true,
          unique: true
        },
        status: {
          type: sequelize.STRING,
          allowNull: true,
        },
        emailVerifiedAt: {
          type: sequelize.STRING,
          allowNull: true,
        },
        azureId: {
          type: sequelize.STRING,
          allowNull: true,
        },
        createdBy:{
          type: sequelize.STRING,
          allowNull: true,
        }, 
        updatedBy:{
          type: sequelize.STRING,
          allowNull: true,
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
    }catch(error)
    {
      console.log("error at 20220810095758-users.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('users');
  }
};
