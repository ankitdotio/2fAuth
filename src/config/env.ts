import z from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "testing"]),
  PORT: z.coerce.number().default(3000),
  SERVER_REQUEST_TIMEOUT: z.coerce.number(),
  DB_STRING: z.string(),
});

export const config = schema.parse(process.env);
