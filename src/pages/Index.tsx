
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, ShoppingCart, Camera, Mic, Navigation, Star, Clock, Zap } from 'lucide-react';
import StoreMap from '@/components/StoreMap';
import AIAssistant from '@/components/AIAssistant';
import ShoppingList from '@/components/ShoppingList';
import ProductRecommendations from '@/components/ProductRecommendations';
import CameraScanner from '@/components/CameraScanner';
import VoiceInterface from '@/components/VoiceInterface';
import InventoryTracker from '@/components/InventoryTracker';
import UserPreferences from '@/components/UserPreferences';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartNav</h1>
                <p className="text-sm text-gray-500">AI Store Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Walmart Supercenter - Main St</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="navigate" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Navigate</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">My List</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">AI Help</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StoreMap 
                  currentLocation={currentLocation}
                  shoppingList={shoppingList}
                  onLocationUpdate={setCurrentLocation}
                />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>Quick Navigation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Find Restrooms
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Checkout Lanes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Customer Service
                    </Button>
                  </CardContent>
                </Card>
                
                <InventoryTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ShoppingList 
                  items={shoppingList}
                  onUpdateItems={setShoppingList}
                />
              </div>
              <div>
                <ProductRecommendations />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scan">
            <CameraScanner />
          </TabsContent>

          <TabsContent value="assistant">
            <AIAssistant />
          </TabsContent>

          <TabsContent value="profile">
            <UserPreferences />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Voice Interface */}
      <VoiceInterface 
        isActive={isListening}
        onToggle={setIsListening}
      />
    </div>
  );
};

export default Index;
