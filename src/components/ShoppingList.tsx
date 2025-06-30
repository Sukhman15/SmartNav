import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ShoppingCart,
  Plus,
  MapPin,
  Search,
  Trash2,
  Clock,
  DollarSign,
} from 'lucide-react';

export interface ShoppingItem {
  id: number;
  name: string;
  found: boolean;
  aisle: string;
  price: number;
  category?: string;
  inStock?: boolean;
  alternatives?: string[];
}

interface ShoppingListProps {
  items: ShoppingItem[];
  onUpdateItems: (items: ShoppingItem[]) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onUpdateItems }) => {
  const [newItem, setNewItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const newShoppingItem: ShoppingItem = {
      id: Date.now(),
      name: newItem,
      found: false,
      aisle: 'TBD',
      price: 0,
      category: 'General',
      inStock: true,
    };

    onUpdateItems([...items, newShoppingItem]);
    setNewItem('');
  };

  const handleToggleFound = (id: number) => {
    onUpdateItems(
      items.map((item) =>
        item.id === id ? { ...item, found: !item.found } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    onUpdateItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const foundItems = filteredItems.filter((item) => item.found);
  const pendingItems = filteredItems.filter((item) => !item.found);
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const estimatedTime = Math.ceil(pendingItems.length * 2) + 5; // 2 min per item + 5 min base

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Shopping List</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{estimatedTime} min</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>${totalPrice.toFixed(2)}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{items.length}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{foundItems.length}</div>
              <div className="text-sm text-gray-500">Found</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{pendingItems.length}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Item */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add item to your list..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1"
            />
            <Button onClick={handleAddItem} disabled={!newItem.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your list..."
          className="pl-10"
        />
      </div>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>To Find</span>
              <Badge variant="secondary">{pendingItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={item.found}
                  onCheckedChange={() => handleToggleFound(item.id)}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center space-x-2">
                      {item.price > 0 && (
                        <Badge variant="outline">${item.price.toFixed(2)}</Badge>
                      )}
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.aisle}</span>
                      </Badge>
                    </div>
                  </div>

                  {item.alternatives && item.alternatives.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">
                        Alternatives: {item.alternatives.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Found Items */}
      {foundItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2 text-green-600">
              <span>Found Items</span>
              <Badge variant="secondary">{foundItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {foundItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 border rounded-lg bg-green-50"
              >
                <Checkbox
                  checked={item.found}
                  onCheckedChange={() => handleToggleFound(item.id)}
                />

                <div className="flex-1 opacity-75">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium line-through">{item.name}</h4>
                    <div className="flex items-center space-x-2">
                      {item.price > 0 && (
                        <Badge variant="outline">${item.price.toFixed(2)}</Badge>
                      )}
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.aisle}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No items found' : 'Your list is empty'}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Add items to get started with your shopping'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShoppingList;
