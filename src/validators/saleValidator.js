import Joi from "joi";

const itemSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required(),
});

export const saleValidationSchema = Joi.object({
  customer_id: Joi.number().integer().optional().allow(null),
  items: Joi.array().items(itemSchema).min(1).required(),
});
