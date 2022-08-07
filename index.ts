require('express-async-errors');
import express from 'express';
import blogRouter from './controllers/blogs';
import { errorHandler } from './util/middleware';
import { PORT } from './util/config';
import { connectToDb } from './util/db';
const app = express();

app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use(errorHandler);
const start = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
