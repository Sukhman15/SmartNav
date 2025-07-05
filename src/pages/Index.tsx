import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, ShoppingCart, Camera, Zap, Star, Navigation, Wifi } from 'lucide-react';
import StoreMap from '@/components/StoreMap';
import EnhancedAIAssistant from '@/components/EnhancedAIAssistant';
import ShoppingList from '@/components/ShoppingList';
import ProductRecommendations from '@/components/ProductRecommendations';
import CameraScanner from '@/components/CameraScanner';
import InventoryTracker from '@/components/InventoryTracker';
import UserPreferences from '@/components/UserPreferences';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  const [activeTab, setActiveTab] = useState('navigate');
  const [currentLocation, setCurrentLocation] = useState({ x: 50, y: 50, section: 'Entrance' });
  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: 'Organic Apples', found: false, aisle: 'A3', price: 4.99 },
    { id: 2, name: 'Whole Wheat Bread', found: true, aisle: 'B7', price: 3.49 },
    { id: 3, name: 'Almond Milk', found: false, aisle: 'C2', price: 5.99 },
  ]);
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-foreground">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/60 dark:border-gray-800/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Navigation className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SmartNav Pro
                </h1>
                <p className="text-sm text-gray-400 font-medium">AI-Powered Store Assistant</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-sm text-gray-200 bg-gray-800 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Walmart Supercenter - Main St</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 shadow-lg rounded-2xl p-1">
            <TabsTrigger 
              value="navigate" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 dark:data-[state=active]:from-blue-800 dark:data-[state=active]:to-purple-900 data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Navigate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 dark:data-[state=active]:from-green-800 dark:data-[state=active]:to-emerald-900 data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">My List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scan" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 dark:data-[state=active]:from-orange-900 dark:data-[state=active]:to-red-900 data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Scan</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assistant" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 dark:data-[state=active]:from-purple-900 dark:data-[state=active]:to-pink-900 data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">AI Help</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 dark:data-[state=active]:from-indigo-900 dark:data-[state=active]:to-purple-900 data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigate" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StoreMap 
                  shoppingList={shoppingList}
                />
              </div>
              <div className="space-y-6">
                <InventoryTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ShoppingList 
                  items={shoppingList}
                  onUpdateItems={setShoppingList}
                  scannedProduct={null}
                  recommendedPairings={[]}
                />
              </div>
              <div>
                <ProductRecommendations 
                  onAddToList={(product) => setShoppingList(prev => prev.some(item => item.name.toLowerCase() === product.name.toLowerCase()) ? prev : [...prev, { ...product, found: false }])}
                  shoppingListItems={shoppingList}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scan">
            <CameraScanner />
          </TabsContent>

          <TabsContent value="assistant">
            <div className="flex justify-center items-center min-h-[600px]"> {/* Center the assistant */}
              <EnhancedAIAssistant />
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <UserPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
