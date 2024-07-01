'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Dish, { foreignKey: 'category_id' }); 
      // Thiết lập mối quan hệ hasMany với Car
    }
  }
  Category.init({
    name:{
      type:DataTypes.STRING,
      allowNull: false,
    } 
  }, {
    sequelize,
    modelName: 'Category',
  });
export default Category
