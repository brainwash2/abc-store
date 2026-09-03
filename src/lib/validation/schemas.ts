import { z } from 'zod';

export const cartItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.string().optional(),
  quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  addressId: z.string().uuid(),
  deliveryMethod: z.enum(['standard', 'express', 'pickup']),
  paymentMethod: z.enum(['cash_delivery', 'whatsapp', 'chargily']),
});

export const chargilyCheckoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  addressId: z.string().uuid(),
  deliveryMethod: z.enum(['standard', 'express', 'pickup']),
});

export const emailSendSchema = z.object({
  type: z.enum(['shipped', 'order']),
  orderId: z.string().uuid(),
});
