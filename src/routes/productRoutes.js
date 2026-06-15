import express from 'express';
import { 
  createProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// Daftarkan semua method HTTP untuk CRUD produk
router.post('/products', createProduct);      // Menambah produk
router.get('/products', getAllProducts);       // Melihat semua produk
router.put('/products/:id', updateProduct);    // Mengubah produk
router.delete('/products/:id', deleteProduct); // Menghapus produk

export default router;