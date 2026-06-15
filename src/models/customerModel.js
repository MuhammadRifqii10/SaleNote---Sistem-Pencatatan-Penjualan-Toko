import { prismaClient } from "../database/dbConfig.js";

const customerModel = {
  getAll: async () => {
    return prismaClient.customers.findMany();
  },
  getById: async (id) => {
    return prismaClient.customers.findUnique({ where: { id: Number(id) } });
  },
  create: async (data) => {
    return prismaClient.customers.create({ data });
  },
  update: async (data, id) => {
    return prismaClient.customers.update({ where: { id: Number(id) }, data });
  },
  delete: async (id) => {
    return prismaClient.customers.delete({ where: { id: Number(id) } });
  },
};

export default customerModel;
