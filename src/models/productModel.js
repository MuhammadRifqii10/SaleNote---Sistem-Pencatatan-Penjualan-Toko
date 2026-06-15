import { prismaClient } from "../database/dbConfig.js";

const productModel = {
  getAll: async () => {
    return prismaClient.products.findMany();
  },
  getById: async (id) => {
    return prismaClient.products.findUnique({
      where: { id: Number(id) },
    });
  },
  create: async (data) => {
    return prismaClient.products.create({ data });
  },
  update: async (data, id) => {
    return prismaClient.products.update({
      where: { id: Number(id) },
      data,
    });
  },
  delete: async (id) => {
    return prismaClient.products.delete({ where: { id: Number(id) } });
  },
};

export default productModel;
