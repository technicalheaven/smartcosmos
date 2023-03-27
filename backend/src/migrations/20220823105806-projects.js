'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    try{
     queryInterface.createTable('projects',
     {
       id : {
         type: Sequelize.UUID,
         primaryKey: true
       },
       name: {
         type: Sequelize.STRING,
         allowNull: false
       },
       description: {
         type: Sequelize.STRING,
         allowNull: false
       },
       status: {
         type: Sequelize.STRING,
         allowNull: false
       },
       tenantId: {
         type: Sequelize.UUID,
         allowNull: false
       },
       createdBy: {
         type: Sequelize.STRING,
         allowNull: true
       },
       updatedBy: {
         type: Sequelize.STRING,
         allowNull: true
       },
       // createdAt, UpdatedAt and deletedAt managed by Sequelize
       createdAt: {
         type: Sequelize.DATE,
         allowNull: false
       },
       updatedAt: {
         type: Sequelize.DATE,
         allowNull: false
       },
       deletedAt: {
         type: Sequelize.DATE,
         allowNull: true
       }
     })
    }catch(error)
    {
      console.log("error at 20220823105806-projects.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('projects');
  }
};
