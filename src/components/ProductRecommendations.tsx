import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Percent, Heart, Plus, MapPin, X, Check, Leaf, Vegan, Wheat, Milk, Egg, Coffee } from 'lucide-react';
import { toast } from 'sonner';

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
  shoppingListItems: { name: string }[];
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  onAddToList,
  shoppingListItems 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);

  const recommendations: Product[] = [
    // Dairy
    {
      id: 1,
      name: 'Organic Greek Yogurt',
      price: 4.99,
      originalPrice: 6.49,
      rating: 4.7,
      reviews: 324,
      aisle: 'C2',
      category: 'dairy',
      discount: 23,
      reason: 'High protein, low sugar option',
      inStock: true,
      nutrition: {
        calories: 120,
        fat: '4g',
        carbs: '8g',
        protein: '12g',
      },
    },
    {
      id: 2,
      name: 'Almond Milk Unsweetened',
      price: 3.49,
      rating: 4.5,
      reviews: 289,
      aisle: 'C3',
      category: 'dairy',
      reason: 'Dairy-free alternative',
      inStock: true,
      nutrition: {
        calories: 30,
        fat: '2.5g',
        carbs: '1g',
        protein: '1g',
      },
    },

    // Produce
    {
      id: 3,
      name: 'Fresh Organic Blueberries',
      price: 5.99,
      rating: 4.8,
      reviews: 203,
      aisle: 'A3',
      category: 'produce',
      reason: 'Antioxidant-rich superfood',
      inStock: true,
      nutrition: {
        calories: 85,
        fat: '0.5g',
        carbs: '21g',
        protein: '1g',
      },
    },
    {
      id: 4,
      name: 'Organic Avocados',
      price: 2.99,
      originalPrice: 3.99,
      rating: 4.6,
      reviews: 412,
      aisle: 'A2',
      category: 'produce',
      discount: 25,
      reason: 'Healthy fats and fiber',
      inStock: true,
      nutrition: {
        calories: 160,
        fat: '15g',
        carbs: '9g',
        protein: '2g',
      },
    },

    // Pantry
    {
      id: 5,
      name: 'Whole Grain Pasta',
      price: 2.49,
      originalPrice: 3.29,
      rating: 4.3,
      reviews: 89,
      aisle: 'B6',
      category: 'pantry',
      discount: 24,
      reason: 'Higher fiber content',
      inStock: true,
      nutrition: {
        calories: 200,
        fat: '1g',
        carbs: '40g',
        protein: '7g',
      },
    },
    {
      id: 6,
      name: 'Organic Quinoa',
      price: 5.99,
      rating: 4.7,
      reviews: 156,
      aisle: 'B5',
      category: 'pantry',
      reason: 'Complete plant protein',
      inStock: true,
      nutrition: {
        calories: 220,
        fat: '3.5g',
        carbs: '39g',
        protein: '8g',
      },
    },

    // Snacks
    {
      id: 7,
      name: 'Dark Chocolate Almonds',
      price: 6.99,
      originalPrice: 8.99,
      rating: 4.9,
      reviews: 532,
      aisle: 'D4',
      category: 'snacks',
      discount: 22,
      reason: 'Healthy indulgent snack',
      inStock: true,
      nutrition: {
        calories: 170,
        fat: '14g',
        carbs: '10g',
        protein: '5g',
      },
    },
    {
      id: 8,
      name: 'Organic Popcorn',
      price: 3.49,
      rating: 4.4,
      reviews: 187,
      aisle: 'D3',
      category: 'snacks',
      reason: 'Whole grain snack option',
      inStock: true,
      nutrition: {
        calories: 130,
        fat: '7g',
        carbs: '15g',
        protein: '2g',
      },
    },

    // Beverages
    {
      id: 9,
      name: 'Cold Brew Coffee',
      price: 4.99,
      rating: 4.6,
      reviews: 278,
      aisle: 'E2',
      category: 'beverages',
      reason: 'Smooth caffeine boost',
      inStock: true,
      nutrition: {
        calories: 5,
        fat: '0g',
        carbs: '0g',
        protein: '0g',
      },
    },
    {
      id: 10,
      name: 'Kombucha Variety Pack',
      price: 12.99,
      originalPrice: 15.99,
      rating: 4.8,
      reviews: 341,
      aisle: 'E3',
      category: 'beverages',
      discount: 19,
      reason: 'Probiotic-rich drink',
      inStock: true,
      nutrition: {
        calories: 60,
        fat: '0g',
        carbs: '14g',
        protein: '0g',
      },
    },

    // Frozen
    {
      id: 11,
      name: 'Organic Frozen Berries',
      price: 8.99,
      rating: 4.7,
      reviews: 215,
      aisle: 'F2',
      category: 'frozen',
      reason: 'Great for smoothies',
      inStock: true,
      nutrition: {
        calories: 70,
        fat: '0g',
        carbs: '18g',
        protein: '1g',
      },
    },
    {
      id: 12,
      name: 'Cauliflower Rice',
      price: 3.99,
      originalPrice: 4.99,
      rating: 4.5,
      reviews: 178,
      aisle: 'F3',
      category: 'frozen',
      discount: 20,
      reason: 'Low-carb alternative',
      inStock: false,
      nutrition: {
        calories: 25,
        fat: '0g',
        carbs: '5g',
        protein: '2g',
      },
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'deals', name: 'Deals', icon: Percent },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'organic', name: 'Organic', icon: Leaf },
    { id: 'vegan', name: 'Vegan', icon: Vegan },
    { id: 'dairy', name: 'Dairy', icon: Milk },
    { id: 'gluten-free', name: 'Gluten Free', icon: Wheat },
    { id: 'produce', name: 'Produce', icon: Egg },
    { id: 'beverages', name: 'Beverages', icon: Coffee },
  ];

  const filteredRecommendations = recommendations.filter((product) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'trending') return product.rating >= 4.5;
    if (selectedCategory === 'deals') return product.discount !== undefined;
    if (selectedCategory === 'favorites') return product.reviews > 200;
    if (selectedCategory === 'organic') return product.name.toLowerCase().includes('organic');
    if (selectedCategory === 'vegan') return !['dairy'].includes(product.category);
    if (selectedCategory === 'dairy') return product.category === 'dairy';
    if (selectedCategory === 'gluten-free') return ['produce', 'beverages'].includes(product.category);
    if (selectedCategory === 'produce') return product.category === 'produce';
    if (selectedCategory === 'beverages') return product.category === 'beverages';
    return true;
  });

  // Rest of the component remains the same...
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

          {/* Category Filters - now with horizontal scrolling */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1 flex-shrink-0"
                >
                  <Icon className="w-3 h-3" />
                  <span>{category.name}</span>
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
                    <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
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
