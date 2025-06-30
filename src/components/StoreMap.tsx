import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, AlertCircle, Zap, Target, ChevronRight, LocateFixed } from 'lucide-react';

type Position = {
  x: number;
  y: number;
  section: string;
};

interface StoreMapProps {
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
}

const GRID_SIZE = 20;
const CELL_SIZE = 4;

const StoreMap: React.FC<StoreMapProps> = ({ shoppingList }) => {
  const [grid, setGrid] = useState<{x: number, y: number, walkable: boolean, section?: string}[][]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [startPoint, setStartPoint] = useState<Position | null>(null);
  const [destination, setDestination] = useState<Position | null>(null);
  const [mode, setMode] = useState<'start' | 'destination'>('start');
  const [estimatedTime, setEstimatedTime] = useState('0 min');

  // Initialize grid
  useEffect(() => {
    const newGrid: {x: number, y: number, walkable: boolean, section?: string}[][] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push({ x, y, walkable: true });
      }
      newGrid.push(row);
    }

    // Define store layout
    // Horizontal aisles
    for (let x = 3; x < 17; x++) {
      // Aisle A (top)
      newGrid[5][x].section = x < 8 ? 'A1' : x < 12 ? 'A2' : 'A3';
      // Aisle B (middle)
      newGrid[10][x].section = x < 6 ? 'B1' : x < 9 ? 'B2' : x < 12 ? 'B3' : x < 15 ? 'B4' : 'B5';
      // Aisle C (bottom)
      newGrid[15][x].section = x < 7 ? 'C1' : x < 12 ? 'C2' : 'C3';
    }

    // Vertical walls
    for (let y = 5; y <= 15; y++) {
      newGrid[y][3].walkable = false;
      newGrid[y][16].walkable = false;
    }

    // Sections
    // Produce
    for (let x = 1; x < 3; x++) {
      for (let y = 1; y < 5; y++) {
        newGrid[y][x].section = 'Produce';
        newGrid[y][x].walkable = false;
      }
    }

    // Dairy
    for (let x = 17; x < 19; x++) {
      for (let y = 3; y < 7; y++) {
        newGrid[y][x].section = 'Dairy';
        newGrid[y][x].walkable = false;
      }
    }

    // Meat
    for (let x = 1; x < 3; x++) {
      for (let y = 15; y < 19; y++) {
        newGrid[y][x].section = 'Meat';
        newGrid[y][x].walkable = false;
      }
    }

    // Checkout
    for (let x = 8; x < 12; x++) {
      for (let y = 18; y < 20; y++) {
        newGrid[y][x].section = 'Checkout';
        newGrid[y][x].walkable = false;
      }
    }

    // Restrooms
    newGrid[18][1].section = 'Restrooms';
    newGrid[18][2].section = 'Restrooms';

    // Customer Service
    newGrid[2][18].section = 'Customer Service';
    newGrid[2][17].section = 'Customer Service';

    setGrid(newGrid);
  }, []);

  // A* Pathfinding Algorithm
  const findPath = (start: Position, end: Position): Position[] => {
    if (!grid.length) return [];

    // Helper functions
    const heuristic = (a: Position, b: Position) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    const getKey = (pos: Position) => `${pos.x},${pos.y}`;

    const openSet: Position[] = [start];
    const cameFrom: Record<string, Position> = {};
    const gScore: Record<string, number> = {};
    const fScore: Record<string, number> = {};

    // Initialize scores
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x},${y}`;
        gScore[key] = Infinity;
        fScore[key] = Infinity;
      }
    }

    gScore[getKey(start)] = 0;
    fScore[getKey(start)] = heuristic(start, end);

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (fScore[getKey(openSet[i])] < fScore[getKey(current)]) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      // Reached destination
      if (current.x === end.x && current.y === end.y) {
        const path: Position[] = [current];
        while (cameFrom[getKey(current)]) {
          current = cameFrom[getKey(current)];
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
        const neighborPos: Position = {
          ...neighbor,
          section: grid[neighbor.y][neighbor.x].section || `Aisle ${neighbor.x},${neighbor.y}`
        };
        const tentativeGScore = gScore[getKey(current)] + 1;
        const neighborKey = getKey(neighborPos);

        if (tentativeGScore < gScore[neighborKey]) {
          cameFrom[neighborKey] = current;
          gScore[neighborKey] = tentativeGScore;
          fScore[neighborKey] = tentativeGScore + heuristic(neighborPos, end);

          if (!openSet.some(pos => pos.x === neighborPos.x && pos.y === neighborPos.y)) {
            openSet.push(neighborPos);
          }
        }
      }
    }

    return []; // No path found
  };

  // Handle map click
  const handleMapClick = (x: number, y: number) => {
    if (!grid[y] || !grid[y][x] || !grid[y][x].walkable) return;

    const position = {
      x,
      y,
      section: grid[y][x].section || `Aisle ${x},${y}`
    };

    if (mode === 'start') {
      setStartPoint(position);
      setMode('destination');
    } else {
      setDestination(position);
      if (startPoint) {
        const newPath = findPath(startPoint, position);
        setPath(newPath);
        setEstimatedTime(`${Math.ceil(newPath.length * 0.3)} min`);
      }
    }
  };

  // Reset path
  const resetPath = () => {
    setPath([]);
    setStartPoint(null);
    setDestination(null);
    setMode('start');
  };

  // Quick navigation
  const quickNavigate = (location: string) => {
    const locations: Record<string, Position> = {
      'Restrooms': { x: 1, y: 18, section: 'Restrooms' },
      'Checkout': { x: 10, y: 19, section: 'Checkout' },
      'Customer Service': { x: 18, y: 2, section: 'Customer Service' }
    };

    const dest = locations[location];
    if (!dest) return;

    if (!startPoint) {
      setMode('destination');
      setDestination(dest);
      alert('Please first select your starting point on the map');
      return;
    }

    const newPath = findPath(startPoint, dest);
    setDestination(dest);
    setPath(newPath);
    setEstimatedTime(`${Math.ceil(newPath.length * 0.3)} min`);
  };

  // Get aisle coordinates for shopping items
  const getAisleCoordinates = (aisle: string): Position => {
    const aisleMap: Record<string, Position> = {
      'A1': { x: 4, y: 5, section: 'A1' }, 'A2': { x: 10, y: 5, section: 'A2' }, 'A3': { x: 14, y: 5, section: 'A3' },
      'B1': { x: 4, y: 10, section: 'B1' }, 'B2': { x: 7, y: 10, section: 'B2' }, 'B3': { x: 10, y: 10, section: 'B3' },
      'B4': { x: 13, y: 10, section: 'B4' }, 'B5': { x: 16, y: 10, section: 'B5' },
      'C1': { x: 4, y: 15, section: 'C1' }, 'C2': { x: 9, y: 15, section: 'C2' }, 'C3': { x: 14, y: 15, section: 'C3' },
    };
    return aisleMap[aisle] || { x: 10, y: 10, section: 'Unknown' };
  };

  return (
    <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-bold">Smart Store Navigation</span>
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
              onClick={resetPath}
            >
              <Navigation className="w-4 h-4 mr-1" />
              Reset Path
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Instructions */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">
            {mode === 'start' ? '👉 First, click on the map to set your STARTING POINT' : '👉 Now click to set your DESTINATION'}
          </p>
          {startPoint && (
            <p className="text-xs text-blue-700 mt-1">
              Starting point: {startPoint.section} (X: {startPoint.x}, Y: {startPoint.y})
            </p>
          )}
          {destination && (
            <p className="text-xs text-blue-700 mt-1">
              Destination: {destination.section} (X: {destination.x}, Y: {destination.y})
            </p>
          )}
        </div>

        {/* Store Map */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 h-96 overflow-hidden border-2 border-slate-200 shadow-inner">
          {/* Grid */}
          <div className="relative w-full h-full">
            {grid.map((row, y) => (
              <React.Fragment key={y}>
                {row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`absolute ${cell.walkable ? 'bg-white/50 hover:bg-blue-100/70 cursor-pointer' : 'bg-gray-300/50'} 
                      border border-gray-100`}
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
                {/* Add circles for each path point */}
                {path.map((point, index) => (
                  <circle
                    key={index}
                    cx={`${point.x * CELL_SIZE + CELL_SIZE/2}%`}
                    cy={`${point.y * CELL_SIZE + CELL_SIZE/2}%`}
                    r="1.5%"
                    fill="url(#pathGradient)"
                  />
                ))}
              </svg>
            )}

            {/* Start Point */}
            {startPoint && (
              <div
                className="absolute w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-white shadow-xl z-20 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  left: `${startPoint.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${startPoint.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <LocateFixed className="w-3 h-3" />
              </div>
            )}

            {/* Destination */}
            {destination && (
              <div
                className="absolute w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full border-2 border-white shadow-xl z-20 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  left: `${destination.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${destination.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Target className="w-3 h-3" />
              </div>
            )}

            {/* Shopping List Items */}
            {shoppingList.filter(item => !item.found).map((item) => {
              const pos = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-white shadow-lg z-15"
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
                <span className="text-gray-700">Start</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-700 rounded-full border border-white"></div>
                <span className="text-gray-700">Destination</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full border border-white"></div>
                <span className="text-gray-700">Items</span>
              </div>
            </div>
          </div>
        </div>

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

        {/* Path Instructions */}
        {path.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-800 flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>Navigation Path</span>
            </h4>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              {path.slice(0, 5).map((step, index) => (
                <div key={index} className="bg-white/70 p-1 rounded border border-green-100">
                  <span className="font-medium">Step {index + 1}:</span> {step.section}
                </div>
              ))}
              {path.length > 5 && (
                <div className="bg-white/70 p-1 rounded border border-green-100 col-span-3 text-center">
                  + {path.length - 5} more steps...
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreMap;
