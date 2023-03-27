const { NONE } = require("sequelize");
const { NotNull } = require("sequelize-typescript");
const { ISACTIVE_FALSE } = require("../middlewares/resp-handler/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
    return Promise.all([
      queryInterface.changeColumn('processes', 'isPredefined', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false,
        after:"isFinalized",
      })
    ]);
  } catch(err) {
    console.log('Error at 20221115113840-Add_predefinedKey1.js',err)
   }
  },

  down: (queryInterface) => {
    // return Promise.all([queryInterface.removeColumn('processes', 'isPredefined')]);
  },
};