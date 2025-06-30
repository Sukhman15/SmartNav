
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';

interface StoreMapProps {
  currentLocation: { x: number; y: number; section: string };
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
  onLocationUpdate: (location: { x: number; y: number; section: string }) => void;
}

const StoreMap: React.FC<StoreMapProps> = ({ currentLocation, shoppingList, onLocationUpdate }) => {
  const [optimizedRoute, setOptimizedRoute] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('12 min');

  const storeLayout = {
    aisles: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'C1', 'C2', 'C3'],
    sections: {
      'Produce': { x: 20, y: 30, color: 'bg-green-200' },
      'Dairy': { x: 80, y: 40, color: 'bg-blue-200' },
      'Meat': { x: 60, y: 20, color: 'bg-red-200' },
      'Bakery': { x: 40, y: 70, color: 'bg-yellow-200' },
      'Electronics': { x: 70, y: 80, color: 'bg-purple-200' },
      'Pharmacy': { x: 90, y: 60, color: 'bg-pink-200' },
    }
  };

  const pendingItems = shoppingList.filter(item => !item.found);

  useEffect(() => {
    // Simulate route optimization
    const routes = pendingItems.map(item => item.aisle);
    setOptimizedRoute(routes);
  }, [shoppingList]);

  const handleSectionClick = (section: string, coords: { x: number; y: number }) => {
    onLocationUpdate({ ...coords, section });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Store Map</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{estimatedTime}</span>
            </Badge>
            <Button size="sm" variant="outline">
              <Navigation className="w-4 h-4 mr-1" />
              Optimize Route
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative bg-gray-50 rounded-lg p-4 h-96 overflow-hidden">
          {/* Store Layout */}
          <div className="relative w-full h-full">
            {/* Sections */}
            {Object.entries(storeLayout.sections).map(([name, { x, y, color }]) => (
              <div
                key={name}
                className={`absolute w-16 h-12 ${color} rounded-lg border-2 border-gray-300 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-medium`}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => handleSectionClick(name, { x, y })}
              >
                {name}
              </div>
            ))}

            {/* Current Location */}
            <div
              className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10 animate-pulse"
              style={{ 
                left: `${currentLocation.x}%`, 
                top: `${currentLocation.y}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* Shopping List Items */}
            {pendingItems.map((item) => {
              const aisleCoords = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"
                  style={{ 
                    left: `${aisleCoords.x}%`, 
                    top: `${aisleCoords.y}%`, 
                    transform: 'translate(-50%, -50%)' 
                  }}
                  title={item.name}
                />
              );
            })}

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
              </defs>
              {optimizedRoute.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                  points={getRoutePoints(currentLocation, optimizedRoute)}
                />
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white rounded-lg p-2 shadow-sm border">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>You</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Current Location</p>
                <p className="text-sm text-blue-700">{currentLocation.section}</p>
              </div>
            </div>
            {pendingItems.length > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900">
                  {pendingItems.length} items remaining
                </p>
                <p className="text-xs text-blue-700">Next: {pendingItems[0]?.aisle}</p>
              </div>
            )}
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

function getRoutePoints(start: { x: number; y: number }, aisles: string[]): string {
  const points = [start];
  aisles.forEach(aisle => {
    points.push(getAisleCoordinates(aisle));
  });
  
  return points.map(point => `${point.x * 4},${point.y * 4}`).join(' ');
}

export default StoreMap;
