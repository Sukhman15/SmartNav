import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductRecommendations, { Product } from './ProductRecommendations';
import ShoppingList, { ShoppingItem } from './ShoppingList';
import CameraScanner, { ScannedProduct } from './CameraScanner';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Camera, Star } from 'lucide-react';

const ShoppingApp: React.FC = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');

  const handleAddProduct = (product: Product | ScannedProduct) => {
    setShoppingItems((prev) => {
      // Avoid duplicates by name (case insensitive)
      if (prev.some(item => item.name.toLowerCase() === product.name.toLowerCase())) {
        return prev;
      }

      const newItem: ShoppingItem = {
        id: Date.now(), // Generate new ID to avoid conflicts
        name: product.name,
        found: false,
        aisle: product.aisle || 'TBD',
        price: product.price,
        category: 'category' in product ? product.category : 'scanned',
        inStock: product.inStock !== false,
        imageUrl: 'imageUrl' in product ? product.imageUrl : undefined,
        nutritionScore: 'nutritionScore' in product ? product.nutritionScore : undefined
      };
      return [...prev, newItem];
    });
  };

  const handleScannedProduct = (product: ScannedProduct) => {
    setScannedProduct(product);
    setActiveTab('recommendations');
    handleAddProduct(product);
  };

  const recommendedPairings = scannedProduct?.recommendedPairings?.map(pairing => ({
    id: pairing.name.toLowerCase().replace(/\s+/g, '-'),
    name: pairing.name,
    price: 0, // You would add actual price lookup
    rating: 0,
    reviews: 0,
    aisle: 'Varies',
    category: 'pairing',
    reason: pairing.reason,
    inStock: true
  })) || [];

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner" className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Scanner</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Shopping List</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <Card className="p-4">
            <CameraScanner 
              onProductScanned={handleScannedProduct}
            />
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <ProductRecommendations 
                onAddToList={handleAddProduct}
                shoppingListItems={shoppingItems}
              />
            </Card>
            {scannedProduct && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Recommended Pairings</h3>
                <div className="space-y-3">
                  {recommendedPairings.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.reason}</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleAddProduct(item)}
                        disabled={shoppingItems.some(i => i.name === item.name)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="p-4">
            <ShoppingList 
              items={shoppingItems} 
              onUpdateItems={setShoppingItems}
              scannedProduct={scannedProduct}
              recommendedPairings={recommendedPairings}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShoppingApp;
