import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductRecommendations from './ProductRecommendations';
import ShoppingList from './ShoppingList';
import CameraScanner from './CameraScanner';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Camera, Star, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShoppingApp = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');

  const handleAddProduct = (product: Product | ScannedProduct) => {
    setShoppingItems((prev) => {
      if (prev.some(item => item.name.toLowerCase() === product.name.toLowerCase())) {
        return prev;
      }

      const newItem: ShoppingItem = {
        id: Date.now(),
        name: product.name,
        found: false,
        aisle: product.aisle || 'TBD',
        price: product.price,
        category: 'category' in product ? product.category : 'scanned',
        inStock: product.inStock !== false,
        imageUrl: 'imageUrl' in product ? product.imageUrl : undefined,
      };
      return [...prev, newItem];
    });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
        activationMode="automatic" // Important for proper tab switching
      >
        <TabsList className="grid w-full grid-cols-3 bg-background">
          <TabsTrigger 
            value="scanner" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary/10"
          >
            <Camera className="w-4 h-4" />
            <span>Scanner</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="flex items-center space-x-2 data-[state=active]:bg-primary/10"
          >
            <Star className="w-4 h-4" />
            <span>Recommend</span>
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="flex items-center space-x-2 data-[state=active]:bg-primary/10"
          >
            <List className="w-4 h-4" />
            <span>My List</span>
          </TabsTrigger>
        </TabsList>

        {/* Scanner Tab */}
        <TabsContent value="scanner" className="mt-4">
          <Card className="p-4 min-h-[500px]">
            <CameraScanner onProductScanned={(product) => {
              setScannedProduct(product);
              handleAddProduct(product);
              setActiveTab('list'); // Switch to list after scan
            }} />
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-4">
          <Card className="p-4 min-h-[500px]">
            <ProductRecommendations 
              onAddToList={handleAddProduct}
              shoppingListItems={shoppingItems}
            />
          </Card>
        </TabsContent>

        {/* My List Tab */}
        <TabsContent value="list" className="mt-4">
          <Card className="p-4 min-h-[500px]">
            {shoppingItems.length > 0 ? (
              <ShoppingList 
                items={shoppingItems}
                onUpdateItems={setShoppingItems}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your list is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Scan items or browse recommendations to add products
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setActiveTab('scanner')}>
                    <Camera className="w-4 h-4 mr-2" />
                    Scan Items
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('recommendations')}>
                    <Star className="w-4 h-4 mr-2" />
                    View Recommendations
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add these type definitions if not already in your types file
type ShoppingItem = {
  id: number;
  name: string;
  found: boolean;
  aisle: string;
  price: number;
  category?: string;
  inStock?: boolean;
  imageUrl?: string;
};

type ScannedProduct = {
  id: string;
  name: string;
  price: number;
  aisle: string;
  inStock: boolean;
  imageUrl: string;
  // ... other scanner-specific properties
};

type Product = {
  id: number;
  name: string;
  price: number;
  aisle: string;
  category: string;
  // ... other recommendation-specific properties
};

export default ShoppingApp;
