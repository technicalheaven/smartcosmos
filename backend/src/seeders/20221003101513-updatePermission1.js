'use strict';

const { Permission } = require("../config/db");

module.exports = {
  async up (queryInterface, Sequelize) {
    await Permission.update({name:'Users'},{where:{name:'User'}})
    await Permission.update({name:'Tenant'},{where:{name:'Tenants'}})
    await Permission.update({name:'Site'},{where:{name:'Sites'}})
    await Permission.update({name:'Roles'},{where:{name:'Role'}})
    await Permission.update({name:'Product'},{where:{name:'Products'}})
    await Permission.update({name:'Device'},{where:{name:'Devices'}})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
