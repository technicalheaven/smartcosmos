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
     queryInterface.createTable('deviceTypeModel',
     {
       id : {
         type: Sequelize.UUID,
         primaryKey: true,
         defaultValue: Sequelize.UUIDV4
       },
 
      type: {
         type: Sequelize.STRING,
         allowNull: false
       },
  
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Active', 'Inactive'],
        defaultValue: 'Active',
      },
       
      createdBy: {
         type: Sequelize.UUID,
         allowNull: true
       },
       updatedBy: {
         type: Sequelize.UUID,
         allowNull: true
       },
      
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
      console.log("error at 20221006103737-deviceTypeModel.js",error)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('deviceTypeModel');
  }
};
