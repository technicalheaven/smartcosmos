'use strict';

module.exports = {
  async up (queryInterface, Sequelize) 
  {
    try{
      await queryInterface.createTable('processes', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
    
        tenantId:{
          type: Sequelize.UUID,
          allowNull: false,
        },
    
        name:{
          type: Sequelize.STRING,
          allowNull: false,
        },
    
        feature: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ['Digitization', 'Track&Trace'],
        },
    
        description: {
          type: Sequelize.STRING,
          allowNull: true
        },
    
        initialState:{
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: true,
        },
    
        states: {
          type: Sequelize.JSON,
          allowNull: false,
        },
    
        transitions: {
          type: Sequelize.JSON,
          allowNull: false,
        },

        assign: {
          type: Sequelize.JSON,
          allowNull: false,
        },
    
        stopActions: {
          type: Sequelize.DATE,
          allowNull: true,
        },
    
        startActions: {
          type: Sequelize.DATE,
          allowNull: true,
        },
    
        instruction:{
          type: Sequelize.STRING,
          allowNull: true,
        },
    
        status: {
          type: Sequelize.STRING,
          allowNull: true
        },
    
        minStationVer:{
          type: Sequelize.STRING,
          allowNull: true,
        },
         
        isFinalized:{
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
        createdBy: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        updatedBy: {
          type: Sequelize.BIGINT,
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
      console.log("error at 20220908102027-processes.js",error)
    }
  },
  

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('processes')
  }
};

