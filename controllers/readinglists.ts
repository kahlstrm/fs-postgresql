import { Router } from 'express';
import { readingListParser, readUpdateParser } from '../util/validation';
import { ReadingList } from '../models';
import { tokenExtractor } from './blogs';
import { ReqWithToken } from '../types';

const router = Router();

router.post('/', async (req, res) => {
  const { user_id: userId, blog_id: blogId } = readingListParser.parse(
    req.body
  );
  const search = await ReadingList.findOne({ where: { userId, blogId } });
  if (!search) {
    await ReadingList.create({
      blogId,
      userId,
    });
    return res.json({ userId, blogId });
  }
  return res.json({ error: "blog already in user's reading list" });
});
router.put('/:id', tokenExtractor, async (req: ReqWithToken, res) => {
  const body = readUpdateParser.parse(req.body);
  const readingList = await ReadingList.findByPk(req.params.id);
  if (!readingList) {
    throw Error('invalid id');
  }
  if (readingList.userId !== req.decodedToken?.id) {
    res.status(401).send('Unauthorized');
  }
  await readingList.update({ read: body.read });
  res.json({ hello: 'team' });
});
export default router;
