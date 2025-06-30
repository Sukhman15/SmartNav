import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, AlertCircle, Zap, Target, ChevronRight } from 'lucide-react';

// Define types for our grid system
type GridCell = {
  x: number;
  y: number;
  walkable: boolean;
  section?: string;
};

type Position = {
  x: number;
  y: number;
};

interface StoreMapProps {
  currentLocation: Position & { section: string };
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
  onLocationUpdate: (location: Position & { section: string }) => void;
}

const GRID_SIZE = 20; // Size of our grid (20x20)
const CELL_SIZE = 4; // Size of each cell in percentage

const StoreMap: React.FC<StoreMapProps> = ({ currentLocation, shoppingList, onLocationUpdate }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [destination, setDestination] = useState<Position & { section: string } | null>(null);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('0 min');

  // Initialize the grid
  useEffect(() => {
    const newGrid: GridCell[][] = [];
    
    // Create empty grid
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push({ x, y, walkable: true });
      }
      newGrid.push(row);
    }
    
    // Mark walls and sections
    // Horizontal aisles
    for (let x = 3; x < 17; x++) {
      // Aisle A (top)
      newGrid[5][x].section = x < 8 ? 'A1' : x < 12 ? 'A2' : 'A3';
      // Aisle B (middle)
      newGrid[10][x].section = x < 6 ? 'B1' : x < 9 ? 'B2' : x < 12 ? 'B3' : x < 15 ? 'B4' : 'B5';
      // Aisle C (bottom)
      newGrid[15][x].section = x < 7 ? 'C1' : x < 12 ? 'C2' : 'C3';
    }
    
    // Vertical paths between aisles
    for (let y = 5; y <= 15; y++) {
      newGrid[y][3].walkable = false; // Left wall
      newGrid[y][16].walkable = false; // Right wall
    }
    
    // Add sections
    // Produce section
    for (let x = 1; x < 3; x++) {
      for (let y = 1; y < 5; y++) {
        newGrid[y][x].section = 'Produce';
        newGrid[y][x].walkable = false;
      }
    }
    
    // Dairy section
    for (let x = 17; x < 19; x++) {
      for (let y = 3; y < 7; y++) {
        newGrid[y][x].section = 'Dairy';
        newGrid[y][x].walkable = false;
      }
    }
    
    // Meat section
    for (let x = 1; x < 3; x++) {
      for (let y = 15; y < 19; y++) {
        newGrid[y][x].section = 'Meat';
        newGrid[y][x].walkable = false;
      }
    }
    
    // Checkout area
    for (let x = 8; x < 12; x++) {
      for (let y = 18; y < 20; y++) {
        newGrid[y][x].section = 'Checkout';
        newGrid[y][x].walkable = false;
      }
    }
    
    // Restrooms
    newGrid[18][1].section = 'Restrooms';
    newGrid[18][2].section = 'Restrooms';
    
    setGrid(newGrid);
  }, []);

  // A* pathfinding algorithm
  const findPath = (start: Position, end: Position): Position[] => {
    if (!grid.length) return [];
    
    // Helper function to calculate heuristic (Manhattan distance)
    const heuristic = (a: Position, b: Position) => {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };
    
    // Initialize open and closed sets
    const openSet: Position[] = [start];
    const cameFrom: { [key: string]: Position } = {};
    const gScore: { [key: string]: number } = {};
    const fScore: { [key: string]: number } = {};
    
    // Initialize scores
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x},${y}`;
        gScore[key] = Infinity;
        fScore[key] = Infinity;
      }
    }
    
    gScore[`${start.x},${start.y}`] = 0;
    fScore[`${start.x},${start.y}`] = heuristic(start, end);
    
    while (openSet.length > 0) {
      // Find node in openSet with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        const key = `${openSet[i].x},${openSet[i].y}`;
        const currentKey = `${current.x},${current.y}`;
        if (fScore[key] < fScore[currentKey]) {
          current = openSet[i];
          currentIndex = i;
        }
      }
      
      // If we've reached the end, reconstruct path
      if (current.x === end.x && current.y === end.y) {
        const path: Position[] = [current];
        while (cameFrom[`${current.x},${current.y}`]) {
          current = cameFrom[`${current.x},${current.y}`];
          path.unshift(current);
        }
        return path;
      }
      
      // Move current from openSet to closed set
      openSet.splice(currentIndex, 1);
      
      // Check neighbors
      const neighbors = [
        { x: current.x, y: current.y - 1 }, // up
        { x: current.x, y: current.y + 1 }, // down
        { x: current.x - 1, y: current.y }, // left
        { x: current.x + 1, y: current.y }, // right
      ].filter(pos => 
        pos.x >= 0 && pos.x < GRID_SIZE && 
        pos.y >= 0 && pos.y < GRID_SIZE &&
        grid[pos.y][pos.x].walkable
      );
      
      for (const neighbor of neighbors) {
        const tentativeGScore = gScore[`${current.x},${current.y}`] + 1;
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        
        if (tentativeGScore < gScore[neighborKey]) {
          cameFrom[neighborKey] = current;
          gScore[neighborKey] = tentativeGScore;
          fScore[neighborKey] = tentativeGScore + heuristic(neighbor, end);
          
          if (!openSet.some(pos => pos.x === neighbor.x && pos.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    
    // No path found
    return [];
  };

  // Handle clicking on the map to set destination
  const handleMapClick = (x: number, y: number) => {
    if (!isSelectingDestination || !grid[y] || !grid[y][x] || !grid[y][x].walkable) return;
    
    const newDestination = {
      x,
      y,
      section: grid[y][x].section || `Aisle ${x},${y}`
    };
    
    setDestination(newDestination);
    const newPath = findPath(
      { x: currentLocation.x, y: currentLocation.y },
      { x, y }
    );
    
    setPath(newPath);
    setEstimatedTime(`${newPath.length * 0.5} min`);
    setIsSelectingDestination(false);
  };

  // Start navigation to destination
  const startNavigation = () => {
    if (!destination) return;
    
    onLocationUpdate({
      x: destination.x,
      y: destination.y,
      section: destination.section
    });
    
    // In a real app, you might animate through the path
    setPath([]);
    setDestination(null);
  };

  // Get section coordinates for shopping list items
  const getAisleCoordinates = (aisle: string): Position => {
    const aisleMap: { [key: string]: Position } = {
      'A1': { x: 4, y: 5 }, 'A2': { x: 10, y: 5 }, 'A3': { x: 14, y: 5 },
      'B1': { x: 4, y: 10 }, 'B2': { x: 7, y: 10 }, 'B3': { x: 10, y: 10 },
      'B4': { x: 13, y: 10 }, 'B5': { x: 16, y: 10 },
      'C1': { x: 4, y: 15 }, 'C2': { x: 9, y: 15 }, 'C3': { x: 14, y: 15 },
    };
    return aisleMap[aisle] || { x: 10, y: 10 };
  };

  // Quick navigation to common locations
  const quickNavigate = (location: string) => {
    const locations: { [key: string]: Position & { section: string } } = {
      'Restrooms': { x: 1, y: 18, section: 'Restrooms' },
      'Checkout': { x: 10, y: 19, section: 'Checkout' },
      'Customer Service': { x: 18, y: 2, section: 'Customer Service' }
    };
    
    const dest = locations[location];
    if (!dest) return;
    
    setDestination(dest);
    const newPath = findPath(
      { x: currentLocation.x, y: currentLocation.y },
      { x: dest.x, y: dest.y }
    );
    
    setPath(newPath);
    setEstimatedTime(`${newPath.length * 0.5} min`);
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
              onClick={() => setIsSelectingDestination(!isSelectingDestination)}
            >
              <Navigation className="w-4 h-4 mr-1" />
              {isSelectingDestination ? 'Cancel' : 'Set Destination'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 h-96 overflow-hidden border-2 border-slate-200 shadow-inner">
          {/* Store Grid */}
          <div className="relative w-full h-full">
            {/* Grid cells */}
            {grid.map((row, y) => (
              <React.Fragment key={y}>
                {row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`absolute ${cell.walkable ? 'bg-white/50' : 'bg-gray-300/50'} 
                      ${isSelectingDestination && cell.walkable ? 'cursor-pointer hover:bg-blue-100/50' : ''}
                      ${cell.section ? 'border border-gray-200' : ''}`}
                    style={{
                      left: `${x * CELL_SIZE}%`,
                      top: `${y * CELL_SIZE}%`,
                      width: `${CELL_SIZE}%`,
                      height: `${CELL_SIZE}%`,
                    }}
                    onClick={() => handleMapClick(x, y)}
                  >
                    {cell.section && (
                      <div className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-gray-600 opacity-70">
                        {cell.section}
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Path */}
            {path.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <marker 
                    id="arrowhead" 
                    markerWidth="6" 
                    markerHeight="4" 
                    refX="5" 
                    refY="2" 
                    orient="auto"
                  >
                    <polygon points="0 0, 6 2, 0 4" fill="url(#pathGradient)" />
                  </marker>
                </defs>
                <path
                  d={`M ${path[0].x * CELL_SIZE + CELL_SIZE/2}% ${path[0].y * CELL_SIZE + CELL_SIZE/2}% 
                    ${path.slice(1).map(p => `L ${p.x * CELL_SIZE + CELL_SIZE/2}% ${p.y * CELL_SIZE + CELL_SIZE/2}%`).join(' ')}`}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            )}

            {/* Current Location */}
            <div
              className="absolute w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-white shadow-xl z-20"
              style={{
                left: `${currentLocation.x * CELL_SIZE + CELL_SIZE/2}%`,
                top: `${currentLocation.y * CELL_SIZE + CELL_SIZE/2}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* Destination */}
            {destination && (
              <div
                className="absolute w-4 h-4 bg-gradient-to-br from-green-500 to-green-700 rounded-full border-2 border-white shadow-xl z-20 animate-pulse"
                style={{
                  left: `${destination.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${destination.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}

            {/* Shopping List Items */}
            {shoppingList.filter(item => !item.found).map((item) => {
              const pos = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-3 h-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-white shadow-lg z-15"
                  style={{
                    left: `${pos.x * CELL_SIZE + CELL_SIZE/2}%`,
                    top: `${pos.y * CELL_SIZE + CELL_SIZE/2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={item.name}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border border-white"></div>
                <span className="text-gray-700">You</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full border border-white"></div>
                <span className="text-gray-700">Items</span>
              </div>
              {destination && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-700 rounded-full border border-white"></div>
                  <span className="text-gray-700">Destination</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Status */}
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
            {destination && (
              <div className="text-right">
                <p className="text-sm font-bold text-blue-900">Destination Set</p>
                <p className="text-xs text-blue-700">{destination.section}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        {destination && (
          <div className="mt-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={startNavigation}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Start Navigation
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          <h3 className="font-bold text-gray-800 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Quick Navigation</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Restrooms')}
            >
              <MapPin className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <span className="text-xs font-medium">Restrooms</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Checkout')}
            >
              <Target className="w-5 h-5 text-green-600 group-hover:text-green-700" />
              <span className="text-xs font-medium">Checkout</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Customer Service')}
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

export default StoreMap;
