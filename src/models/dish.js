'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dish.belongsTo(models.Category, { foreignKey: 'category_id' }); // Thiết lập mối quan hệ belongsTo với User
    }
  }
  Dish.init({
    name:
    {
       type:DataTypes.STRING,
       allowNull: false
    },
    price:
    {
      type:DataTypes.STRING,
      allowNull: false
    },
    image:
    {
      type:DataTypes.STRING,
      allowNull: false
    }, 
    description:
    {
      type:DataTypes.STRING,
      allowNull: false
    },
    category_id:
    {
      type: DataTypes.INTEGER,
      references:{
        model:'Categories',
        key:'id'
      },
      // onUpdate:'CASCADE',
      // onDelete:'SET NULL'
    } 
  }, {
    sequelize,
    modelName: 'Dish',
  });
export default Dish
