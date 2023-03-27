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
     queryInterface.createTable('projectProductProcesses',
     {
       id : {
         type: Sequelize.UUID,
         primaryKey: true
       },
       projectId: {
         type: Sequelize.UUID,
         allowNull: false
       },
       productId: {
         type: Sequelize.UUID,
         allowNull: false
       },
       processId: {
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
      console.log("error at 20220823111350-projectProductProcesses.js",error)
    }
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('projectProductProcesses');
  }
};
