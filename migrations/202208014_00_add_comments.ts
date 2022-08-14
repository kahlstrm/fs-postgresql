import { DataTypes } from 'sequelize';
import { MigrateParams } from '../types';

export const up = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.addColumn('blogs', 'comments', {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  });
};

export const down = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.removeColumn('blogs', 'comments');
};
