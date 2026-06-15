import categoryModel from "../models/categoryModel.js";
import validator from "../validators/validator.js";
import { categoriesValidationSchema } from "../validators/categoriesValidator.js";

const getAll = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAll();
    if (!categories) {
      return res.status(404).json({
        status: false,
        message: "Data kategori tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Data kategori ditemukan",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: "ID harus berupa angka",
      });
    }
    const category = await categoryModel.getById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Data kategori tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Data kategori ditemukan",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    const { error, value } = validator(categoriesValidationSchema, body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error,
      });
    }

    const category = await categoryModel.create(value);
    return res.status(201).json({
      status: true,
      message: "Data kategori berhasil ditambahkan",
      data: {
        id: Number(category.id),
        name: category.name,
      }
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    if (isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: "ID harus berupa angka",
      });
    }
    const { error, value } = validator(categoriesValidationSchema, body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error,
      });
    }

    const category = await categoryModel.update(value, id);
    return res.status(200).json({
      status: true,
      message: "Data kategori berhasil diubah",
      data: {
        id: Number(category.id),
        name: category.name,
      }
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: "ID harus berupa angka",
      });
    }

    const category = await categoryModel.delete(id);
    return res.status(200).json({
      status: true,
      message: "Data kategori berhasil dihapus",
      data: {
        id: Number(category.id),
        name: category.name,
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getById, create, update, destroy };
