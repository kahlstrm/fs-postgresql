import { Request, Router } from 'express';
import bcrypt from 'bcrypt';
const router = Router();

import { Blog, User } from '../models';
import { createUserRequest, tokenParser } from '../util/validation';
import { tokenExtractor } from './blogs';
import { UserToken } from '../types';

router.get('/', async (_, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['id', 'password'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});
router.post('/', async (req, res) => {
  const user = createUserRequest.parse(req.body);
  if (user.password.length < 5) {
    throw Error('incorrect password length');
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);
  const created = await User.create({ ...user, password: passwordHash });
  res.json({ ...created.toJSON(), password: undefined });
});
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});
interface ReqWithToken extends Request {
  decodedToken?: UserToken;
}
router.put('/:username', tokenExtractor, async (req: ReqWithToken, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (!user) {
    return res.status(400).end();
  }
  const decodedToken = tokenParser.parse(req.decodedToken);
  if (decodedToken.id !== user.id) {
    return res.status(401).end();
  }
  user.name = req.body.name;
  await user.save();
  return res.json(user);
});
export default router;
