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
}

export const productDatabase: ScannedProduct[] = [
  {
    id: 'prod-123',
    name: 'Great Value Organic Whole Wheat Bread',
    price: 3.49,
    rating: 4.3,
    reviews: 127,
    aisle: 'B7',
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
      { name: 'Sara Lee 100% Whole Wheat', price: 3.49, savings: 0.00, rating: 4.0, nutritionScore: 'B' },
      { name: 'Pepperidge Farm Whole Grain', price: 4.29, savings: -0.80, rating: 4.2, nutritionScore: 'B+' },
      { name: 'Arnold Whole Grains Bread', price: 4.49, savings: -1.00, rating: 4.3, nutritionScore: 'A-' },
      { name: 'Ezekiel 4:9 Sprouted Whole Grain', price: 5.99, savings: -2.50, rating: 4.6, nutritionScore: 'A' },
      { name: 'Wonder Whole Grain Wheat', price: 3.19, savings: 0.30, rating: 3.8, nutritionScore: 'B-' },
      { name: 'Trader Joe\'s Organic Whole Wheat', price: 3.99, savings: -0.50, rating: 4.1, nutritionScore: 'B+' }
    ],
    recommendedPairings: [
      { name: 'Organic Peanut Butter', reason: 'High in protein, complements whole grains' },
      { name: 'Local Honey', reason: 'Natural sweetener that pairs well with whole wheat' },
      { name: 'Avocado', reason: 'Healthy fats that balance the carbohydrates' },
      { name: 'Almond Butter', reason: 'Nutrient-dense alternative to peanut butter' },
      { name: 'Organic Strawberry Jam', reason: 'Classic sweet pairing for toast' },
      { name: 'Smoked Salmon', reason: 'Premium protein for gourmet sandwiches' },
      { name: 'Fresh Mozzarella', reason: 'Great for caprese-style sandwiches' },
      { name: 'Hummus', reason: 'Vegetarian protein spread with Mediterranean flavors' },
      { name: 'Organic Eggs', reason: 'Perfect for breakfast toast' },
      { name: 'Fresh Spinach', reason: 'Add greens to your sandwiches' }
    ],
    inStock: true,
    imageUrl: 'https://th.bing.com/th/id/R.e0470bc2759cdc213872b349c0a2aaf6?rik=vTCiZwMbd4fXDg&riu=http%3a%2f%2fi5.walmartimages.ca%2fimages%2fLarge%2fd_6%2f75g%2f30539062_GV_WholeWheatBread_675g.jpg&ehk=LGtY%2f7QZEsGVKJ%2fUSGwVC%2fY3MPsz0pKqVT8E0qOmAgU%3d&risl=&pid=ImgRaw&r=0'
  },
  {
    id: 'prod-124',
    name: 'Chobani Greek Yogurt Plain',
    price: 4.99,
    rating: 4.5,
    reviews: 342,
    aisle: 'D3',
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
      { name: 'Store Brand Greek Yogurt', price: 3.99, savings: 1.00, rating: 4.0, nutritionScore: 'B+' },
      { name: 'Oikos Triple Zero', price: 4.79, savings: 0.20, rating: 4.2, nutritionScore: 'A-' },
      { name: 'Stonyfield Organic Greek', price: 5.49, savings: -0.50, rating: 4.3, nutritionScore: 'A-' }
    ],
    recommendedPairings: [
      { name: 'Fresh Berries', reason: 'Natural sweetness and antioxidants' },
      { name: 'Granola', reason: 'Adds crunch and fiber' },
      { name: 'Honey', reason: 'Natural sweetener with antimicrobial properties' },
      { name: 'Chia Seeds', reason: 'Boosts omega-3 and fiber content' },
      { name: 'Almonds', reason: 'Adds healthy fats and protein' }
    ],
    inStock: true,
    imageUrl: 'https://m.media-amazon.com/images/I/71YHjVXyR0L._SL1500_.jpg'
  },
  {
    id: 'prod-125',
    name: 'Organic Fuji Apples',
    price: 2.99,
    rating: 4.7,
    reviews: 215,
    aisle: 'A2',
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
    imageUrl: 'https://www.fruitsmith.com/cdn/shop/products/Fuji_Apples_1024x1024.jpg'
  }
  // Add more products as needed
];
