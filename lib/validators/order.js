import { z } from 'zod';

export const orderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    alternativePhone: z.string().optional().default(''),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().min(3),
    district: z.string().min(2),
    thana: z.string().min(2)
  }),
  productId: z.string(),
  quantity: z.number().int().min(1),
  itemDescription: z.string().optional().default(''),
  note: z.string().optional().default(''),
  weightKg: z.number().min(0),
  exchange: z.boolean().default(false),
  exactPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  deliveryCost: z.number().min(0),
  status: z.enum(['pending', 'processing', 'delivered', 'returned', 'partial', 'cancelled']),
  pushToSteadfast: z.boolean().default(false)
});
