import Joi from "joi";

// Validation expects Indonesian field names: nama_barang, harga, stok
export const productValidationSchema = Joi.object({
  nama_barang: Joi.string().min(1).max(255).required(),
  sku: Joi.string().max(100).optional().allow(null, ""),
  harga: Joi.number().precision(2).min(0).required(),
  stok: Joi.number().integer().min(0).required(),
});
