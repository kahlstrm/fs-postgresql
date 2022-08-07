import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { Blog, User } from '../models';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';
import { UserToken } from '../types';
import { tokenParser } from '../util/validation';
const router = Router();

interface CustomReq extends Request {
  blog?: Blog;
  decodedToken?: UserToken;
}
export const tokenExtractor: RequestHandler = (req: CustomReq, _, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    console.log(auth.substring(7));
    req.decodedToken = tokenParser.parse(jwt.verify(auth.substring(7), SECRET));
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
router.get('/', async (_, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
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
    console.log(req.blog);
    console.log(req.decodedToken);

    if (req.blog?.userId === req.decodedToken?.id) {
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

export default router;
