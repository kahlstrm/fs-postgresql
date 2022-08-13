import { DataTypes } from 'sequelize';
import { MigrateParams } from '../types';

export const up = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.createTable('reading_lists', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      allowNull:false
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: { model: 'blogs', key: 'id' },
      allowNull:false
    },
  });
};

export const down = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.dropTable('reading_lists');
};
