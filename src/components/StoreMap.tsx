
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, AlertCircle, Zap, Target } from 'lucide-react';

interface StoreMapProps {
  currentLocation: { x: number; y: number; section: string };
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
  onLocationUpdate: (location: { x: number; y: number; section: string }) => void;
}

const StoreMap: React.FC<StoreMapProps> = ({ currentLocation, shoppingList, onLocationUpdate }) => {
  const [optimizedRoute, setOptimizedRoute] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('12 min');
  const [isNavigating, setIsNavigating] = useState(false);

  const storeLayout = {
    aisles: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'C1', 'C2', 'C3'],
    sections: {
      'Produce': { x: 20, y: 30, color: 'bg-gradient-to-br from-green-100 to-green-200 border-green-300' },
      'Dairy': { x: 80, y: 40, color: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300' },
      'Meat': { x: 60, y: 20, color: 'bg-gradient-to-br from-red-100 to-red-200 border-red-300' },
      'Bakery': { x: 40, y: 70, color: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300' },
      'Electronics': { x: 70, y: 80, color: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300' },
      'Pharmacy': { x: 90, y: 60, color: 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300' },
      'Restrooms': { x: 10, y: 80, color: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300' },
      'Checkout': { x: 50, y: 90, color: 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300' },
      'Customer Service': { x: 85, y: 10, color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300' },
    }
  };

  const pendingItems = shoppingList.filter(item => !item.found);

  useEffect(() => {
    // Optimize route based on store layout
    const routes = pendingItems.map(item => item.aisle);
    const optimized = optimizeRoute(routes);
    setOptimizedRoute(optimized);
    setEstimatedTime(`${Math.ceil(optimized.length * 1.5 + 3)} min`);
  }, [shoppingList]);

  const optimizeRoute = (aisles: string[]): string[] => {
    // Simple optimization: group by section and sort
    return aisles.sort((a, b) => {
      const aSection = a.charAt(0);
      const bSection = b.charAt(0);
      if (aSection !== bSection) return aSection.localeCompare(bSection);
      return parseInt(a.slice(1)) - parseInt(b.slice(1));
    });
  };

  const handleSectionClick = (section: string, coords: { x: number; y: number }) => {
    onLocationUpdate({ ...coords, section });
  };

  const handleQuickNavigation = (destination: string) => {
    const destinations = {
      'Restrooms': { x: 10, y: 80, section: 'Restrooms' },
      'Checkout': { x: 50, y: 90, section: 'Checkout Lanes' },
      'Customer Service': { x: 85, y: 10, section: 'Customer Service' }
    };
    
    const dest = destinations[destination as keyof typeof destinations];
    if (dest) {
      setIsNavigating(true);
      onLocationUpdate(dest);
      setTimeout(() => setIsNavigating(false), 2000);
    }
  };

  const getRoutePathData = () => {
    if (optimizedRoute.length === 0) return '';
    
    const points = [currentLocation];
    optimizedRoute.forEach(aisle => {
      const aisleCoords = getAisleCoordinates(aisle);
      points.push({ ...aisleCoords, section: `Aisle ${aisle}` });
    });
    
    let pathData = `M ${points[0].x * 4} ${points[0].y * 4}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Create curved path for smoother navigation
      const midX = (prev.x * 4 + curr.x * 4) / 2;
      const midY = (prev.y * 4 + curr.y * 4) / 2;
      pathData += ` Q ${midX} ${midY} ${curr.x * 4} ${curr.y * 4}`;
    }
    
    return pathData;
  };

  return (
    <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-bold">Smart Store Map</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1 bg-white/20 text-white border-white/30">
              <Clock className="w-3 h-3" />
              <span>{estimatedTime}</span>
            </Badge>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => setOptimizedRoute(optimizeRoute(pendingItems.map(item => item.aisle)))}
            >
              <Navigation className="w-4 h-4 mr-1" />
              Optimize Route
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 h-96 overflow-hidden border-2 border-slate-200 shadow-inner">
          {/* Store Layout */}
          <div className="relative w-full h-full">
            {/* Sections */}
            {Object.entries(storeLayout.sections).map(([name, { x, y, color }]) => (
              <div
                key={name}
                className={`absolute w-20 h-14 ${color} rounded-xl border-2 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-xs font-bold backdrop-blur-sm`}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => handleSectionClick(name, { x, y })}
              >
                <span className="text-center leading-tight">{name}</span>
              </div>
            ))}

            {/* Current Location */}
            <div
              className="absolute w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-4 border-white shadow-xl z-20 animate-pulse"
              style={{ 
                left: `${currentLocation.x}%`, 
                top: `${currentLocation.y}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>

            {/* Shopping List Items */}
            {pendingItems.map((item, index) => {
              const aisleCoords = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-white shadow-lg z-10 animate-bounce"
                  style={{ 
                    left: `${aisleCoords.x}%`, 
                    top: `${aisleCoords.y}%`, 
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${index * 0.2}s`
                  }}
                  title={item.name}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {item.name}
                  </div>
                </div>
              );
            })}

            {/* Enhanced Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                </linearGradient>
                <marker id="arrowhead" markerWidth="12" markerHeight="8" 
                  refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 12 4, 0 8" fill="url(#routeGradient)" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {optimizedRoute.length > 0 && (
                <path
                  d={getRoutePathData()}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  markerEnd="url(#arrowhead)"
                  filter="url(#glow)"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>

          {/* Enhanced Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
            <div className="flex items-center space-x-6 text-xs font-medium">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-white"></div>
                <span className="text-gray-700">You</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-white"></div>
                <span className="text-gray-700">Items</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                <span className="text-gray-700">Route</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Current Status */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-blue-900">Current Location</p>
                <p className="text-sm text-blue-700 font-medium">{currentLocation.section}</p>
              </div>
            </div>
            {pendingItems.length > 0 && (
              <div className="text-right">
                <p className="text-sm font-bold text-blue-900">
                  {pendingItems.length} items remaining
                </p>
                <p className="text-xs text-blue-700">Next: Aisle {pendingItems[0]?.aisle}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Quick Navigation */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          <h3 className="font-bold text-gray-800 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Quick Navigation</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
              onClick={() => handleQuickNavigation('Restrooms')}
              disabled={isNavigating}
            >
              <MapPin className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <span className="text-xs font-medium">Restrooms</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
              onClick={() => handleQuickNavigation('Checkout')}
              disabled={isNavigating}
            >
              <Target className="w-5 h-5 text-green-600 group-hover:text-green-700" />
              <span className="text-xs font-medium">Checkout</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
              onClick={() => handleQuickNavigation('Customer Service')}
              disabled={isNavigating}
            >
              <AlertCircle className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
              <span className="text-xs font-medium">Help</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function getAisleCoordinates(aisle: string): { x: number; y: number } {
  const aisleMap: { [key: string]: { x: number; y: number } } = {
    'A1': { x: 15, y: 25 }, 'A2': { x: 25, y: 25 }, 'A3': { x: 35, y: 25 },
    'B1': { x: 15, y: 45 }, 'B2': { x: 25, y: 45 }, 'B3': { x: 35, y: 45 },
    'B4': { x: 45, y: 45 }, 'B5': { x: 55, y: 45 }, 'B6': { x: 65, y: 45 },
    'B7': { x: 75, y: 45 }, 'C1': { x: 15, y: 65 }, 'C2': { x: 25, y: 65 },
    'C3': { x: 35, y: 65 },
  };
  return aisleMap[aisle] || { x: 50, y: 50 };
}

export default StoreMap;
