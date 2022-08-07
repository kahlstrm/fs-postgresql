import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config';

export const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('connected to DB.');
  } catch (error) {
    console.error('Error connecting to DB', error);
    return process.exit(1);
  }
  return null;
};
