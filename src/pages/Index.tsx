
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, ShoppingCart, Camera, Mic, Navigation, Star, Clock, Zap, Wifi } from 'lucide-react';
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
    { id: 1, name: 'Organic Apples', found: false, aisle: 'A3', price: 199.99 },
    { id: 2, name: 'Whole Wheat Bread', found: true, aisle: 'B7', price: 89.49 },
    { id: 3, name: 'Almond Milk', found: false, aisle: 'C2', price: 249.99 },
  ]);
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl border border-slate-200">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  SmartNav Pro
                </h1>
                <p className="text-slate-600 font-medium">AI-Powered Shopping Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-sm text-slate-700 bg-slate-100/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-slate-200">
                <MapPin className="w-5 h-5 text-slate-600" />
                <span className="font-medium">Big Bazaar - Main Street</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg px-4 py-2 rounded-xl">
                  <Wifi className="w-4 h-4 mr-2" />
                  Connected
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl rounded-3xl p-2">
            <TabsTrigger 
              value="navigate" 
              className="flex items-center space-x-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-900 data-[state=active]:to-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3"
            >
              <MapPin className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Navigate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="flex items-center space-x-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">My List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scan" 
              className="flex items-center space-x-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3"
            >
              <Camera className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Scan</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assistant" 
              className="flex items-center space-x-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3"
            >
              <Zap className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">AI Help</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3"
            >
              <Star className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigate" className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <StoreMap 
                  currentLocation={currentLocation}
                  shoppingList={shoppingList}
                  onLocationUpdate={setCurrentLocation}
                />
              </div>
              <div className="space-y-8">
                <InventoryTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
