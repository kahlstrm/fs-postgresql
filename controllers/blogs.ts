import { Router, Request, Response, NextFunction } from 'express';
import { Blog } from '../models';

const router = Router();

interface CustomReq extends Request {
  blog?: Blog;
}

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
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
});

router.get('/:id', blogMiddleware, (req: CustomReq, res) => {
  res.json(req.blog);
});
router.delete('/:id', blogMiddleware, async (req: CustomReq, res) => {
  await req.blog?.destroy();
  res.json(req.blog);
});
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
