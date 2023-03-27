'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
    await queryInterface.removeColumn('processes', 'feature')
    } catch(err) {
    console.log('error at 20221031095054-updateProcess2.js',err)

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
