import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Table_name, { foreignKey: 'table_id' });
      Order.belongsToMany(models.Dish,{through: models.Orderdish,foreignKey:'order_id',as:'dishes'});
    }
  }
  Order.init({
    status:{
      type:DataTypes.STRING,
      allowNull: false,
    }, 
    notes:{
      type:DataTypes.STRING,
      allowNull: false,
    }, 
    table_id:{
      type: DataTypes.INTEGER,
      references:{
        model: 'Table_names', 
        key:'id'
      }
    } 
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};