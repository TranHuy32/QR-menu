import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Table_name, { foreignKey: 'table_id', as: 'table' });
      Order.belongsTo(models.Bill, {foreignKey:'bill_id'})
      Order.belongsToMany(models.Dish, {
        through: models.Orderdish,
        foreignKey: 'order_id',
        as: 'dishes'
      });
    }
  }
  Order.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    status:{
      type:DataTypes.STRING,
      allowNull: false,
    }, 
    notes:{
      type:DataTypes.STRING,
      allowNull: false,
    }, 
    phone_number:{
      type:DataTypes.STRING,
      allowNull:false

    },
    total_price:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:0
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    table_id:{
      type: DataTypes.INTEGER,
      references:{
        model: 'Table_names', 
        key:'id'
      }
    },
    bill_id:{
      type:DataTypes.INTEGER,
      references:{
        model: 'Bills', 
        key:'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
}