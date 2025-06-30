import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Percent, Heart, Plus, MapPin, X, Check } from 'lucide-react';
import { toast } from 'sonner'; // or your preferred toast library

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  aisle: string;
  category: string;
  discount?: number;
  reason: string;
  inStock: boolean;
  image?: string;
  nutrition?: {
    calories: number;
    fat: string;
    carbs: string;
    protein: string;
    [key: string]: any;
  };
}

interface ProductRecommendationsProps {
  onAddToList: (product: Product) => void;
  shoppingListItems: { name: string }[]; // To check if items are already in list
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  onAddToList,
  shoppingListItems 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);

  const recommendations: Product[] = [
    // ... (keep your existing recommendations array) ...
  ];

  const categories = [
    // ... (keep your existing categories array) ...
  ];

  const filteredRecommendations = recommendations.filter((product) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'deals') return product.discount !== undefined;
    if (selectedCategory === 'trending') return product.rating >= 4.5;
    if (selectedCategory === 'favorites') return product.reviews > 200;
    return true;
  });

  const isInShoppingList = (productId: number) => {
    return shoppingListItems.some(item => 
      recommendations.some(rec => rec.id === productId && rec.name === item.name)
    );
  };

  const isRecentlyAdded = (productId: number) => {
    return recentlyAdded.includes(productId);
  };

  const handleAddToList = (product: Product) => {
    if (!product.inStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    onAddToList(product);
    setRecentlyAdded(prev => [...prev, product.id]);
    toast.success(`${product.name} added to your list`);
    
    setTimeout(() => {
      setRecentlyAdded(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-orange-500" />
            <span>Recommendations</span>
          </CardTitle>

          {/* Category Filters */}
          <div className="flex space-x-2 mt-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredRecommendations.map((product) => {
            const isAdded = isInShoppingList(product.id) || isRecentlyAdded(product.id);
            
            return (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Product Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{product.reason}</p>
                  </div>
                  {product.discount && (
                    <Badge variant="destructive" className="text-xs">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-green-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                </div>

                {/* Location and Stock */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>Aisle {product.aisle}</span>
                  </div>

                  <Badge
                    variant={product.inStock ? 'secondary' : 'outline'}
                    className={`text-xs ${
                      product.inStock ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleAddToList(product)}
                    disabled={!product.inStock || isAdded}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-1" />
                        Add to List
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleViewDetails(product)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Nutrition Details Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{selectedProduct.name} - Nutrition Facts</h3>
            {selectedProduct.nutrition ? (
              <ul className="text-sm space-y-1">
                {Object.entries(selectedProduct.nutrition).map(([key, value]) => (
                  <li key={key} className="capitalize">
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No nutrition information available.</p>
            )}
            <div className="mt-4">
              <Button
                onClick={() => {
                  handleAddToList(selectedProduct);
                  closeModal();
                }}
                disabled={!selectedProduct.inStock || isInShoppingList(selectedProduct.id)}
                className="w-full"
              >
                {isInShoppingList(selectedProduct.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Already in List
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Shopping List
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductRecommendations;
