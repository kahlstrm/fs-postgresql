import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { Blog, User, ReadingList } from '../models';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';
import { UserToken } from '../types';
import { blogCommentParser, tokenParser } from '../util/validation';
import { Op, WhereOptions } from 'sequelize';
const router = Router();

interface CustomReq extends Request {
  blog?: Blog;
  decodedToken?: UserToken;
}
export const tokenExtractor: RequestHandler = async (
  req: CustomReq,
  _,
  next
) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const parsed = tokenParser.parse(jwt.verify(auth.substring(7), SECRET));
    const user = await User.findByPk(parsed.id, {
      attributes: ['id', 'sessions', 'disabled'],
    });
    if (!user || !user.sessions.includes(auth.substring(7))) {
      throw Error('invalid token');
    }
    if (user.disabled) {
      await user.update({ sessions: [] });
      throw Error('account disabled, contact admin');
    }
    req.decodedToken = parsed;
  } else {
    throw Error('token missing');
  }
  next();
};
const blogMiddleware = async (
  req: CustomReq,
  _: Response,
  next: NextFunction
) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    throw Error('invalid blog id');
  }
  req.blog = blog;
  next();
};

router.get('/', async (req, res) => {
  let where: WhereOptions = {};
  if (req.query.serch) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: '%' + req.query.serch + '%',
          },
        },
        {
          author: {
            [Op.iLike]: '%' + req.query.serch + '%',
          },
        },
      ],
    };
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req: CustomReq, res) => {
  const user = await User.findByPk(req.decodedToken?.id);
  if (!user) {
    throw Error('User not found');
  }
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  res.json(blog);
});

router.get('/:id', blogMiddleware, (req: CustomReq, res) => {
  res.json(req.blog);
});
router.delete(
  '/:id',
  blogMiddleware,
  tokenExtractor,
  async (req: CustomReq, res) => {
    console.log(req.blog?.toJSON());
    console.log(req.decodedToken);
    if (req.blog?.userId === req.decodedToken?.id) {
      await ReadingList.destroy({
        where: {
          blogId: req.blog?.id,
        },
      });
      await req.blog?.destroy();
      res.json(req.blog);
    } else {
      res.send(401).end();
    }
  }
);
router.put('/:id', blogMiddleware, async (req: CustomReq, res) => {
  if (!req.body.likes) {
    throw Error('property likes missing from body');
  }
  // couldn't figure out how to change blog type in middleware
  req.blog!.likes = req.body.likes;
  const updated = await req.blog!.save();
  res.json(updated);
});
router.post('/:id/comments', blogMiddleware, async (req: CustomReq, res) => {
  const body = blogCommentParser.parse(req.body);
  const test = await req.blog?.update({
    comments: [...req.blog.comments, body.comment],
  });
  console.log(test);
  res.json(test?.toJSON());
});

export default router;
