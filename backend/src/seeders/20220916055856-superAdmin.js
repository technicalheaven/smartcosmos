'use strict';

const { Tenant, models, User } = require('../config/db');
const { Role } = require('../config/db');
const { UserService } = require('../modules/user/services/user');
const {logger} = require('../libs/logger/index')
const user = new UserService({model:User,models,logger})

module.exports = {

  async up (queryInterface, Sequelize) {
    try {
      
      let roleName = await Role.findOne({ where: { name: "Platform Super Admin" } })
      let org = await Tenant.findOne({ where: { name: "Smartcosmos" } })
      var val = Math.floor(1000 + Math.random() * 9000);
      let username = 'superadmin' + val
      let req = {}
      let body = {
        username: username,
        email: "abc@gmail.com",
        name: "SuperPlatform Admin",
        gender: "",
        roleId: roleName.id,
        tenantId: org.id,
        siteId: [],
        homeSite : "",
        zoneId: "",
        seeder:true,
      } 
      req['body'] = body
      let superAdmin= await user.create(req)
    }catch(err){
      logger.error("Error in Super Admin ",err)
    }



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
