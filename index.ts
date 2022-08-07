require('express-async-errors');
import express from 'express';
import { errorHandler } from './util/middleware';
import { PORT } from './util/config';
import { connectToDb } from './util/db';
import blogRouter from './controllers/blogs';
import userRouter from './controllers/users';
import loginRouter from './controllers/login';
const app = express();

app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);
const start = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
