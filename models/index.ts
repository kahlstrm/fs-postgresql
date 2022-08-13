import Blog from './blog';
import User from './user';
import ReadingList from './reading_list';
User.hasMany(Blog);
Blog.belongsTo(User);
Blog.belongsToMany(User, { through: ReadingList, as: 'markedUsers' });
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
export { Blog, User,ReadingList };
