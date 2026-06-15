import newsModel from "../models/newsModel.js";
import slugify from "slugify";
import validator from "../validators/validator.js";
import { newsValidationSchema } from "../validators/newsValidator.js";

const getAll = async (req, res, next) => {
  try {
    const news = await newsModel.getAll();
    if (!news) {
      return res.status(404).json({
        status: false,
        message: "Data berita tidak ditemukan",
      });
    }

    const mapNews = news.map((item) => {
      return {
        id: Number(item.id),
        title: item.title,
        slug: item.slug,
        content: item.content,
        image: item.image,
        user: {
          id: Number(item.users.id),
          name: item.users.name,
          email: item.users.email,
        },
        category: {
          id: Number(item.categories.id),
          name: item.categories.name,
        },
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Data berita ditemukan",
      data: mapNews,
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
    const news = await newsModel.getById(id);
    if (!news) {
      return res.status(404).json({
        status: false,
        message: "Data berita tidak ditemukan",
      });
    }

    const mapNews = {
      id: Number(news.id),
      title: news.title,
      slug: news.slug,
      content: news.content,
      image: news.image,
      user: {
        id: Number(news.users.id),
        name: news.users.name,
        email: news.users.email,
      },
      category: {
        id: Number(news.categories.id),
        name: news.categories.name,
      },
      created_at: news.created_at,
      updated_at: news.updated_at,
    };

    return res.status(200).json({
      status: true,
      message: "Data berita ditemukan",
      data: mapNews,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    const { error, value } = validator(newsValidationSchema, body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error,
      });
    }

    const data = {
      ...value,
      slug: slugify(value.title, { lower: true }),
      user_id: Number(req.user.id),
    };

    const news = await newsModel.create(data);
    return res.status(201).json({
      status: true,
      message: "Data berita berhasil ditambahkan",
      data: {
        ...news,
        id: Number(news.id),
        category_id: Number(news.category_id),
        user_id: Number(news.user_id),
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

    const { error, value } = validator(newsValidationSchema, body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error,
      });
    }

    const data = {
      ...value,
      slug: slugify(value.title, { lower: true }),
      user_id: Number(req.user.id),
    };

    const news = await newsModel.update(data, id);
    return res.status(200).json({
      status: true,
      message: "Data berita berhasil diubah",
      data: {
        ...news,
        id: Number(news.id),
        category_id: Number(news.category_id),
        user_id: Number(news.user_id),
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
    const news = await newsModel.delete(id);
    return res.status(200).json({
      status: true,
      message: "Data berita berhasil dihapus",
      data: {
        ...news,
        id: Number(news.id),
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getById, create, update, destroy };
