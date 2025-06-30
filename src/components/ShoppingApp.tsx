import React, { useState } from 'react';
import ProductRecommendations, { Product } from './ProductRecommendations';
import ShoppingList, { ShoppingItem } from './ShoppingList';

const ShoppingApp: React.FC = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  const handleAddToList = (product: Product) => {
    setShoppingItems((prev) => {
      // Avoid duplicates
      if (prev.find((item) => item.id === product.id)) return prev;

      const newItem: ShoppingItem = {
        id: product.id,
        name: product.name,
        found: false,
        aisle: product.aisle,
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        alternatives: [], // You can add if you want
      };
      return [...prev, newItem];
    });
  };

  return (
    <div className="flex space-x-8 p-4">
      <div className="w-1/2">
        <ProductRecommendations onAddToList={handleAddToList} />
      </div>
      <div className="w-1/2">
        <ShoppingList items={shoppingItems} onUpdateItems={setShoppingItems} />
      </div>
    </div>
  );
};

export default ShoppingApp;
