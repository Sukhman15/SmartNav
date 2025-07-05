import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Percent, Heart, Plus, MapPin, X } from 'lucide-react';

interface Product {
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
}

interface ProductRecommendationsProps {
  onAddToList: (product: Product) => void;
  shoppingListItems: { name: string }[];
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ onAddToList, shoppingListItems }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);

  const recommendations: Product[] = [
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
      reason: 'Based on your health preferences',
      inStock: true
    },
    {
      id: 2,
      name: 'Avocado Oil Spray',
      price: 3.99,
      rating: 4.5,
      reviews: 156,
      aisle: 'B4',
      category: 'cooking',
      reason: 'Frequently bought with organic items',
      inStock: true
    },
    {
      id: 3,
      name: 'Whole Grain Pasta',
      price: 2.49,
      originalPrice: 3.29,
      rating: 4.3,
      reviews: 89,
      aisle: 'B6',
      category: 'pantry',
      discount: 24,
      reason: 'Popular healthy alternative',
      inStock: true
    },
    {
      id: 4,
      name: 'Fresh Blueberries',
      price: 5.99,
      rating: 4.8,
      reviews: 203,
      aisle: 'A3',
      category: 'produce',
      reason: 'Trending superfood this week',
      inStock: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'deals', name: 'Deals', icon: Percent },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'new', name: 'New', icon: Plus }, // Added new button
  ];

  const filteredRecommendations = recommendations.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'deals') return product.discount;
    if (selectedCategory === 'trending') return product.rating >= 4.5;
    if (selectedCategory === 'favorites') return product.reviews > 200;
    return true;
  });

  const handleAddToList = (product: Product) => {
    if (shoppingListItems.some(item => item.name.toLowerCase() === product.name.toLowerCase())) return;
    onAddToList(product);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-orange-500" />
          <span>Recommendations</span>
        </CardTitle>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
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
        {filteredRecommendations.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                variant={product.inStock ? "secondary" : "outline"}
                className={`text-xs ${product.inStock ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
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
                disabled={!product.inStock || shoppingListItems.some(item => item.name.toLowerCase() === product.name.toLowerCase())}
              >
                <Plus className="w-3 h-3 mr-1" />
                {shoppingListItems.some(item => item.name.toLowerCase() === product.name.toLowerCase()) ? 'Added' : 'Add to List'}
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setDetailsProduct(product)}>
                View Details
              </Button>
            </div>
          </div>
        ))}

        {/* Product Details Modal */}
        {detailsProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setDetailsProduct(null)}>
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold mb-2">{detailsProduct.name}</h3>
              <div className="mb-2 text-sm text-gray-600">{detailsProduct.reason}</div>
              <div className="mb-2 flex items-center space-x-2">
                <span className="font-bold text-green-600 text-lg">${detailsProduct.price}</span>
                {detailsProduct.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">${detailsProduct.originalPrice}</span>
                )}
                {detailsProduct.discount && (
                  <Badge variant="destructive" className="text-xs">-{detailsProduct.discount}%</Badge>
                )}
              </div>
              <div className="mb-2 flex items-center space-x-2 text-xs">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{detailsProduct.rating} ({detailsProduct.reviews} reviews)</span>
              </div>
              <div className="mb-2 flex items-center space-x-2 text-xs">
                <MapPin className="w-3 h-3" />
                <span>Aisle {detailsProduct.aisle}</span>
              </div>
              <div className="mb-2">
                <Badge variant={detailsProduct.inStock ? "secondary" : "outline"} className={`text-xs ${detailsProduct.inStock ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>{detailsProduct.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
              </div>
              <Button className="mt-4 w-full" onClick={() => { handleAddToList(detailsProduct); setDetailsProduct(null); }} disabled={!detailsProduct.inStock || shoppingListItems.some(item => item.name.toLowerCase() === detailsProduct.name.toLowerCase())}>
                <Plus className="w-4 h-4 mr-1" />
                {shoppingListItems.some(item => item.name.toLowerCase() === detailsProduct.name.toLowerCase()) ? 'Added' : 'Add to List'}
              </Button>
            </div>
          </div>
        )}

        
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
