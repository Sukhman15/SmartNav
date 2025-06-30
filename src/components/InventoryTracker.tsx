
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Clock, Zap } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  aisle: string;
  stock: number;
  maxStock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  estimatedRestock?: Date;
}

const InventoryTracker: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Organic Apples',
      aisle: 'A3',
      stock: 45,
      maxStock: 100,
      status: 'in-stock',
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
      trend: 'down'
    },
    {
      id: '2',
      name: 'Whole Wheat Bread',
      aisle: 'B7',
      stock: 8,
      maxStock: 50,
      status: 'low-stock',
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
      trend: 'down',
      estimatedRestock: new Date(Date.now() + 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Almond Milk',
      aisle: 'C2',
      stock: 0,
      maxStock: 30,
      status: 'out-of-stock',
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      trend: 'down',
      estimatedRestock: new Date(Date.now() + 4 * 60 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Greek Yogurt',
      aisle: 'C2',
      stock: 25,
      maxStock: 40,
      status: 'in-stock',
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000),
      trend: 'up'
    }
  ];

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate real-time inventory updates
    const interval = setInterval(() => {
      setInventoryItems(prev => prev.map(item => ({
        ...item,
        stock: Math.max(0, item.stock + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        lastUpdated: new Date(),
        status: item.stock === 0 ? 'out-of-stock' : 
               item.stock < item.maxStock * 0.2 ? 'low-stock' : 'in-stock'
      })));
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-700';
      case 'low-stock': return 'bg-yellow-100 text-yellow-700';
      case 'out-of-stock': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <Package className="w-3 h-3" />;
      case 'low-stock': return <AlertTriangle className="w-3 h-3" />;
      case 'out-of-stock': return <AlertTriangle className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-600" />;
      default: return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  const formatRestockTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Soon';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.ceil(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Live Inventory</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-600" />
            <Badge variant="secondary" className="text-xs">
              Real-time
            </Badge>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Last updated: {formatTimeAgo(lastUpdate)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {inventoryItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
            {/* Item Header */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <div className="flex items-center space-x-2">
                {getTrendIcon(item.trend)}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(item.status)}`}
                >
                  {getStatusIcon(item.status)}
                  <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                </Badge>
              </div>
            </div>

            {/* Stock Level */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Stock Level</span>
                <span>{item.stock}/{item.maxStock}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.status === 'out-of-stock' ? 'bg-red-500' :
                    item.status === 'low-stock' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%` }}
                />
              </div>
            </div>

            {/* Item Details */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span>Aisle {item.aisle}</span>
                <span>Updated {formatTimeAgo(item.lastUpdated)}</span>
              </div>
              
              {item.estimatedRestock && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Restock in {formatRestockTime(item.estimatedRestock)}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Summary Stats */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {inventoryItems.filter(item => item.status === 'in-stock').length}
              </div>
              <div className="text-xs text-gray-600">In Stock</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {inventoryItems.filter(item => item.status === 'low-stock').length}
              </div>
              <div className="text-xs text-gray-600">Low Stock</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {inventoryItems.filter(item => item.status === 'out-of-stock').length}
              </div>
              <div className="text-xs text-gray-600">Out of Stock</div>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <Package className="w-4 h-4 mr-2" />
          View Full Inventory
        </Button>
      </CardContent>
    </Card>
  );
};

export default InventoryTracker;
