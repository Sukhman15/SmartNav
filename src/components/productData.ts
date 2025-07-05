// productData.ts
export interface ScannedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  aisle: string;
  nutritionScore: string;
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  ingredients: string[];
  allergens: string[];
  alternatives: Array<{
    name: string;
    price: number;
    savings: number;
    rating: number;
    nutritionScore: string;
  }>;
  recommendedPairings: Array<{
    name: string;
    reason: string;
  }>;
  inStock: boolean;
  imageUrl: string;
  category: string;
  tags: string[];
  description: string;
}

export const productDatabase: ScannedProduct[] = [
  // Fruits & Vegetables
  {
    id: 'prod-001',
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
      { name: 'Organic Honeycrisp Apples', price: 3.99, savings: -1.00, rating: 4.8, nutritionScore: 'A' },
      { name: 'Conventional Fuji Apples', price: 1.99, savings: 1.00, rating: 4.5, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Peanut Butter', reason: 'Classic protein pairing' },
      { name: 'Cheddar Cheese', reason: 'Sweet and savory combination' },
      { name: 'Caramel Dip', reason: 'Decadent dessert option' },
      { name: 'Oatmeal', reason: 'Adds natural sweetness to breakfast' }
    ],
    inStock: true,
    imageUrl: 'https://www.fruitsmith.com/cdn/shop/products/Fuji_Apples_1024x1024.jpg',
    category: 'Fruits',
    tags: ['organic', 'fruit', 'apple', 'fuji', 'healthy', 'snack'],
    description: 'Sweet and crisp organic Fuji apples, perfect for snacking or baking.'
  },
  {
    id: 'prod-002',
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
      { name: 'Organic Bananas', price: 1.99, savings: -0.50, rating: 4.6, nutritionScore: 'A' },
      { name: 'Plantains', price: 2.49, savings: -1.00, rating: 4.3, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Peanut Butter', reason: 'Classic protein and potassium combo' },
      { name: 'Honey', reason: 'Natural sweetener for smoothies' },
      { name: 'Oatmeal', reason: 'Perfect breakfast addition' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: 'Fruits',
    tags: ['fruit', 'banana', 'potassium', 'energy', 'snack'],
    description: 'Fresh yellow bananas, rich in potassium and perfect for energy.'
  },
  {
    id: 'prod-003',
    name: 'Organic Strawberries',
    price: 4.99,
    rating: 4.6,
    reviews: 189,
    aisle: 'A2',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 32,
      protein: 1,
      carbs: 8,
      fat: 0,
      fiber: 2,
      sugar: 5,
      sodium: 1
    },
    ingredients: ['Organic strawberries'],
    allergens: [],
    alternatives: [
      { name: 'Conventional Strawberries', price: 3.99, savings: 1.00, rating: 4.4, nutritionScore: 'A' },
      { name: 'Frozen Strawberries', price: 2.99, savings: 2.00, rating: 4.2, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Whipped Cream', reason: 'Classic dessert pairing' },
      { name: 'Greek Yogurt', reason: 'Protein-rich breakfast option' },
      { name: 'Chocolate', reason: 'Decadent dessert combination' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6',
    category: 'Fruits',
    tags: ['organic', 'fruit', 'strawberry', 'antioxidants', 'vitamin c'],
    description: 'Sweet organic strawberries packed with antioxidants and vitamin C.'
  },
  {
    id: 'prod-004',
    name: 'Fresh Spinach',
    price: 2.49,
    rating: 4.3,
    reviews: 156,
    aisle: 'A3',
    nutritionScore: 'A+',
    nutritionFacts: {
      calories: 23,
      protein: 3,
      carbs: 4,
      fat: 0,
      fiber: 2,
      sugar: 1,
      sodium: 79
    },
    ingredients: ['Fresh spinach'],
    allergens: [],
    alternatives: [
      { name: 'Organic Spinach', price: 3.49, savings: -1.00, rating: 4.5, nutritionScore: 'A+' },
      { name: 'Baby Spinach', price: 2.99, savings: -0.50, rating: 4.4, nutritionScore: 'A+' },
      { name: 'Kale', price: 2.99, savings: -0.50, rating: 4.2, nutritionScore: 'A+' }
    ],
    recommendedPairings: [
      { name: 'Eggs', reason: 'Iron absorption enhancement' },
      { name: 'Olive Oil', reason: 'Fat-soluble vitamin absorption' },
      { name: 'Lemon', reason: 'Vitamin C for iron absorption' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    category: 'Vegetables',
    tags: ['vegetable', 'spinach', 'iron', 'vitamins', 'healthy', 'greens'],
    description: 'Fresh spinach leaves rich in iron, vitamins, and minerals.'
  },
  {
    id: 'prod-005',
    name: 'Organic Carrots',
    price: 1.99,
    rating: 4.4,
    reviews: 203,
    aisle: 'A3',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 41,
      protein: 1,
      carbs: 10,
      fat: 0,
      fiber: 3,
      sugar: 5,
      sodium: 69
    },
    ingredients: ['Organic carrots'],
    allergens: [],
    alternatives: [
      { name: 'Conventional Carrots', price: 1.49, savings: 0.50, rating: 4.2, nutritionScore: 'A' },
      { name: 'Baby Carrots', price: 2.49, savings: -0.50, rating: 4.3, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Hummus', reason: 'Classic healthy snack' },
      { name: 'Ranch Dip', reason: 'Popular party snack' },
      { name: 'Peanut Butter', reason: 'Sweet and savory combo' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1447175008436-170170753a5d',
    category: 'Vegetables',
    tags: ['organic', 'vegetable', 'carrot', 'beta carotene', 'vitamin a'],
    description: 'Sweet organic carrots rich in beta carotene and vitamin A.'
  },

  // Dairy & Alternatives
  {
    id: 'prod-006',
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
      { name: 'Fage Total 0%', price: 5.29, savings: -0.30, rating: 4.6, nutritionScore: 'A' },
      { name: 'Siggi\'s Icelandic Skyr', price: 5.99, savings: -1.00, rating: 4.4, nutritionScore: 'A' },
      { name: 'Store Brand Greek Yogurt', price: 3.99, savings: 1.00, rating: 4.0, nutritionScore: 'B+' }
    ],
    recommendedPairings: [
      { name: 'Fresh Berries', reason: 'Natural sweetness and antioxidants' },
      { name: 'Granola', reason: 'Adds crunch and fiber' },
      { name: 'Honey', reason: 'Natural sweetener with antimicrobial properties' }
    ],
    inStock: true,
    imageUrl: 'https://m.media-amazon.com/images/I/71YHjVXyR0L._SL1500_.jpg',
    category: 'Dairy',
    tags: ['dairy', 'yogurt', 'greek', 'protein', 'probiotics', 'plain'],
    description: 'Creamy Greek yogurt with high protein content and live cultures.'
  },
  {
    id: 'prod-007',
    name: 'Almond Milk Unsweetened',
    price: 3.99,
    rating: 4.3,
    reviews: 278,
    aisle: 'D2',
    nutritionScore: 'A-',
    nutritionFacts: {
      calories: 30,
      protein: 1,
      carbs: 1,
      fat: 2.5,
      fiber: 1,
      sugar: 0,
      sodium: 150
    },
    ingredients: [
      'Almond milk (filtered water, almonds)',
      'Calcium carbonate',
      'Vitamin E acetate',
      'Vitamin D2'
    ],
    allergens: ['Tree nuts'],
    alternatives: [
      { name: 'Oat Milk', price: 4.49, savings: -0.50, rating: 4.4, nutritionScore: 'A-' },
      { name: 'Soy Milk', price: 3.49, savings: 0.50, rating: 4.2, nutritionScore: 'A' },
      { name: 'Coconut Milk', price: 4.99, savings: -1.00, rating: 4.1, nutritionScore: 'B+' }
    ],
    recommendedPairings: [
      { name: 'Coffee', reason: 'Creamy dairy-free coffee addition' },
      { name: 'Cereal', reason: 'Nutty flavor for breakfast' },
      { name: 'Smoothies', reason: 'Smooth texture for blending' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    category: 'Dairy Alternatives',
    tags: ['dairy-free', 'almond', 'milk', 'unsweetened', 'vegan', 'plant-based'],
    description: 'Smooth and creamy unsweetened almond milk, perfect for dairy-free diets.'
  },
  {
    id: 'prod-008',
    name: 'Organic Cheddar Cheese',
    price: 5.99,
    rating: 4.6,
    reviews: 189,
    aisle: 'D3',
    nutritionScore: 'B+',
    nutritionFacts: {
      calories: 110,
      protein: 7,
      carbs: 1,
      fat: 9,
      fiber: 0,
      sugar: 0,
      sodium: 180
    },
    ingredients: [
      'Organic cultured pasteurized milk',
      'Salt',
      'Enzymes',
      'Annatto (for color)'
    ],
    allergens: ['Milk'],
    alternatives: [
      { name: 'Conventional Cheddar', price: 4.99, savings: 1.00, rating: 4.4, nutritionScore: 'B+' },
      { name: 'Sharp Cheddar', price: 6.49, savings: -0.50, rating: 4.5, nutritionScore: 'B+' },
      { name: 'Vegan Cheddar', price: 7.99, savings: -2.00, rating: 4.0, nutritionScore: 'B' }
    ],
    recommendedPairings: [
      { name: 'Crackers', reason: 'Classic cheese and crackers' },
      { name: 'Apples', reason: 'Sweet and savory combination' },
      { name: 'Wine', reason: 'Perfect wine pairing' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d',
    category: 'Dairy',
    tags: ['organic', 'dairy', 'cheese', 'cheddar', 'protein', 'calcium'],
    description: 'Rich and flavorful organic cheddar cheese, perfect for sandwiches and snacking.'
  },

  // Grains & Bread
  {
    id: 'prod-009',
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
      { name: 'Dave\'s Killer Bread Organic 21 Whole Grains', price: 4.99, savings: -1.50, rating: 4.7, nutritionScore: 'A-' },
      { name: 'Nature\'s Own 100% Whole Wheat', price: 3.29, savings: 0.20, rating: 4.2, nutritionScore: 'B+' },
      { name: 'Sara Lee 100% Whole Wheat', price: 3.49, savings: 0.00, rating: 4.0, nutritionScore: 'B' }
    ],
    recommendedPairings: [
      { name: 'Organic Peanut Butter', reason: 'High in protein, complements whole grains' },
      { name: 'Local Honey', reason: 'Natural sweetener that pairs well with whole wheat' },
      { name: 'Avocado', reason: 'Healthy fats that balance the carbohydrates' }
    ],
    inStock: true,
    imageUrl: 'https://th.bing.com/th/id/R.e0470bc2759cdc213872b349c0a2aaf6?rik=vTCiZwMbd4fXDg&riu=http%3a%2f%2fi5.walmartimages.ca%2fimages%2fLarge%2fd_6%2f75g%2f30539062_GV_WholeWheatBread_675g.jpg&ehk=LGtY%2f7QZEsGVKJ%2fUSGwVC%2fY3MPsz0pKqVT8E0qOmAgU%3d&risl=&pid=ImgRaw&r=0',
    category: 'Grains',
    tags: ['bread', 'loaf', 'bakery', 'sandwich', 'toast', 'food', 'whole wheat', 'grain', 'baked', 'organic', 'fiber', 'healthy'],
    description: 'Nutritious organic whole wheat bread with fiber and essential nutrients.'
  },
  {
    id: 'prod-010',
    name: 'Quaker Old Fashioned Oats',
    price: 4.49,
    rating: 4.7,
    reviews: 456,
    aisle: 'B2',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      fiber: 4,
      sugar: 1,
      sodium: 0
    },
    ingredients: [
      '100% whole grain rolled oats'
    ],
    allergens: [],
    alternatives: [
      { name: 'Steel Cut Oats', price: 5.99, savings: -1.50, rating: 4.8, nutritionScore: 'A' },
      { name: 'Instant Oats', price: 3.99, savings: 0.50, rating: 4.3, nutritionScore: 'A-' },
      { name: 'Organic Oats', price: 5.49, savings: -1.00, rating: 4.6, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Bananas', reason: 'Classic breakfast combination' },
      { name: 'Honey', reason: 'Natural sweetener' },
      { name: 'Cinnamon', reason: 'Warm spice flavor' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907',
    category: 'Grains',
    tags: ['oats', 'oatmeal', 'whole grain', 'fiber', 'breakfast', 'healthy'],
    description: 'Heart-healthy whole grain oats perfect for breakfast and baking.'
  },

  // Proteins
  {
    id: 'prod-011',
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
      { name: 'Conventional Chicken Breast', price: 6.99, savings: 2.00, rating: 4.3, nutritionScore: 'A' },
      { name: 'Turkey Breast', price: 7.99, savings: 1.00, rating: 4.4, nutritionScore: 'A' },
      { name: 'Salmon Fillet', price: 12.99, savings: -4.00, rating: 4.6, nutritionScore: 'A+' }
    ],
    recommendedPairings: [
      { name: 'Brown Rice', reason: 'Complete protein and complex carbs' },
      { name: 'Broccoli', reason: 'Lean protein with vegetables' },
      { name: 'Sweet Potato', reason: 'Balanced meal with complex carbs' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    category: 'Proteins',
    tags: ['organic', 'chicken', 'breast', 'protein', 'lean', 'healthy'],
    description: 'Lean organic chicken breast, high in protein and low in fat.'
  },
  {
    id: 'prod-012',
    name: 'Wild Alaskan Salmon',
    price: 14.99,
    rating: 4.8,
    reviews: 167,
    aisle: 'P2',
    nutritionScore: 'A+',
    nutritionFacts: {
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59
    },
    ingredients: ['Wild Alaskan salmon'],
    allergens: ['Fish'],
    alternatives: [
      { name: 'Farmed Salmon', price: 9.99, savings: 5.00, rating: 4.2, nutritionScore: 'A' },
      { name: 'Cod Fillet', price: 11.99, savings: 3.00, rating: 4.4, nutritionScore: 'A' },
      { name: 'Tilapia', price: 7.99, savings: 7.00, rating: 4.0, nutritionScore: 'A-' }
    ],
    recommendedPairings: [
      { name: 'Lemon', reason: 'Brightens the rich fish flavor' },
      { name: 'Asparagus', reason: 'Classic seafood pairing' },
      { name: 'Quinoa', reason: 'Complete protein combination' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    category: 'Proteins',
    tags: ['salmon', 'wild', 'alaskan', 'omega-3', 'protein', 'healthy'],
    description: 'Rich and flavorful wild Alaskan salmon, high in omega-3 fatty acids.'
  },

  // Snacks & Nuts
  {
    id: 'prod-013',
    name: 'Organic Almonds',
    price: 6.99,
    rating: 4.6,
    reviews: 312,
    aisle: 'S1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 160,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3,
      sugar: 1,
      sodium: 0
    },
    ingredients: ['Organic almonds'],
    allergens: ['Tree nuts'],
    alternatives: [
      { name: 'Conventional Almonds', price: 5.99, savings: 1.00, rating: 4.4, nutritionScore: 'A' },
      { name: 'Cashews', price: 7.99, savings: -1.00, rating: 4.5, nutritionScore: 'A' },
      { name: 'Walnuts', price: 6.49, savings: 0.50, rating: 4.3, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Dark Chocolate', reason: 'Antioxidant-rich combination' },
      { name: 'Dried Cranberries', reason: 'Sweet and nutty trail mix' },
      { name: 'Greek Yogurt', reason: 'Protein and healthy fats' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    category: 'Snacks',
    tags: ['organic', 'almonds', 'nuts', 'protein', 'healthy fats', 'snack'],
    description: 'Crunchy organic almonds packed with protein and healthy fats.'
  },
  {
    id: 'prod-014',
    name: 'Organic Peanut Butter',
    price: 5.49,
    rating: 4.4,
    reviews: 289,
    aisle: 'S2',
    nutritionScore: 'A-',
    nutritionFacts: {
      calories: 190,
      protein: 7,
      carbs: 7,
      fat: 16,
      fiber: 2,
      sugar: 2,
      sodium: 140
    },
    ingredients: [
      'Organic roasted peanuts',
      'Sea salt'
    ],
    allergens: ['Peanuts'],
    alternatives: [
      { name: 'Conventional Peanut Butter', price: 3.99, savings: 1.50, rating: 4.2, nutritionScore: 'A-' },
      { name: 'Almond Butter', price: 7.99, savings: -2.50, rating: 4.5, nutritionScore: 'A' },
      { name: 'Cashew Butter', price: 8.99, savings: -3.50, rating: 4.3, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Banana', reason: 'Classic protein and potassium combo' },
      { name: 'Whole Wheat Bread', reason: 'Nutritious sandwich option' },
      { name: 'Celery', reason: 'Crunchy healthy snack' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
    category: 'Snacks',
    tags: ['organic', 'peanut butter', 'protein', 'healthy fats', 'spread'],
    description: 'Creamy organic peanut butter made with just peanuts and sea salt.'
  },

  // Beverages
  {
    id: 'prod-015',
    name: 'Green Tea Bags',
    price: 3.99,
    rating: 4.3,
    reviews: 178,
    aisle: 'B3',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['Green tea leaves'],
    allergens: [],
    alternatives: [
      { name: 'Black Tea Bags', price: 3.49, savings: 0.50, rating: 4.2, nutritionScore: 'A-' },
      { name: 'Herbal Tea Bags', price: 4.49, savings: -0.50, rating: 4.4, nutritionScore: 'A' },
      { name: 'Organic Green Tea', price: 5.99, savings: -2.00, rating: 4.5, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Honey', reason: 'Natural sweetener for tea' },
      { name: 'Lemon', reason: 'Vitamin C boost' },
      { name: 'Ginger', reason: 'Digestive health benefits' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    category: 'Beverages',
    tags: ['tea', 'green tea', 'antioxidants', 'caffeine', 'healthy'],
    description: 'Antioxidant-rich green tea bags for a healthy beverage option.'
  },

  // Condiments & Sauces
  {
    id: 'prod-016',
    name: 'Extra Virgin Olive Oil',
    price: 8.99,
    rating: 4.7,
    reviews: 234,
    aisle: 'C1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 120,
      protein: 0,
      carbs: 0,
      fat: 14,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['Extra virgin olive oil'],
    allergens: [],
    alternatives: [
      { name: 'Regular Olive Oil', price: 6.99, savings: 2.00, rating: 4.3, nutritionScore: 'A-' },
      { name: 'Avocado Oil', price: 12.99, savings: -4.00, rating: 4.6, nutritionScore: 'A' },
      { name: 'Coconut Oil', price: 9.99, savings: -1.00, rating: 4.2, nutritionScore: 'B+' }
    ],
    recommendedPairings: [
      { name: 'Balsamic Vinegar', reason: 'Classic salad dressing' },
      { name: 'Garlic', reason: 'Flavorful cooking oil' },
      { name: 'Bread', reason: 'Traditional dipping oil' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
    category: 'Condiments',
    tags: ['olive oil', 'extra virgin', 'healthy fats', 'cooking', 'mediterranean'],
    description: 'Premium extra virgin olive oil with rich flavor and health benefits.'
  },

  // Frozen Foods
  {
    id: 'prod-017',
    name: 'Frozen Mixed Berries',
    price: 4.99,
    rating: 4.4,
    reviews: 156,
    aisle: 'F1',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 70,
      protein: 1,
      carbs: 18,
      fat: 0,
      fiber: 4,
      sugar: 12,
      sodium: 0
    },
    ingredients: ['Strawberries', 'Blueberries', 'Raspberries', 'Blackberries'],
    allergens: [],
    alternatives: [
      { name: 'Fresh Mixed Berries', price: 6.99, savings: -2.00, rating: 4.6, nutritionScore: 'A' },
      { name: 'Frozen Blueberries Only', price: 3.99, savings: 1.00, rating: 4.3, nutritionScore: 'A' },
      { name: 'Frozen Strawberries Only', price: 3.99, savings: 1.00, rating: 4.2, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Greek Yogurt', reason: 'Protein-rich smoothie base' },
      { name: 'Oatmeal', reason: 'Nutritious breakfast addition' },
      { name: 'Smoothies', reason: 'Frozen fruit for cold drinks' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e',
    category: 'Frozen Foods',
    tags: ['frozen', 'berries', 'mixed', 'antioxidants', 'smoothies'],
    description: 'Convenient frozen mixed berries perfect for smoothies and baking.'
  },

  // Canned Goods
  {
    id: 'prod-018',
    name: 'Chickpeas (Garbanzo Beans)',
    price: 1.49,
    rating: 4.5,
    reviews: 203,
    aisle: 'C2',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 120,
      protein: 6,
      carbs: 22,
      fat: 2,
      fiber: 5,
      sugar: 4,
      sodium: 320
    },
    ingredients: ['Chickpeas', 'Water', 'Salt'],
    allergens: [],
    alternatives: [
      { name: 'Organic Chickpeas', price: 1.99, savings: -0.50, rating: 4.6, nutritionScore: 'A' },
      { name: 'Black Beans', price: 1.49, savings: 0.00, rating: 4.4, nutritionScore: 'A' },
      { name: 'Kidney Beans', price: 1.49, savings: 0.00, rating: 4.3, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Tahini', reason: 'Classic hummus ingredients' },
      { name: 'Lemon', reason: 'Bright flavor for salads' },
      { name: 'Olive Oil', reason: 'Mediterranean salad dressing' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b',
    category: 'Canned Goods',
    tags: ['chickpeas', 'garbanzo beans', 'protein', 'fiber', 'vegan'],
    description: 'Versatile chickpeas rich in protein and fiber, perfect for salads and hummus.'
  },

  // Baking
  {
    id: 'prod-019',
    name: 'All-Purpose Flour',
    price: 2.99,
    rating: 4.2,
    reviews: 145,
    aisle: 'B4',
    nutritionScore: 'B',
    nutritionFacts: {
      calories: 110,
      protein: 3,
      carbs: 23,
      fat: 0,
      fiber: 1,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['Wheat flour'],
    allergens: ['Wheat'],
    alternatives: [
      { name: 'Whole Wheat Flour', price: 3.99, savings: -1.00, rating: 4.4, nutritionScore: 'A-' },
      { name: 'Almond Flour', price: 8.99, savings: -6.00, rating: 4.3, nutritionScore: 'A' },
      { name: 'Coconut Flour', price: 6.99, savings: -4.00, rating: 4.1, nutritionScore: 'A-' }
    ],
    recommendedPairings: [
      { name: 'Eggs', reason: 'Essential baking ingredient' },
      { name: 'Butter', reason: 'Classic baking fat' },
      { name: 'Sugar', reason: 'Sweetening for baked goods' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
    category: 'Baking',
    tags: ['flour', 'all-purpose', 'baking', 'wheat', 'gluten'],
    description: 'Versatile all-purpose flour for all your baking needs.'
  },

  // Spices & Seasonings
  {
    id: 'prod-020',
    name: 'Ground Cinnamon',
    price: 2.49,
    rating: 4.6,
    reviews: 189,
    aisle: 'S3',
    nutritionScore: 'A',
    nutritionFacts: {
      calories: 6,
      protein: 0,
      carbs: 2,
      fat: 0,
      fiber: 1,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['Ground cinnamon'],
    allergens: [],
    alternatives: [
      { name: 'Cinnamon Sticks', price: 3.99, savings: -1.50, rating: 4.5, nutritionScore: 'A' },
      { name: 'Organic Cinnamon', price: 3.49, savings: -1.00, rating: 4.7, nutritionScore: 'A' },
      { name: 'Ceylon Cinnamon', price: 4.99, savings: -2.50, rating: 4.8, nutritionScore: 'A' }
    ],
    recommendedPairings: [
      { name: 'Oatmeal', reason: 'Warm breakfast spice' },
      { name: 'Apples', reason: 'Classic fall flavor combination' },
      { name: 'Honey', reason: 'Sweet and spicy pairing' }
    ],
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    category: 'Spices',
    tags: ['cinnamon', 'spice', 'ground', 'baking', 'warm'],
    description: 'Aromatic ground cinnamon perfect for baking and beverages.'
  }
];
