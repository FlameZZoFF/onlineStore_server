const {Sequelize} = require('sequelize')

module.exports = new Sequelize(222,{
  define:{
    timestamps:false
  }
});
