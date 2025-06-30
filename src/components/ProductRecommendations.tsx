
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Percent, Heart, Plus, MapPin } from 'lucide-react';

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

const ProductRecommendations: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    },
    {
      id: 5,
      name: 'Almond Butter',
      price: 7.99,
      originalPrice: 9.99,
      rating: 4.6,
      reviews: 445,
      aisle: 'B5',
      category: 'pantry',
      discount: 20,
      reason: 'Great with whole grain bread',
      inStock: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'deals', name: 'Deals', icon: Percent },
    { id: 'favorites', name: 'Favorites', icon: Heart }
  ];

  const filteredRecommendations = recommendations.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'deals') return product.discount;
    if (selectedCategory === 'trending') return product.rating >= 4.5;
    if (selectedCategory === 'favorites') return product.reviews > 200;
    return true;
  });

  const handleAddToList = (product: Product) => {
    // This would typically integrate with the shopping list
    console.log('Adding to list:', product.name);
  };

  return (
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
                disabled={!product.inStock}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add to List
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                View Details
              </Button>
            </div>
          </div>
        ))}

        {/* Smart Insights */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-sm text-blue-900 mb-2">💡 Smart Insights</h5>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Save $12.50 with current recommendations</p>
            <p>• 3 items complement your dietary preferences</p>
            <p>• Best deals expire in 2 days</p>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <h5 className="font-medium text-sm text-green-900 mb-2">📈 This Week's Trends</h5>
          <div className="text-xs text-green-700 space-y-1">
            <p>• Organic produce sales up 25%</p>
            <p>• Plant-based alternatives trending</p>
            <p>• Meal prep ingredients popular</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
