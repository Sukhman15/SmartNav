import mongoose, { Document, Schema } from 'mongoose';

export interface IShoppingList extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    checked: boolean;
    addedAt: Date;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shoppingListSchema = new Schema<IShoppingList>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'My Shopping List'
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    checked: {
      type: Boolean,
      default: false
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
shoppingListSchema.index({ userId: 1, isActive: 1 });
shoppingListSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IShoppingList>('ShoppingList', shoppingListSchema); 