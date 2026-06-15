import customerModel from "../models/customerModel.js";
import validator from "../validators/validator.js";
import { customerValidationSchema } from "../validators/customerValidator.js";

const getAll = async (req, res, next) => {
  try {
    const customers = await customerModel.getAll();
    return res.json({ status: true, data: customers });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && isNaN(id)) return res.status(400).json({ error: "ID dibutuhkan" });
    const customer = await customerModel.getById(id);
    if (!customer) return res.status(404).json({ error: "Data tidak ditemukan" });
    return res.json({ status: true, data: customer });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body) return res.status(400).json({ error: "Data tidak lengkap" });
    const { error, value } = validator(customerValidationSchema, body);
    if (error) return res.status(400).json({ status: false, error });
    const newCustomer = await customerModel.create({
      name: value.name,
      email: value.email || null,
      phone: value.phone || null,
      created_at: new Date(),
    });
    return res.status(201).json({ status: true, data: newCustomer });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    if (id && isNaN(id)) return res.status(400).json({ error: "ID dibutuhkan" });
    if (!body) return res.status(400).json({ error: "Data tidak lengkap" });
    const { error, value } = validator(customerValidationSchema, body);
    if (error) return res.status(400).json({ status: false, error });
    const customer = await customerModel.update({
      name: value.name,
      email: value.email || null,
      phone: value.phone || null,
      updated_at: new Date(),
    }, id);
    return res.status(200).json({ status: true, data: customer });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && isNaN(id)) return res.status(400).json({ error: "ID dibutuhkan" });
    const customer = await customerModel.getById(id);
    if (!customer) return res.status(404).json({ error: "Data tidak ditemukan" });
    await customerModel.delete(id);
    return res.json({ status: true, message: "Terhapus", data: customer });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getById, create, update, destroy };
