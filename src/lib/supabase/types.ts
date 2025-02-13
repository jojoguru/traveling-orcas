import { z } from 'zod';

export const orcaSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  created_at: z.string().datetime({ offset: true }),
});

export type Orca = z.infer<typeof orcaSchema>;

export const entrySchema = z.object({
  id: z.string().uuid(),
  orca_id: z.string().min(1),
  name: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  message: z.string().min(1),
  photo_url: z.string().url(),
  created_at: z.string().datetime({ offset: true }),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export type Entry = z.infer<typeof entrySchema>;

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

export type Database = {
  public: {
    Tables: {
      entries: {
        Row: Entry;
        Insert: Omit<Entry, 'id' | 'created_at'>;
        Update: Partial<Omit<Entry, 'id' | 'created_at'>>;
      };
      orcas: {
        Row: Orca;
        Insert: Omit<Orca, 'id' | 'created_at'>;    
      };
    };
  };
}; 