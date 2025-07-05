import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';

dotenv.config();

const sampleProducts = [
  {
    name: 'Organic Fuji Apples',
    price: 2.99,
    rating: 4.7,
    reviews: 215,
    aisle: 'A1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 95,
      protein: 0,
      carbs: 25,
      fat: 0,
      fiber: 4,
      sugar: 19,
      sodium: 2
    },
    ingredients: ['Organic Fuji apples'],
    allergens: [],
    alternatives: [
      { name: 'Organic Gala Apples', price: 2.89, savings: 0.10, rating: 4.6, nutritionScore: 'A' },
      { name: 'Organic Honeycrisp Apples', price: 3.99, savings: -1.00, rating: 4.8, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Peanut Butter', reason: 'Classic protein pairing' },
      { name: 'Cheddar Cheese', reason: 'Sweet and savory combination' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    category: 'Fruits',
    tags: ['organic', 'fruit', 'apple', 'fuji', 'healthy', 'snack'],
    description: 'Sweet and crisp organic Fuji apples, perfect for snacking or baking.'
  },
  {
    name: 'Fresh Bananas',
    price: 1.49,
    rating: 4.5,
    reviews: 342,
    aisle: 'A1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
      fiber: 3,
      sugar: 14,
      sodium: 1
    },
    ingredients: ['Bananas'],
    allergens: [],
    alternatives: [
      { name: 'Organic Bananas', price: 1.99, savings: -0.50, rating: 4.6, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Peanut Butter', reason: 'Classic protein and potassium combo' },
      { name: 'Honey', reason: 'Natural sweetener for smoothies' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: 'Fruits',
    tags: ['fruit', 'banana', 'potassium', 'energy', 'snack'],
    description: 'Fresh yellow bananas, rich in potassium and perfect for energy.'
  },
  {
    name: 'Great Value Organic Whole Wheat Bread',
    price: 3.49,
    rating: 4.3,
    reviews: 127,
    aisle: 'B1',
    nutritionScore: 'B+',
    nutritionFacts: {
      calories: 110,
      protein: 4,
      carbs: 22,
      fat: 1.5,
      fiber: 3,
      sugar: 3,
      sodium: 180
    },
    ingredients: [
      'Organic whole wheat flour', 
      'Water', 
      'Organic cane sugar', 
      'Yeast', 
      'Sea salt', 
      'Organic sunflower oil'
    ],
    allergens: ['Wheat'],
    alternatives: [
      { name: 'Dave\'s Killer Bread Organic 21 Whole Grains', price: 4.99, savings: -1.50, rating: 4.7, nutritionScore: 'A-' }
    ],
    recommendedPairings: [
      { name: 'Organic Peanut Butter', reason: 'High in protein, complements whole grains' },
      { name: 'Local Honey', reason: 'Natural sweetener that pairs well with whole wheat' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    category: 'Grains',
    tags: ['bread', 'loaf', 'bakery', 'sandwich', 'toast', 'food', 'whole wheat', 'grain', 'baked', 'organic', 'fiber', 'healthy'],
    description: 'Nutritious organic whole wheat bread with fiber and essential nutrients.'
  },
  {
    name: 'Chobani Greek Yogurt Plain',
    price: 4.99,
    rating: 4.5,
    reviews: 342,
    aisle: 'D1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 100,
      protein: 16,
      carbs: 6,
      fat: 0,
      fiber: 0,
      sugar: 4,
      sodium: 65
    },
    ingredients: [
      'Cultured non-fat milk',
      'Live and active cultures'
    ],
    allergens: ['Milk'],
    alternatives: [
      { name: 'Fage Total 0%', price: 5.29, savings: -0.30, rating: 4.6, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Fresh Berries', reason: 'Natural sweetness and antioxidants' },
      { name: 'Granola', reason: 'Adds crunch and fiber' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    category: 'Dairy',
    tags: ['dairy', 'yogurt', 'greek', 'protein', 'probiotics', 'plain'],
    description: 'Creamy Greek yogurt with high protein content and live cultures.'
  },
  {
    name: 'Organic Chicken Breast',
    price: 8.99,
    rating: 4.5,
    reviews: 234,
    aisle: 'P1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74
    },
    ingredients: ['Organic chicken breast'],
    allergens: [],
    alternatives: [
      { name: 'Conventional Chicken Breast', price: 6.99, savings: 2.00, rating: 4.3, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Brown Rice', reason: 'Complete protein and complex carbs' },
      { name: 'Broccoli', reason: 'Lean protein with vegetables' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    category: 'Proteins',
    tags: ['organic', 'chicken', 'breast', 'protein', 'lean', 'healthy'],
    description: 'Lean organic chicken breast, high in protein and low in fat.'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartnav');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 