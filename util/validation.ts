import { z } from 'zod';
export const loginRequest = z.object({
  username: z.string(),
  password: z.string(),
});
export const createUserRequest = loginRequest.extend({
  name: z.string(),
});
export const tokenParser = z.object({
  username: z.string(),
  id: z.number(),
});
