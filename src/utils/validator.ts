import Joi from "joi";

const validator = (schema: any) => (payload: any) => {
  schema.validate(payload, { abortEarly: false });
};

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

export const validateSignup = validator(signupSchema);
