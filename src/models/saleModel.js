import { prismaClient } from "../database/dbConfig.js";

const saleModel = {
  getAll: async () => {
    return prismaClient.sales.findMany({
      include: {
        customer: true,
        sale_items: { include: { products: true } },
      },
    });
  },
  getById: async (id) => {
    return prismaClient.sales.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        sale_items: { include: { products: true } },
      },
    });
  },
  create: async (data) => {
    // data: { customer_id, items: [{ product_id, quantity, price }] }
    const items = data.items || [];
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);

    const createData = {
      customer_id: data.customer_id ? Number(data.customer_id) : null,
      total,
      created_at: new Date(),
      sale_items: {
        create: items.map((it) => ({
          product_id: Number(it.product_id),
          quantity: Number(it.quantity),
          price: Number(it.price),
          subtotal: Number(it.price) * Number(it.quantity),
        })),
      },
    };

    // Create sale and decrement stock in a transaction
    const tx = [
      prismaClient.sales.create({
        data: createData,
        include: {
          sale_items: {
            include: { products: true }
          }
        }
      })
    ];
    items.forEach((it) => {
      tx.push(
        prismaClient.products.update({
          where: { id: Number(it.product_id) },
          data: { stock: { decrement: Number(it.quantity) } },
        }),
      );
    });

    const results = await prismaClient.$transaction(tx);
    return results[0];
  },
};

export default saleModel;
