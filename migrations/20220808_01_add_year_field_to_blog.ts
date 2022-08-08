import { DataTypes } from 'sequelize';
import { MigrateParams } from '../types';

export const up = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.addColumn('blogs', 'year', {
    type: DataTypes.INTEGER,
    validate: {
      min: 1991,
      maxYear(value: any) {
        if (parseInt(value) > new Date().getFullYear()) {
          throw Error('year cannot be in the future');
        }
      },
    },
  });
};

export const down = async ({ context: queryInterface }: MigrateParams) => {
  await queryInterface.removeColumn('blogs', 'year');
};
