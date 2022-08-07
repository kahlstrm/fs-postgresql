import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);
  console.log(error);
  res.status(400).send({ error: error.message });
  next(error);
};
