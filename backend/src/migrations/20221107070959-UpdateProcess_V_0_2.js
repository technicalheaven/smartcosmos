'use strict';

const { count } = require('console');
/** @type {import('sequelize-cli').Migration} */
const { Process, sequelize } = require('../config/db');

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      let p=0;
      let processData = await sequelize.query('desc processes');
      if(processData!=null)
      {
        for(let i=0; i<processData[0].length;i++)
        {
           if(processData[0][i].Field==='initialState')
           {
            p++;
           } 
        }

      if(p==0) 
        {
          return Promise.all([
                queryInterface.addColumn('processes', 'initialState', {
                  type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: true,
                after: "description"
              }),
              queryInterface.changeColumn('processes', 'status', {
                type: Sequelize.STRING,
                allowNull: false,
              }),
            ]);
        }
      }
    } catch(err) {
      console.log('error at 20221107070959-UpdateProcess_V_0_2.js',err)
  
    }
  },  

  async down (queryInterface, Sequelize) {

    return Promise.all([
                 queryInterface.removeColumn('processes', 'initialState')
       ])

  }
};
