import z from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "testing"]),
});

export const config = schema.parse(process.env);
