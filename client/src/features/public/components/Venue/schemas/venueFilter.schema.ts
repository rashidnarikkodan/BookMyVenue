import { z } from 'zod';

const positiveNumber = z
  .string()
  .refine(
    (value) =>
      value === '' ||
      (!isNaN(Number(value)) && Number(value) >= 0 && Number.isInteger(Number(value))),
    {
      message: 'Must be a positive integer',
    }
  );

export const venueFilterSchema = z
  .object({
    minPrice: positiveNumber,
    maxPrice: positiveNumber,
    capacity: positiveNumber,
  })
  .superRefine((data, ctx) => {
    const minPrice = Number(data.minPrice);
    const maxPrice = Number(data.maxPrice);

    if (data.minPrice && data.maxPrice && minPrice > maxPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxPrice'],
        message: 'Max price must be greater than or equal to min price',
      });
    }
  });
