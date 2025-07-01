import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, AlertCircle, Zap, Target, RotateCcw } from 'lucide-react';

interface StoreMapProps {
  currentLocation: { x: number; y: number; section: string };
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
  onLocationUpdate: (location: { x: number; y: number; section: string }) => void;
}

const StoreMap: React.FC<StoreMapProps> = ({ currentLocation, shoppingList, onLocationUpdate }) => {
  const [startingPosition, setStartingPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSettingPosition, setIsSettingPosition] = useState(true);
  const [optimizedRoute, setOptimizedRoute] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('0 min');
  const [isNavigating, setIsNavigating] = useState(false);

  // Define the detailed store grid layout matching the image
  const storeGrid = {
    rows: 16,
    cols: 20,
    // Define different sections of the store
    layout: generateStoreLayout()
  };

  function generateStoreLayout() {
    const layout = Array(16).fill(null).map(() => Array(20).fill('floor'));
    
    // Entrance area (bottom)
    for (let col = 8; col <= 12; col++) {
      layout[15][col] = 'entrance';
    }
    
    // Produce section (left side)
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 6; col++) {
        layout[row][col] = 'produce';
      }
    }
    
    // Dairy section (right side)
    for (let row = 1; row <= 4; row++) {
      for (let col = 14; col <= 18; col++) {
        layout[row][col] = 'dairy';
      }
    }
    
    // Meat section (top center)
    for (let row = 1; row <= 3; row++) {
      for (let col = 8; col <= 12; col++) {
        layout[row][col] = 'meat';
      }
    }
    
    // Bakery section (left bottom)
    for (let row = 12; row <= 14; row++) {
      for (let col = 1; col <= 6; col++) {
        layout[row][col] = 'bakery';
      }
    }
    
    // Checkout lanes (bottom center)
    for (let row = 12; row <= 14; row++) {
      for (let col = 8; col <= 12; col++) {
        layout[row][col] = 'checkout';
      }
    }
    
    // Aisles (vertical strips)
    const aisleColumns = [7, 9, 11, 13];
    for (let col of aisleColumns) {
      for (let row = 5; row <= 11; row++) {
        layout[row][col] = 'aisle';
      }
    }
    
    // Shopping areas between aisles
    for (let row = 5; row <= 11; row++) {
      for (let col = 8; col <= 12; col++) {
        if (!aisleColumns.includes(col)) {
          layout[row][col] = 'shopping';
        }
      }
    }
    
    // Walls
    for (let col = 0; col < 20; col++) {
      layout[0][col] = 'wall';
      if (col < 8 || col > 12) {
        layout[15][col] = 'wall';
      }
    }
    for (let row = 0; row < 16; row++) {
      layout[row][0] = 'wall';
      layout[row][19] = 'wall';
    }
    
    return layout;
  }

  const getCellStyle = (cellType: string, row: number, col: number) => {
    const isCurrentPosition = startingPosition && 
      Math.floor(startingPosition.x / 5) === col && 
      Math.floor(startingPosition.y / 6.25) === row;
    
    const isDestination = optimizedRoute.some(aisle => {
      const coords = getAisleCoordinates(aisle);
      return Math.floor(coords.x / 5) === col && Math.floor(coords.y / 6.25) === row;
    });

    let baseStyle = 'w-full h-full border border-gray-200 transition-all duration-200 cursor-pointer hover:scale-105';
    
    if (isCurrentPosition) {
      baseStyle += ' ring-2 ring-blue-500 ring-offset-1';
    }
    
    if (isDestination) {
      baseStyle += ' ring-2 ring-red-500 ring-offset-1 animate-pulse';
    }

    switch (cellType) {
      case 'wall':
        return baseStyle + ' bg-gray-800';
      case 'entrance':
        return baseStyle + ' bg-green-200 hover:bg-green-300';
      case 'produce':
        return baseStyle + ' bg-green-100 hover:bg-green-200';
      case 'dairy':
        return baseStyle + ' bg-blue-100 hover:bg-blue-200';
      case 'meat':
        return baseStyle + ' bg-red-100 hover:bg-red-200';
      case 'bakery':
        return baseStyle + ' bg-yellow-100 hover:bg-yellow-200';
      case 'checkout':
        return baseStyle + ' bg-emerald-100 hover:bg-emerald-200';
      case 'aisle':
        return baseStyle + ' bg-purple-100 hover:bg-purple-200';
      case 'shopping':
        return baseStyle + ' bg-gray-50 hover:bg-gray-100';
      default:
        return baseStyle + ' bg-white hover:bg-gray-50';
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (isSettingPosition && storeGrid.layout[row][col] !== 'wall') {
      const x = col * 5; // Convert grid to percentage
      const y = row * 6.25; // Convert grid to percentage
      setStartingPosition({ x, y });
      onLocationUpdate({ x, y, section: `Grid ${row}-${col}` });
    }
  };

  const pendingItems = shoppingList.filter(item => !item.found);

  useEffect(() => {
    if (pendingItems.length > 0) {
      const routes = pendingItems.map(item => item.aisle);
      const optimized = optimizeRoute(routes);
      setOptimizedRoute(optimized);
      setEstimatedTime(`${Math.ceil(optimized.length * 1.5 + 3)} min`);
    }
  }, [shoppingList]);

  const optimizeRoute = (aisles: string[]): string[] => {
    return aisles.sort((a, b) => {
      const aSection = a.charAt(0);
      const bSection = b.charAt(0);
      if (aSection !== bSection) return aSection.localeCompare(bSection);
      return parseInt(a.slice(1)) - parseInt(b.slice(1));
    });
  };

  const handleStartMoving = () => {
    if (startingPosition && optimizedRoute.length > 0) {
      setIsNavigating(true);
      setIsSettingPosition(false);
      // Simulate navigation start
      setTimeout(() => {
        setIsNavigating(false);
      }, 2000);
    }
  };

  const handleRecalculatePath = () => {
    if (pendingItems.length > 0) {
      const routes = pendingItems.map(item => item.aisle);
      const optimized = optimizeRoute(routes);
      setOptimizedRoute(optimized);
      setEstimatedTime(`${Math.ceil(optimized.length * 1.5 + 3)} min`);
    }
  };

  const resetStartingPosition = () => {
    setStartingPosition(null);
    setIsSettingPosition(true);
    setIsNavigating(false);
  };

  return (
    <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-bold">Advanced Store Navigation</span>
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
              onClick={resetStartingPosition}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Instructions */}
        {isSettingPosition && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                👆 First, click on the map to set your STARTING POSITION
              </span>
            </div>
          </div>
        )}

        {/* Store Grid Map */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border-2 border-slate-200 shadow-inner mb-6">
          <div className="grid grid-cols-20 gap-0.5 aspect-square max-h-96">
            {storeGrid.layout.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellStyle(cell, rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  title={`${cell} (${rowIndex}, ${colIndex})`}
                />
              ))
            )}
          </div>

          {/* Current Position Marker */}
          {startingPosition && (
            <div
              className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg z-20 animate-pulse"
              style={{ 
                left: `${16 + (startingPosition.x / 100) * (384 - 32)}px`, 
                top: `${16 + (startingPosition.y / 100) * (384 - 32)}px`,
                transform: 'translate(-50%, -50%)' 
              }}
            />
          )}

          {/* Shopping Items Markers */}
          {pendingItems.map((item, index) => {
            const aisleCoords = getAisleCoordinates(item.aisle);
            return (
              <div
                key={item.id}
                className="absolute w-2.5 h-2.5 bg-red-600 rounded-full border border-white shadow-lg z-10"
                style={{ 
                  left: `${16 + (aisleCoords.x / 100) * (384 - 32)}px`, 
                  top: `${16 + (aisleCoords.y / 100) * (384 - 32)}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={item.name}
              />
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>You</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Items</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300"></div>
                <span>Destination</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-800"></div>
                <span>Wall</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            onClick={handleStartMoving}
            disabled={!startingPosition || pendingItems.length === 0 || isNavigating}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Start Moving
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleRecalculatePath}
            disabled={pendingItems.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Recalculate Path
          </Button>
        </div>

        {/* Current Status */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-blue-900">
                  {startingPosition ? 'Position Set' : 'Set Starting Position'}
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  {startingPosition ? currentLocation.section : 'Click on the map above'}
                </p>
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

        {/* Quick Navigation */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-800 flex items-center space-x-2 mb-3">
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
              onClick={() => handleQuickNavigation('Help')}
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

  function handleQuickNavigation(destination: string) {
    const destinations = {
      'Restrooms': { x: 10, y: 80, section: 'Restrooms' },
      'Checkout': { x: 50, y: 87, section: 'Checkout Lanes' },
      'Help': { x: 85, y: 10, section: 'Customer Service' }
    };
    
    const dest = destinations[destination as keyof typeof destinations];
    if (dest) {
      setIsNavigating(true);
      onLocationUpdate(dest);
      setTimeout(() => setIsNavigating(false), 2000);
    }
  }
};

// Helper function
function getAisleCoordinates(aisle: string): { x: number; y: number } {
  const aisleMap: { [key: string]: { x: number; y: number } } = {
    'A1': { x: 15, y: 31 }, 'A2': { x: 25, y: 31 }, 'A3': { x: 35, y: 31 },
    'B1': { x: 15, y: 50 }, 'B2': { x: 25, y: 50 }, 'B3': { x: 35, y: 50 },
    'B4': { x: 45, y: 50 }, 'B5': { x: 55, y: 50 }, 'B6': { x: 65, y: 50 },
    'B7': { x: 75, y: 50 }, 'C1': { x: 15, y: 69 }, 'C2': { x: 25, y: 69 },
    'C3': { x: 35, y: 69 },
  };
  return aisleMap[aisle] || { x: 50, y: 50 };
}

export default StoreMap;
