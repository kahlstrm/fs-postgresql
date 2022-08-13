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
export const readingListParser = z.object({
  blog_id: z.number(),
  user_id: z.number(),
});
export const readUpdateParser = z.object({ read: z.boolean() });
