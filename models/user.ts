import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

class User extends Model {
  declare id: number;
  declare username: string;
  declare name: string;
  declare password?: string;
  declare disabled: boolean;
  declare sessions: string[];
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
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sessions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
  }
);

export default User;
