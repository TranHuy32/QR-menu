import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Evaluate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Evaluate.init(
    {
    description: {
      type: DataTypes.STRING,
      allowNull:true
    },
    image: {
      type: DataTypes.STRING,
      allowNull:true
    },
  }, {
    sequelize,
    modelName: 'Evaluate',
  });
  return Evaluate;
};