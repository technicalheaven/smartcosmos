'use strict';

module.exports = {
  async up (query, sequelize) {
    try{
    await query.createTable('zoneTypes',
    {
      id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: sequelize.STRING,
        allowNull: false,
      },
      isCustom: {
        type: sequelize.BOOLEAN,
        allowNull: true,
      },
      isActive: {
        type: sequelize.BOOLEAN,
        allowNull: true,
      },
      createdBy:{
        type: sequelize.BIGINT,
        allowNull: true,
      },
      updatedBy:{
        type: sequelize.BIGINT,
        allowNull: true,
      },
      deletedBy:{
        type: sequelize.BIGINT,
        allowNull: true,
      },
      
      // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
      createdAt: {
        type: sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: sequelize.DATE,
        allowNull: true,
      },
    },
    )
    }catch(error)
    {
      console.log("error at 20220930043716-zoneType.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
