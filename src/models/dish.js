import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Dish extends Model {
    static associate(models) {
      Dish.belongsTo(models.Category, { foreignKey: 'category_id' });
      Dish.belongsToMany(models.Order, {
        through: models.Orderdish,
        foreignKey: 'dish_id',
        as: 'orders'
    });
    }
  }

  Dish.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize,
      modelName: 'Dish',
    }
  );
  return Dish;
};
