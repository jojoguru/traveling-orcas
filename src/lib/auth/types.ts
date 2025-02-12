import { z } from 'zod';

export const authCodeSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  code: z.string().length(6),
  expires_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

export const authSessionSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  expires_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

export type AuthCode = z.infer<typeof authCodeSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>; 