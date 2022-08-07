import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

class User extends Model {
  declare id: number;
  declare username: string;
  declare name: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  }
);

export default User;
