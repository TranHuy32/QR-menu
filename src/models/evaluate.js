import { Model, DataTypes } from 'sequelize';
import { evaluateStar } from '../const/const';

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
    phone_number: {
      type: DataTypes.STRING,
      allowNull:true
    },
    image: {
      type: DataTypes.STRING,
      allowNull:true
    },
    star: {
      type: DataTypes.ENUM(evaluateStar.one, evaluateStar.two, evaluateStar.three, evaluateStar.four, evaluateStar.five),
      defaultValue: evaluateStar.five
    },
  }, {
    sequelize,
    modelName: 'Evaluate',
  });
  return Evaluate;
};