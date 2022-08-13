import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { SECRET } from '../util/config';
import User from '../models/user';
import { ReqWithToken, UserToken } from '../types';
import { loginRequest } from '../util/validation';
import { tokenExtractor } from './blogs';
const router = Router();

router.post('/', async (req, res) => {
  const body = loginRequest.parse(req.body);

  const user = await User.findOne({
    where: {
      username: body.username,
    },
    attributes: {
      include: ['password'],
    },
  });
  const passwordCorrect = user?.password
    ? bcrypt.compare(body.password, user.password)
    : false;

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken: UserToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);
  await user.update({ sessions: [...user.sessions, token] });
  return res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});
router.delete('/', tokenExtractor, async (req: ReqWithToken, res) => {
  const user = await User.findByPk(req.decodedToken?.id);
  if (!user) {
    throw Error('invalid token');
  }
  await user.update({
    sessions: [],
  });
  res.send('logget out');
});

export default router;
