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
    await query.createTable('rolePermissions',
      {
        id: {
          type: sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        roleId: {
          type: sequelize.UUID,
          allowNull: false,
        },
        permissionId: {
          type: sequelize.UUID,
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
        action: {
          type: sequelize.STRING,
          allowNull: false,
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
      })
    }catch(error)
    {
      console.log("error at 20220901092602-RolePermission.js",error)
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
