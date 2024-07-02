import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4, v4 } from 'uuid';

export default (sequelize) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Table.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING,
        defaultValue: () => v4(), // Đảm bảo sinh UUID tự động cho trường uuid
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Table_name',
    }
  );
  return Table;
};
