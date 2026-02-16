import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    PORT: z.string().min(1),
    MONGO_URI: z.string().min(1),
    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    REDIS_URL: z.string().min(1),
    FRONTEND_URL: z.string().min(1),
    EMAIL_HOST: z.string().min(1),
    EMAIL_PORT: z.string().min(1),
    EMAIL_USER: z.string().min(1),
    EMAIL_PASS: z.string().min(1),
    EMAIL_FROM: z.string().min(1)
});

const envVars = {
    ...process.env,
    MONGO_URI: process.env.MONGO_URI || process.env.MONGO_URI_DOCKER,
    REDIS_URL: process.env.REDIS_URL || process.env.REDIS_URL_DOCKER
};

const parsedEnv = envSchema.safeParse(envVars);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
