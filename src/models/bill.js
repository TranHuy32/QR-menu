import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Bill extends Model {
    static associate(models) {
      Bill.hasMany(models.Order, { foreignKey: 'bill_id' })
    }
  }
  Bill.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    total_price: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0
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