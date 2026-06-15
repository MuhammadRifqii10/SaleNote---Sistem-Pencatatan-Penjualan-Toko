import "dotenv/config";
import express from "express";
import router from "./routes/api.js";
import errorHandler from "./middleware/errorHandler.js";

// ✅ FIX KRITIS: BigInt tidak bisa di-serialize JSON secara default.
// Patch ini mengubah BigInt menjadi Number agar res.json() tidak error.
BigInt.prototype.toJSON = function () {
  return Number(this);
};

const app = express();
const port = process.env.PORT || 2024;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Sistem Pencatatan Penjualan Toko - API",
    version: "1.0.0",
    endpoints: {
      auth: {
        login: "POST /api/auth"
      },
      products: {
        getAll: "GET /api/products",
        getById: "GET /api/products/:id",
        create: "POST /api/products",
        update: "PUT /api/products/:id",
        delete: "DELETE /api/products/:id"
      },
      customers: {
        getAll: "GET /api/customers",
        getById: "GET /api/customers/:id",
        create: "POST /api/customers",
        update: "PUT /api/customers/:id",
        delete: "DELETE /api/customers/:id"
      },
      sales: {
        getAll: "GET /api/sales",
        getById: "GET /api/sales/:id",
        create: "POST /api/sales"
      },
      reports: {
        daily: "GET /api/laporan/harian?date=YYYY-MM-DD",
        monthly: "GET /api/laporan/bulanan?year=YYYY&month=MM"
      }
    },
    authentication: "All endpoints require JWT token in Authorization header"
  });
});

app.use("/api", router);

app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
