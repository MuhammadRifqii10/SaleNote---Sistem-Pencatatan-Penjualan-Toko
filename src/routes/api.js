import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";
import categories from "../controllers/categoryController.js";
import news from "../controllers/newsController.js";
import products from "../controllers/productController.js";
import customers from "../controllers/customerController.js";
import sales from "../controllers/saleController.js";
import reports from "../controllers/reportController.js";
import jwtAuth from "../middleware/jwtAuth.js";

router.post("/auth", authController.login);
router.get("/categories", jwtAuth, categories.getAll);
router.get("/categories/:id", jwtAuth, categories.getById);
router.post("/categories", jwtAuth, categories.create);
router.put("/categories/:id", jwtAuth, categories.update);
router.delete("/categories/:id", jwtAuth, categories.destroy);
router.get("/news", jwtAuth, news.getAll);
router.get("/news/:id", jwtAuth, news.getById);
router.post("/news", jwtAuth, news.create);
router.put("/news/:id", jwtAuth, news.update);
router.delete("/news/:id", jwtAuth, news.destroy);

// Products
router.get("/products", jwtAuth, products.getAll);
router.get("/products/:id", jwtAuth, products.getById);
router.post("/products", jwtAuth, products.create);
router.put("/products/:id", jwtAuth, products.update);
router.delete("/products/:id", jwtAuth, products.destroy);

// Customers
router.get("/customers", jwtAuth, customers.getAll);
router.get("/customers/:id", jwtAuth, customers.getById);
router.post("/customers", jwtAuth, customers.create);
router.put("/customers/:id", jwtAuth, customers.update);
router.delete("/customers/:id", jwtAuth, customers.destroy);

// Sales
router.get("/sales", jwtAuth, sales.getAll);
router.get("/sales/:id", jwtAuth, sales.getById);
router.post("/sales", jwtAuth, sales.create);

// Reports
router.get("/reports/daily", jwtAuth, reports.daily);
router.get("/reports/monthly", jwtAuth, reports.monthly);

// Bahasa Indonesia route
router.get("/laporan/harian", jwtAuth, reports.daily);
router.get("/laporan/bulanan", jwtAuth, reports.monthly);

export default router;
