import * as dotenv from "dotenv";
import joi from "joi";

dotenv.config();

const envSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid("development", "production", "test")
    .default("development")
    .required(),
  CORS_ORIGIN: joi.string().required(),
  SERVER_PORT: joi.number().required(),
  SERVER_HOST: joi.string().required(),
  SERVER_URL: joi.string().required(),
  APP_NAME: joi.string().required(),
  APP_VERSION: joi.string().required(),
  DATABASE_URL: joi.string().required(),
  ACCESS_TOKEN_SECRET: joi.string().min(8).required(),
  REFRESH_TOKEN_SECRET: joi.string().min(8).required(),
  ACCESS_TOKEN_EXPIRATION: joi.string().required().default("1h"),
  REFRESH_TOKEN_EXPIRATION: joi.string().required().default("7d"),
  REFRESH_TOKEN_COOKIE_NAME: joi.string().required().default("refreshToken"),
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join("\n")}`
  );
}

const config = {
  NODE_ENV: validatedEnv.NODE_ENV,
  CORS: {
    ORIGIN: validatedEnv.CORS_ORIGIN,
  },
  SERVER: {
    PORT: validatedEnv.SERVER_PORT,
    HOST: validatedEnv.SERVER_HOST,
  },
  SERVER_URL: validatedEnv.SERVER_URL,
  APP: {
    NAME: validatedEnv.APP_NAME,
    VERSION: validatedEnv.APP_VERSION,
  },
  DATABASE_URL: validatedEnv.DATABASE_URL,
  JWT: {
    ACCESS_TOKEN: {
      SECRET: validatedEnv.ACCESS_TOKEN_SECRET,
      EXPIRATION: validatedEnv.ACCESS_TOKEN_EXPIRATION,
    },
    REFRESH_TOKEN: {
      SECRET: validatedEnv.REFRESH_TOKEN_SECRET,
      EXPIRATION: validatedEnv.REFRESH_TOKEN_EXPIRATION,
    },
  },
  COOKIE: {
    NAME: validatedEnv.REFRESH_TOKEN_COOKIE_NAME,
  },
} as const;

export default config;
