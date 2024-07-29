import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Bill extends Model {
    static associate(models) {
      Bill.hasMany(models.Order, { foreignKey: 'bill_id' })
    }
  }
  Bill.init({
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Employees', 
        key:'id'
      }
    },
    total_price:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:0
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};