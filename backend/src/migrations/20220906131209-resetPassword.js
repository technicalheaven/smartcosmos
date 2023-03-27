'use strict';

module.exports = {
  async up(queryInterface, sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     */
    try{
    await queryInterface.createTable('resetPasswords',
      {
        id: {
          type: sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true
        },
        email: {
          type: sequelize.STRING,
          allowNull: true,
        },
        username: {
          type: sequelize.STRING,
          allowNull: false,
        },
        token: {
          type: sequelize.TEXT,
          allowNull: true,
        },
        
        // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
        createdAt: {
          type: sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: sequelize.DATE,
          allowNull: true,
        }
      }
    )
    }catch(error)
    {
      console.log("error at 20220906131209-resetPassword.js",error)
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('resetPasswords');
  }
};
