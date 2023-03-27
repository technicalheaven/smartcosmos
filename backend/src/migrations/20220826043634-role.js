'use strict';

module.exports = {
  async up (query, sequelize) {
    try{
    await query.createTable('roles',
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
      isPlatformRole: {
        type: sequelize.BOOLEAN,
        allowNull: false,
      },
      isCustom: {
        type: sequelize.BOOLEAN,
        allowNull: false,
      },
      isActive: {
        type: sequelize.BOOLEAN,
        allowNull: false,
      },
      tenantId:{
        type:sequelize.UUID,
        allowNull:true
      },
      createdBy:{
        type: sequelize.BIGINT,
        allowNull: true,
      },
      updatedBy:{
        type: sequelize.BIGINT,
        allowNull: true,
      },
      deletedBy:{
        type: sequelize.BIGINT,
        allowNull: true,
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
    },
    )
  }catch(error)
  {
    console.log("error at 20220826043634-role.js",error)
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
