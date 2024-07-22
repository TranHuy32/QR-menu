'use strict';
import { Model, DataTypes } from 'sequelize';
export default (sequelize) => {
  class Option extends Model {
    static associate(models) {
      Option.belongsTo(models.Category, { foreignKey: 'category_id' });
      Option.belongsToMany(models.Order, {
        through: models.Orderdish,
        foreignKey: 'option_id',
        as: 'orders'
    });
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
      allowNull:false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    } 
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
}