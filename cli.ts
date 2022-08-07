require('dotenv').config();
import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL ?? '', {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});
class Blog extends Model {
  declare id: number;
  declare author?: string;
  declare url: string;
  declare title: string;
  declare likes: number;
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
);
const main = async () => {
  await Blog.sync()
  try {
    const blogs = await Blog.findAll();
    blogs.forEach((blog) => {
      console.log(
        `${blog.author ?? 'Unknown author'}: ${blog.title}, ${blog.likes} likes`
      );
    });
    sequelize.close();
  } catch (e) {
    console.error('Unable to connect to DB:', e);
  }
};
main();
