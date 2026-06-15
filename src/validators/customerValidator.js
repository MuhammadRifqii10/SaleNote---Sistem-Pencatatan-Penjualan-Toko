import Joi from "joi";

export const customerValidationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().optional().allow(null),
  phone: Joi.string().max(50).optional().allow(null),
});
