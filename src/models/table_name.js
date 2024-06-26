'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'

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
  Table.init({
    name: DataTypes.STRING,
    zone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Table_name',
  });
export default Table
