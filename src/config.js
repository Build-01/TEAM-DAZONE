const Joi = require("joi");

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default("sabiwork"),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRY: Joi.string().default("7d"),
  SQUAD_API_KEY: Joi.string().required(),
  SQUAD_API_BASE_URL: Joi.string().uri().default("https://api.sandbox.squad.co"),
  SQUAD_WEBHOOK_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().uri().default("redis://localhost:6379"),
  HUGGING_FACE_API_KEY: Joi.string().allow("").optional(),
  FRONTEND_URL: Joi.string().uri().default("http://localhost:3001"),
})
  .unknown()
  .required();

const validateConfig = () => {
  const { error, value } = schema.validate(process.env, { abortEarly: false, allowUnknown: true });
  if (error) {
    throw new Error(`Environment validation error: ${error.details.map((d) => d.message).join(", ")}`);
  }

  Object.assign(process.env, value);
};

module.exports = {
  validateConfig,
};
