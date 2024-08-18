import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Orderdish extends Model {
    static associate(models) {
        Orderdish.belongsTo(models.Dish, { foreignKey: 'dish_id', as: 'dishes' });
        Orderdish.belongsTo(models.Option, { foreignKey: 'option_id', as: 'options' });
        Orderdish.belongsTo(models.Order, { foreignKey: 'order_id', as: 'orders' });
    }
  }
  Orderdish.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    dish_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dish',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Order',
        key: 'id'
      }
    },
    option_id: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Option',
        key: 'id'
      }
    },
    note:{
      type:DataTypes.STRING,
      allowNull:true
    }

  }, {
    sequelize,
    modelName: 'Orderdish',
  });
  return Orderdish;
};