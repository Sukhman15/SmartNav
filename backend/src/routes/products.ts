import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Get all products with pagination and filters
router.get('/', async (req: any, res: any, next: any) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      minPrice, 
      maxPrice,
      inStock,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const query: any = {};

    // Apply filters
    if (category) query.category = category;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Apply search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req: any, res: any, next: any) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// Search products by barcode
router.get('/barcode/:barcode', async (req: any, res: any, next: any) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// Get products by category
router.get('/category/:category', async (req: any, res: any, next: any) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find({ category: req.params.category })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments({ category: req.params.category });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get products by aisle
router.get('/aisle/:aisle', async (req: any, res: any, next: any) => {
  try {
    const products = await Product.find({ aisle: req.params.aisle });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

export default router; 