# Sistem Pencatatan Penjualan Toko

API untuk mengelola penjualan toko dengan fitur CRUD produk, pelanggan, catatan penjualan, dan laporan menggunakan Express.js, Prisma ORM, MySQL, dan JWT authentication.

## Tech Stack

- **Framework:** Express.js (v5.2.1)
- **Database:** MySQL/MariaDB
- **ORM:** Prisma (v7.8.0)
- **Authentication:** JWT (jsonwebtoken v9.0.3)
- **Validation:** Joi (v18.2.1)
- **Password Hashing:** bcrypt (v6.0.0)
- **Runtime:** Node.js (ES Modules)

## Fitur Utama

✅ **Authentication**
- Login dengan email & password
- JWT token generation (1 jam expiry)
- Password hashing dengan bcrypt

✅ **Manajemen Produk**
- CRUD produk dengan validasi (nama_barang, harga, stok)
- Tracking stok otomatis saat penjualan
- Unique SKU per produk

✅ **Manajemen Pelanggan**
- CRUD pelanggan dengan email & phone
- Tracking riwayat penjualan per pelanggan

✅ **Pencatatan Penjualan**
- Create penjualan dengan multiple items
- Automatic stok decrement dalam transaksi
- Calculate total otomatis

✅ **Laporan Penjualan**
- Laporan harian dengan date parameter
- Laporan bulanan dengan year & month parameter
- Summary total amount, count, & detail items

✅ **Error Handling**
- Validation error (Joi schema)
- Prisma error handling
- 404 Not Found
- 500 Internal Server Error
- Structured error responses

## Setup & Instalasi

### 1. Clone/Download Project

```bash
cd "c:\Users\LENOVO\Documents\SEMESTER 4\WEBSERVICE\news portal express - jwt"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder (copy dari `.env.example`):

```bash
cp .env.example .env
```

Sesuaikan dengan konfigurasi MySQL Laragon Anda:
```
DATABASE_URL="mysql://root:@localhost:3306/sistem_penjualan"
JWT_SECRET="rahasia_jwt_anda"
PORT=2024
```

### 4. Database Setup

Pastikan MySQL/MariaDB Laragon sudah berjalan, lalu jalankan Prisma migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed Data Awal

```bash
node src/seeder/seed.js
```

Data yang di-seed:
- User: `superadmin@itn.ac.id` (password: `password123`)
- 2 Produk sampel (Produk A, Produk B)
- 2 Pelanggan sampel (Toko Contoh, Pelanggan B)

### 6. Jalankan Server

```bash
npm start
# atau dengan hot-reload:
npm run dev
```

Server akan berjalan di: `http://localhost:2024`

## Database Schema

### Models

**users** - Pengguna sistem
- id, name, email (unique), password, created_at, updated_at

**products** - Data produk
- id, name, sku (unique), price, stock, created_at, updated_at
- Relations: sale_items

**customers** - Data pelanggan
- id, name, email, phone, created_at, updated_at
- Relations: sales

**sales** - Catatan penjualan
- id, customer_id (nullable), total, created_at, updated_at
- Relations: customer, sale_items

**sale_items** - Detail item per penjualan
- id, sale_id, product_id, quantity, price, subtotal
- Relations: sales, products

Tabel legacy (dari project news portal):
- cache, cache_locks, categories, failed_jobs, job_batches, jobs, migrations, news, password_reset_tokens, personal_access_tokens, sessions

## API Endpoints

### Root (Documentation)

```
GET /
```
Response: API documentation dengan daftar semua endpoint

### Authentication

```
POST /api/auth
Body: { "email": "superadmin@itn.ac.id", "password": "password123" }
Response: { "status": true, "data": { "id": 1, "name": "superadmin", "email": "superadmin@itn.ac.id", "access_token": "JWT_TOKEN" } }
```

### Products

**Get All Products**
```
GET /api/products
Headers: Authorization: Bearer <TOKEN>
```

**Get Product By ID**
```
GET /api/products/:id
Headers: Authorization: Bearer <TOKEN>
```

**Create Product** (Validasi: nama_barang wajib, harga & stok harus angka)
```
POST /api/products
Headers: Authorization: Bearer <TOKEN>
Body: {
  "nama_barang": "Buku Tulis",
  "harga": 5000,
  "stok": 100,
  "sku": "BT001"
}
```

**Update Product**
```
PUT /api/products/:id
Headers: Authorization: Bearer <TOKEN>
Body: {
  "nama_barang": "Buku Tulis A",
  "harga": 6000,
  "stok": 80
}
```

**Delete Product**
```
DELETE /api/products/:id
Headers: Authorization: Bearer <TOKEN>
```

### Customers

**Get All Customers**
```
GET /api/customers
Headers: Authorization: Bearer <TOKEN>
```

**Get Customer By ID**
```
GET /api/customers/:id
Headers: Authorization: Bearer <TOKEN>
```

**Create Customer**
```
POST /api/customers
Headers: Authorization: Bearer <TOKEN>
Body: {
  "name": "Toko Maju",
  "email": "toko@maju.com",
  "phone": "081234567890"
}
```

**Update Customer**
```
PUT /api/customers/:id
Headers: Authorization: Bearer <TOKEN>
Body: { "name": "Toko Maju Jaya", "email": "tokojaya@maju.com" }
```

**Delete Customer**
```
DELETE /api/customers/:id
Headers: Authorization: Bearer <TOKEN>
```

### Sales

**Get All Sales**
```
GET /api/sales
Headers: Authorization: Bearer <TOKEN>
```

**Get Sale By ID**
```
GET /api/sales/:id
Headers: Authorization: Bearer <TOKEN>
```

**Create Sale**
```
POST /api/sales
Headers: Authorization: Bearer <TOKEN>
Body: {
  "customer_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2, "price": 5000 },
    { "product_id": 2, "quantity": 1, "price": 6000 }
  ]
}
```

### Reports

**Daily Sales Report**
```
GET /api/laporan/harian?date=2026-05-29
Headers: Authorization: Bearer <TOKEN>
Response: { "status": true, "date": "2026-05-29", "totalCount": 5, "totalAmount": 45000, "items": [...] }
```

**Monthly Sales Report**
```
GET /api/laporan/bulanan?year=2026&month=5
Headers: Authorization: Bearer <TOKEN>
Response: { "status": true, "year": 2026, "month": 5, "totalCount": 10, "totalAmount": 150000, "items": [...] }
```

## Testing dengan cURL

### 1. Login

```bash
curl -X POST http://localhost:2024/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@itn.ac.id","password":"password123"}'
```

**Response:**
```json
{
  "status": true,
  "message": "Login Success",
  "data": {
    "id": 1,
    "name": "superadmin",
    "email": "superadmin@itn.ac.id",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Simpan token untuk request berikutnya: `TOKEN=<access_token>`

### 2. Create Product

```bash
curl -X POST http://localhost:2024/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"nama_barang":"Pensil 2B","harga":2000,"stok":200,"sku":"P2B001"}'
```

### 3. Create Customer

```bash
curl -X POST http://localhost:2024/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Toko Buku Jaya","email":"bukujaya@example.com","phone":"082123456789"}'
```

### 4. Create Sale

```bash
curl -X POST http://localhost:2024/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "customer_id": 1,
    "items": [
      {"product_id": 1, "quantity": 5, "price": 2000}
    ]
  }'
```

### 5. Get Daily Report

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:2024/api/laporan/harian?date=2026-05-29"
```

## Error Handling

Response error struktur:

### Validation Error (400)
```json
{
  "status": false,
  "errorType": "validation",
  "message": "Validation Error",
  "details": ["\"nama_barang\" is required"]
}
```

### Not Found (404)
```json
{
  "status": false,
  "errorType": "not_found",
  "message": "Resource not found"
}
```

### Database Error (400/409)
```json
{
  "status": false,
  "errorType": "prisma",
  "code": "P2002",
  "message": "Unique constraint failed"
}
```

### Internal Server Error (500)
```json
{
  "status": false,
  "errorType": "internal",
  "message": "Internal Server Error"
}
```

## Project Structure

```
src/
├── index.js                    # Express app setup
├── controllers/
│   ├── authController.js       # Login endpoint
│   ├── productController.js    # CRUD Produk
│   ├── customerController.js   # CRUD Pelanggan
│   ├── saleController.js       # CRUD Penjualan
│   └── reportController.js     # Laporan Harian/Bulanan
├── models/
│   ├── productModel.js         # Prisma queries produk
│   ├── customerModel.js        # Prisma queries pelanggan
│   ├── saleModel.js            # Prisma queries penjualan
│   └── reportModel.js          # Query laporan
├── routes/
│   └── api.js                  # Route definitions
├── middleware/
│   ├── jwtAuth.js              # JWT verification
│   └── errorHandler.js         # Global error handler
├── validators/
│   ├── validator.js            # Joi validation helper
│   ├── productValidator.js     # Product schema
│   ├── customerValidator.js    # Customer schema
│   └── saleValidator.js        # Sale schema
├── database/
│   └── dbConfig.js             # Prisma client
└── seeder/
    └── seed.js                 # Initial data

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Database migrations

.env                            # Environment variables (create from .env.example)
.env.example                    # Environment template
package.json                    # Dependencies
```

## Notes

- Semua endpoint (kecuali `/api/auth`) memerlukan JWT token di header `Authorization: Bearer <TOKEN>`
- Token JWT berlaku 1 jam, setelah itu harus login ulang
- Saat membuat penjualan, stok produk otomatis berkurang dalam transaksi database
- Laporan menggunakan query Prisma dengan date range filtering

## Troubleshooting

**Error: DATABASE_URL is not defined**
→ Buat file `.env` dan pastikan `DATABASE_URL` sudah diisi

**Error: Cannot connect to database**
→ Pastikan MySQL Laragon sudah berjalan dan database `sistem_penjualan` sudah dibuat

**Error: Unique constraint failed**
→ Nilai `sku` atau `email` sudah ada di database, gunakan nilai unik

**Error: JWT token invalid**
→ Pastikan token sudah dikopy dengan benar, atau login ulang untuk dapatkan token baru
