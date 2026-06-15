import prisma from "../config/prisma.js";

const productController = {
  // 1. Ambil Semua Produk
  getAll: async (req, res, next) => {
    try {
      const allProducts = await prisma.products.findMany();
      res.status(200).json(allProducts);
    } catch (error) {
      next(error);
    }
  },

  // 2. Ambil Berdasarkan ID
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await prisma.products.findUnique({
        where: { id: BigInt(id) },
      });

      if (!product) {
        return res.status(404).json({ error: "Produk tidak ditemukan" });
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  // 3. Tambah Produk Baru
  create: async (req, res, next) => {
    try {
      const { name, sku, price, stock } = req.body;

      const newProduct = await prisma.products.create({
        data: {
          name,
          sku,
          price: parseFloat(price),
          stock: parseInt(stock),
        },
      });

      res.status(201).json({ message: "Produk berhasil ditambahkan!", data: newProduct });
    } catch (error) {
      next(error);
    }
  },

  // 4. Update Produk
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, sku, price, stock } = req.body;

      const updatedProduct = await prisma.products.update({
        where: { id: BigInt(id) },
        data: {
          name,
          sku,
          price: price ? parseFloat(price) : undefined,
          stock: stock ? parseInt(stock) : undefined,
        },
      });

      res.status(200).json({ message: "Produk berhasil diperbarui!", data: updatedProduct });
    } catch (error) {
      next(error);
    }
  },

  // 5. Hapus Produk
  destroy: async (req, res, next) => {
    try {
      const { id } = req.params;

      await prisma.products.delete({
        where: { id: BigInt(id) },
      });

      res.status(200).json({ message: "Produk berhasil dihapus!" });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;