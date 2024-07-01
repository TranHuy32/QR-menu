'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserToken, { foreignKey: 'user_id'}); 

    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        // validate: {
        //   isEmail: true,
        // },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      address:{
        type:DataTypes.STRING,
        allowNull:false
      },
      password: {
        type:DataTypes.STRING,
        allowNull:false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  export default User
