import express from 'express';
import ShoppingList from '../models/ShoppingList';
import Product from '../models/Product';

const router = express.Router();

// Get user's shopping lists
router.get('/', async (req: any, res: any, next: any) => {
  try {
    const lists = await ShoppingList.find({ userId: req.user._id, isActive: true })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      lists
    });
  } catch (error) {
    next(error);
  }
});

// Create new shopping list
router.post('/', async (req: any, res: any, next: any) => {
  try {
    const { name, items } = req.body;

    const shoppingList = new ShoppingList({
      userId: req.user._id,
      name: name || 'My Shopping List',
      items: items || []
    });

    await shoppingList.save();

    res.status(201).json({
      success: true,
      message: 'Shopping list created successfully',
      list: shoppingList
    });
  } catch (error) {
    next(error);
  }
});

// Add item to shopping list
router.post('/:listId/items', async (req: any, res: any, next: any) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const { listId } = req.params;

    const shoppingList = await ShoppingList.findOne({
      _id: listId,
      userId: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    shoppingList.items.push({
      productId,
      quantity,
      checked: false,
      addedAt: new Date()
    });

    await shoppingList.save();

    res.json({
      success: true,
      message: 'Item added to shopping list',
      list: shoppingList
    });
  } catch (error) {
    next(error);
  }
});

// Update item in shopping list
router.put('/:listId/items/:itemId', async (req: any, res: any, next: any) => {
  try {
    const { quantity, checked } = req.body;
    const { listId, itemId } = req.params;

    const shoppingList = await ShoppingList.findOne({
      _id: listId,
      userId: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    const item = shoppingList.items.find((item: any) => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (quantity !== undefined) item.quantity = quantity;
    if (checked !== undefined) item.checked = checked;

    await shoppingList.save();

    res.json({
      success: true,
      message: 'Item updated successfully',
      list: shoppingList
    });
  } catch (error) {
    next(error);
  }
});

// Remove item from shopping list
router.delete('/:listId/items/:itemId', async (req: any, res: any, next: any) => {
  try {
    const { listId, itemId } = req.params;

    const shoppingList = await ShoppingList.findOne({
      _id: listId,
      userId: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    shoppingList.items = shoppingList.items.filter(
      (item: any) => item._id.toString() !== itemId
    );

    await shoppingList.save();

    res.json({
      success: true,
      message: 'Item removed from shopping list',
      list: shoppingList
    });
  } catch (error) {
    next(error);
  }
});

export default router; 