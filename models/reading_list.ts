import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db';

class ReadingList extends Model {
  declare id:number;
  declare read:boolean;
  declare blogId:number;
  declare userId:number;
}

ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      references: { model: 'blogs', key: 'id' },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps:false,
    modelName: 'reading_list',
  }
);

export default ReadingList