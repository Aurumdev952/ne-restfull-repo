import z from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
});
export const updateItemSchema = createItemSchema.partial();
export type CreateItemSchemaInput = z.infer<typeof createItemSchema>;
export type UpdateItemSchemaInput = z.infer<typeof updateItemSchema>;
