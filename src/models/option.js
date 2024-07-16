'use strict';
import { Model, DataTypes } from 'sequelize';
export default (sequelize) => {
  class Option extends Model {
    static associate(models) {
      Option.hasMany(models.Orderdish,{ foreignKey: 'option_id'})
      Option.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }
  Option.init({
    name: {
     type: DataTypes.STRING,
     allowNull:false
    },
    price:{
      type:DataTypes.STRING,
      allowNull:false
    },
    category_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    } 
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
}