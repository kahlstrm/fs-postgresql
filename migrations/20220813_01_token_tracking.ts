import { DataTypes } from 'sequelize';
import { MigrateParams } from '../types';

export const up = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.addColumn('users', 'disabled', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
  await queryInterface.addColumn('users', 'sessions', {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  });
};

export const down = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.removeColumn('users', 'disabled');
  await queryInterface.removeColumn('users', 'sessions');
};
