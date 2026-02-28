import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(''),
  imageUrl: z.string().url().optional().or(z.literal('')),
  active: z.boolean().default(true)
});
