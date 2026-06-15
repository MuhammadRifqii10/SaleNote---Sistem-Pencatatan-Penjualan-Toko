import "dotenv/config";
import { prismaClient } from "../database/dbConfig.js";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prismaClient.users.create({
    data: {
      name: "superadmin",
      email: "superadmin@itn.ac.id",
      password: hashedPassword,
      created_at: new Date(),
    },
  });

  // sample products
  await prismaClient.products.createMany({
    data: [
      { name: "Produk A", sku: "PRODA", price: 100.0, stock: 50, created_at: new Date() },
      { name: "Produk B", sku: "PRODB", price: 200.0, stock: 30, created_at: new Date() },
    ],
  });

  // sample customers
  await prismaClient.customers.createMany({
    data: [
      { name: "Toko Contoh", email: "contoh@toko.test", phone: "08123456789", created_at: new Date() },
      { name: "Pelanggan B", email: "pelangganb@toko.test", phone: "0822334455", created_at: new Date() },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prismaClient.$disconnect());
