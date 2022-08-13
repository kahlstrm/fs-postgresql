import { Router } from 'express';
import bcrypt from 'bcrypt';
const router = Router();

import { Blog, User } from '../models';
import { createUserRequest, tokenParser } from '../util/validation';
import { tokenExtractor } from './blogs';
import { ReqWithToken } from '../types';
import { WhereOptions } from 'sequelize';

router.get('/', async (_, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['id'] },
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
  let where: WhereOptions = {};
  if (req.query.read !== undefined) {
    where = {
      read: req.query.read,
    };
  }
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        through: {
          attributes: ['read', 'id'],
          where,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userId'],
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

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
