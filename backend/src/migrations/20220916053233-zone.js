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
     queryInterface.createTable('zones',
     {
       id : {
         type: Sequelize.UUID,
         primaryKey: true,
         defaultValue: Sequelize.UUIDV4
       },

       siteId: {
        type: Sequelize.UUID,
        allowNull: false
      },
 
      name: {
         type: Sequelize.STRING,
         allowNull: false
       },

       description: {
         type: Sequelize.STRING,
         allowNull: false
       },

       zoneType: {
        type: Sequelize.STRING,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Active', 'Inactive'],
        defaultValue: 'Active',
      },

       numberOfDevice: {
         type: Sequelize.STRING,
         allowNull: true
       },
       
       createdBy: {
         type: Sequelize.UUID,
         allowNull: true
       },
       updatedBy: {
         type: Sequelize.UUID,
         allowNull: true
       },
       // createdAt, UpdatedAt and deletedAt managed by Sequelize
       createdAt: {
         type: Sequelize.DATE,
         allowNull: true
       },
       updatedAt: {
         type: Sequelize.DATE,
         allowNull: true
       },
       deletedAt: {
         type: Sequelize.DATE,
         allowNull: true,
         defaultValue: null,
       }
     })
    }catch(error)
    {
      console.log("error at 20220916053233-zone.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('zones');
  }
};
