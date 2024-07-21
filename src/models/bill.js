import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bill.hasMany(models.Order, {foreignKey:'order_id'})
    }
  }
  Bill.init({
    user_id: {
    type:DataTypes.INTEGER,
    allowNull: false,
    },
    customer: {
      type:DataTypes.STRING,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};