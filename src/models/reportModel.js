import { prismaClient } from "../database/dbConfig.js";

const reportModel = {
  daily: async (date) => {
    const start = new Date(date + "T00:00:00Z");
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const sales = await prismaClient.sales.findMany({
      where: { created_at: { gte: start, lt: end } },
      include: { sale_items: { include: { products: true } } },
    });

    return sales;
  },
  monthly: async (year, month) => {
    // month: 1-12
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const sales = await prismaClient.sales.findMany({
      where: { created_at: { gte: start, lt: end } },
      include: { sale_items: { include: { products: true } } },
    });
    return sales;
  },
};

export default reportModel;
