import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db';

class Blog extends Model {
  declare id: number;
  declare author?: string;
  declare title: string;
  declare url: string;
  declare likes: number;
  declare userId: number;
  declare year: number;
  declare comments:string[];
}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        maxYear(value: any) {
          if (parseInt(value) > new Date().getFullYear()) {
            throw Error('year cannot be in the future');
          }
        },
      },
    },
    comments:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'blog',
  }
);

export default Blog;
