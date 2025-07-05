import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
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
  barcode?: string;
  brand?: string;
  weight?: string;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  aisle: {
    type: String,
    required: true
  },
  nutritionScore: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    default: 'B'
  },
  nutritionFacts: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 'Peanuts', 'Wheat', 'Soybeans', 'None']
  }],
  alternatives: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    savings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    nutritionScore: { type: String, default: 'B' }
  }],
  recommendedPairings: [{
    name: { type: String, required: true },
    reason: { type: String, required: true }
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Dairy Alternatives', 'Grains', 'Proteins', 'Snacks', 'Beverages', 'Condiments', 'Frozen Foods', 'Canned Goods', 'Baking', 'Spices']
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  brand: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ aisle: 1 });
productSchema.index({ price: 1 });
productSchema.index({ inStock: 1 });

export default mongoose.model<IProduct>('Product', productSchema); 