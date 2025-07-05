import express from 'express';
import multer from 'multer';
import Product from '../models/Product';

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Image recognition endpoint
router.post('/recognize-image', upload.single('image'), async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // For now, return a mock response
    // In production, this would use Google Cloud Vision API
    const mockProducts = await Product.find().limit(5);
    
    res.json({
      success: true,
      message: 'Image processed successfully',
      detectedProducts: mockProducts,
      confidence: 0.85
    });
  } catch (error) {
    next(error);
  }
});

// Chat endpoint for AI assistant
router.post('/chat', async (req: any, res: any, next: any) => {
  try {
    const { message, userId, context } = req.body;

    // Mock AI response
    const response = {
      message: `I understand you're asking about: "${message}". Let me help you with that.`,
      suggestions: [
        'Find products in a specific aisle',
        'Get nutrition information',
        'Compare prices',
        'Add items to shopping list'
      ],
      confidence: 0.9
    };

    res.json({
      success: true,
      response
    });
  } catch (error) {
    next(error);
  }
});

// Get product recommendations
router.get('/recommendations/:userId', async (req: any, res: any, next: any) => {
  try {
    const { userId } = req.params;
    const { category, limit = 5 } = req.query;

    let query = {};
    if (category) {
      query = { category };
    }

    const recommendations = await Product.find(query)
      .sort({ rating: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    next(error);
  }
});

export default router; 