import { z } from "zod";

export const webhooksListItemSchema = z.object({
    id: z.uuidv7(),
    method: z.string(),
    pathname: z.string(),
    createdAt: z.string(),
})

export const webhookListSchema = z.object({
    webhooks: z.array(webhooksListItemSchema),
    nextCursor: z.string().nullable(),
})