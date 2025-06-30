
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
      'Produce': { x: 20, y: 30, color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' },
      'Dairy': { x: 80, y: 40, color: 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200' },
      'Meat': { x: 60, y: 20, color: 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200' },
      'Bakery': { x: 40, y: 70, color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200' },
      'Electronics': { x: 70, y: 80, color: 'bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200' },
      'Pharmacy': { x: 90, y: 60, color: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200' },
      'Restrooms': { x: 10, y: 80, color: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200' },
      'Checkout': { x: 50, y: 90, color: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200' },
      'Customer Service': { x: 85, y: 10, color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200' },
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
      pathData += ` L ${curr.x * 4} ${curr.y * 4}`;
    }
    
    return pathData;
  };

  const getArrowMarkers = () => {
    if (optimizedRoute.length === 0) return [];
    
    const points = [currentLocation];
    optimizedRoute.forEach(aisle => {
      const aisleCoords = getAisleCoordinates(aisle);
      points.push({ ...aisleCoords, section: `Aisle ${aisle}` });
    });
    
    const arrows = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      
      // Calculate arrow position (midpoint between start and end)
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      
      // Calculate arrow rotation
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      arrows.push({
        x: midX,
        y: midY,
        angle: angle,
        key: `arrow-${i}`
      });
    }
    
    return arrows;
  };

  return (
    <Card className="h-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl">Smart Store Navigator</span>
              <p className="text-sm text-slate-300 font-normal">AI-Powered Shopping Assistant</p>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-2 bg-white/10 text-white border-white/20 px-4 py-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{estimatedTime}</span>
            </Badge>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              onClick={() => setOptimizedRoute(optimizeRoute(pendingItems.map(item => item.aisle)))}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Optimize Route
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 h-96 overflow-hidden border border-slate-100 shadow-inner">
          {/* Store Layout */}
          <div className="relative w-full h-full">
            {/* Sections */}
            {Object.entries(storeLayout.sections).map(([name, { x, y, color }]) => (
              <div
                key={name}
                className={`absolute w-24 h-16 ${color} rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm font-bold backdrop-blur-sm`}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => handleSectionClick(name, { x, y })}
              >
                <span className="text-center leading-tight text-slate-700">{name}</span>
              </div>
            ))}

            {/* Current Location */}
            <div
              className="absolute w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-4 border-white shadow-xl z-20"
              style={{ 
                left: `${currentLocation.x}%`, 
                top: `${currentLocation.y}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>

            {/* Shopping List Items */}
            {pendingItems.map((item, index) => {
              const aisleCoords = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-3 border-white shadow-lg z-10"
                  style={{ 
                    left: `${aisleCoords.x}%`, 
                    top: `${aisleCoords.y}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${item.name} - ₹${item.price}`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    {item.name} - ₹{item.price}
                  </div>
                </div>
              );
            })}

            {/* Enhanced Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
                </linearGradient>
                <filter id="routeGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {optimizedRoute.length > 0 && (
                <>
                  <path
                    d={getRoutePathData()}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    strokeDasharray="10,5"
                    filter="url(#routeGlow)"
                    className="opacity-80"
                  />
                  {/* Direction Arrows */}
                  {getArrowMarkers().map((arrow) => (
                    <g key={arrow.key}>
                      <polygon
                        points="0,-4 8,0 0,4"
                        fill="url(#routeGradient)"
                        transform={`translate(${arrow.x * 4}, ${arrow.y * 4}) rotate(${arrow.angle})`}
                        className="drop-shadow-sm"
                      />
                    </g>
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* Enhanced Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-slate-700">You</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-slate-700">Items</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>
                <span className="text-slate-700">Route</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Current Status */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-lg">Current Location</p>
                <p className="text-blue-700 font-medium">{currentLocation.section}</p>
              </div>
            </div>
            {pendingItems.length > 0 && (
              <div className="text-right">
                <p className="font-bold text-blue-900">
                  {pendingItems.length} items remaining
                </p>
                <p className="text-sm text-blue-700">Next: Aisle {pendingItems[0]?.aisle}</p>
                <p className="text-sm text-blue-600">Total: ₹{pendingItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Quick Navigation */}
        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2 text-lg">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Quick Navigation</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex-col space-y-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group border-2 rounded-xl"
              onClick={() => handleQuickNavigation('Restrooms')}
              disabled={isNavigating}
            >
              <MapPin className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
              <span className="text-sm font-semibold">Restrooms</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-2 h-auto py-4 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 group border-2 rounded-xl"
              onClick={() => handleQuickNavigation('Checkout')}
              disabled={isNavigating}
            >
              <Target className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700" />
              <span className="text-sm font-semibold">Checkout</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-2 h-auto py-4 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group border-2 rounded-xl"
              onClick={() => handleQuickNavigation('Customer Service')}
              disabled={isNavigating}
            >
              <AlertCircle className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
              <span className="text-sm font-semibold">Help</span>
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
