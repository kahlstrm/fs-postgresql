import { Router } from 'express';
import sequelize from 'sequelize';
import { Blog } from '../models';

const router = Router();

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('blog')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: sequelize.literal('max(likes) DESC'),
  });
  res.json(authors);
});
export default router;
