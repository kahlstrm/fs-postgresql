import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { SECRET } from '../util/config';
import User from '../models/user';
import { UserToken } from '../types';
import { loginRequest } from '../util/validation';
const router = Router();

router.post('/', async (req, res) => {
  const body = loginRequest.parse(req.body);

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = user
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

  return res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

export default router;
