import saleModel from "../models/saleModel.js";
import validator from "../validators/validator.js";
import { saleValidationSchema } from "../validators/saleValidator.js";

const getAll = async (req, res, next) => {
  try {
    const sales = await saleModel.getAll();
    return res.json({ status: true, data: sales });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && isNaN(id)) return res.status(400).json({ error: "ID dibutuhkan" });
    const sale = await saleModel.getById(id);
    if (!sale) return res.status(404).json({ error: "Data tidak ditemukan" });
    return res.json({ status: true, data: sale });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body) return res.status(400).json({ error: "Data tidak lengkap" });
    const { error, value } = validator(saleValidationSchema, body);
    if (error) return res.status(400).json({ status: false, error });

    const sale = await saleModel.create({ customer_id: value.customer_id, items: value.items });
    return res.status(201).json({ status: true, data: sale });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getById, create };
