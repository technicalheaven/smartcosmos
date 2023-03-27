'use strict';
module.exports = {
  async up(query, sequelize) {
    try{
    await query.createTable('permissions',
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
        route: {
          type: sequelize.STRING,
          allowNull: false,
        },
        action: {
          type: sequelize.STRING,
          allowNull: false,
        },
        method: {
          type: sequelize.STRING,
          allowNull: false,
        },

        isCustom: {
          type: sequelize.BOOLEAN,
          allowNull: false,
        },
        createdBy: {
          type: sequelize.STRING,
          allowNull: true,
        },

        updatedBy: {
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
      }
    )
  }catch(error)
  {
    console.log("error at 20220830121713-Permission.js",error)
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
