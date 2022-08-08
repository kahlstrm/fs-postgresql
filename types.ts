import { QueryInterface } from 'sequelize/types';
import { z } from 'zod';
import { tokenParser } from './util/validation';

export type UserToken = z.infer<typeof tokenParser>;

export interface MigrateParams {
  context: QueryInterface;
}