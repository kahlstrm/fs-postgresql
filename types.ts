import { QueryInterface } from 'sequelize/types';
import { z } from 'zod';
import { tokenParser } from './util/validation';
import { Request } from 'express';
export type UserToken = z.infer<typeof tokenParser>;
export interface ReqWithToken extends Request {
  decodedToken?: UserToken;
}
export interface MigrateParams {
  context: QueryInterface;
}