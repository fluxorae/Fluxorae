import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().trim().default('api'),
  CORS_ORIGINS: Joi.string().allow('').optional(),
  TRUST_PROXY: Joi.string().allow('').optional(),
  BODY_SIZE_LIMIT: Joi.string().trim().default('1mb'),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(60000),
  RATE_LIMIT_MAX: Joi.number().integer().min(10).default(120),
  JWT_SECRET: Joi.string()
    .min(16)
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().min(16).required(),
      otherwise: Joi.string().min(16).default('fluxorae-dev-secret-change-me'),
    }),
  JWT_EXPIRES_IN: Joi.string().trim().default('8h'),
  DATABASE_URL: Joi.string()
    .pattern(/^postgres(ql)?:\/\//)
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().pattern(/^postgres(ql)?:\/\//).required(),
      otherwise: Joi.string()
        .pattern(/^postgres(ql)?:\/\//)
        .default('postgresql://postgres:password@localhost:5432/fluxorae_erp'),
    }),
}).unknown(true);
