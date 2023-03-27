'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      await Promise.all([

        queryInterface.addColumn('enablements', 'unSecureEnabledCount', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }),

        queryInterface.addColumn('enablements', 'unSecureDeEnabledCount', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        })

      ])

    }
    catch (error) {
      console.log('Error at 20230127111150-updatedEnabelementTableDashboardCount.js  ',error)
    }
  },

  async down(queryInterface, Sequelize) {
    try{
      await Promise.all([
        queryInterface.removeColumn('enablements', 'unSecureEnabledCount'),
        queryInterface.removeColumn('enablements', 'unSecureDeEnabledCount')
      ]);
    }
    catch (err){
      console.log("error at 20221212113140-Update_Process.js down",err);
    }
  }
  
};
