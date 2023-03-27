'use strict';

module.exports = {
  async up(query, sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    try{
    await query.createTable('userRoles',
      {
        id: {
          type: sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        userId: {
          type: sequelize.UUID,
          allowNull: true,
        },
        tenantId: {
          type: sequelize.UUID,
          allowNull: true,
        },
        roleId: {
          type: sequelize.UUID,
          allowNull: true,
        },
        siteId: {
          type: sequelize.STRING,
          allowNull: true,
        },
        zoneId: {
          type: sequelize.UUID,
          allowNull: true,
        },
        roleName: {
          type: sequelize.STRING,
          allowNull: true,
        },
        isPlatformRole:{
          type: sequelize.STRING,
          allowNull: true,
        },

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
   
        
      })
    }catch(error)
    {
      console.log("error at 20220825091331-userRole.js",error)
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
