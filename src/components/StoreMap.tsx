import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Navigation, Clock, AlertCircle, Zap, Target,
  ChevronRight, LocateFixed, ShoppingCart, Milk, Beef, Apple,
  Pill, Shirt, Home, ToyBrick, BookOpen, RefreshCw, X, HelpCircle
} from 'lucide-react';

type Position = {
  x: number;
  y: number;
  section: string;
  type?: 'department' | 'aisle' | 'service';
  icon?: React.ReactNode;
  color?: string;
};

interface StoreMapProps {
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
}

const GRID_SIZE = 30;
const CELL_SIZE = 3.33;
const MOVEMENT_SPEED = 200;

const StoreMap: React.FC<StoreMapProps> = ({ shoppingList }) => {
  const [grid, setGrid] = useState<{x: number, y: number, walkable: boolean, data?: Position}[][]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [destination, setDestination] = useState<Position | null>(null);
  const [mode, setMode] = useState<'start' | 'destination'>('start');
  const [estimatedTime, setEstimatedTime] = useState('0 min');
  const [isMoving, setIsMoving] = useState(false);
  const [visitedSections, setVisitedSections] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(true);

  // Enhanced department icons with colors
  const departmentIcons: Record<string, {icon: React.ReactNode, color: string}> = {
    'Produce': {icon: <Apple className="w-3 h-3" />, color: 'bg-green-100 border-green-300'},
    'Dairy': {icon: <Milk className="w-3 h-3" />, color: 'bg-blue-100 border-blue-300'},
    'Meat': {icon: <Beef className="w-3 h-3" />, color: 'bg-red-100 border-red-300'},
    'Bakery': {icon: <span className="text-xs">🥖</span>, color: 'bg-amber-100 border-amber-300'},
    'Pharmacy': {icon: <Pill className="w-3 h-3" />, color: 'bg-pink-100 border-pink-300'},
    'Clothing': {icon: <Shirt className="w-3 h-3" />, color: 'bg-purple-100 border-purple-300'},
    'Home Goods': {icon: <Home className="w-3 h-3" />, color: 'bg-indigo-100 border-indigo-300'},
    'Electronics': {icon: <span className="text-xs">📱</span>, color: 'bg-gray-100 border-gray-300'},
    'Toys': {icon: <ToyBrick className="w-3 h-3" />, color: 'bg-yellow-100 border-yellow-300'},
    'Books': {icon: <BookOpen className="w-3 h-3" />, color: 'bg-orange-100 border-orange-300'},
    'Checkout': {icon: <ShoppingCart className="w-3 h-3" />, color: 'bg-emerald-100 border-emerald-300'},
    'Customer Service': {icon: <AlertCircle className="w-3 h-3" />, color: 'bg-cyan-100 border-cyan-300'},
    'Restrooms': {icon: <span className="text-xs">🚻</span>, color: 'bg-teal-100 border-teal-300'},
    'Floral': {icon: <span className="text-xs">🌸</span>, color: 'bg-fuchsia-100 border-fuchsia-300'},
    'Frozen Foods': {icon: <span className="text-xs">❄️</span>, color: 'bg-lightBlue-100 border-lightBlue-300'},
    'Seafood': {icon: <span className="text-xs">🐟</span>, color: 'bg-rose-100 border-rose-300'},
    'Display': {icon: <span className="text-xs">🖼️</span>, color: 'bg-gray-200 border-gray-400'},
    'Kiosk': {icon: <span className="text-xs">📱</span>, color: 'bg-gray-200 border-gray-400'}
  };

  // Initialize grid with enhanced layout
  useEffect(() => {
    const newGrid: {x: number, y: number, walkable: boolean, data?: Position}[][] = [];
    
    // Create empty grid with subtle pattern
    for (let y = 0; y < GRID_SIZE; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push({ 
          x, 
          y, 
          walkable: true,
          data: {
            x, y,
            section: 'Aisle',
            type: 'aisle',
            color: (x + y) % 2 === 0 ? 'bg-white/90' : 'bg-slate-50/90'
          }
        });
      }
      newGrid.push(row);
    }

    // Helper function to create sections
    const createSection = (x1: number, y1: number, x2: number, y2: number, section: string, walkable = false) => {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          if (newGrid[y] && newGrid[y][x]) {
            newGrid[y][x].walkable = walkable;
            const dept = departmentIcons[section] || {icon: null, color: 'bg-gray-100 border-gray-300'};
            newGrid[y][x].data = {
              x, y, 
              section,
              type: walkable ? 'aisle' : 'department',
              icon: dept.icon,
              color: dept.color
            };
          }
        }
      }
    };

    // In the grid initialization section, modify the aisle creation:
// Create main aisles (vertical) with more spacing
for (let x = 4; x <= 26; x += 4) {  // Changed from 3 to 4 for wider spacing
  for (let y = 2; y <= 25; y++) {
    if (y !== 10 && y !== 20) {
      newGrid[y][x].walkable = true;
      newGrid[y][x].data = {
        x, y,
        section: `Aisle ${String.fromCharCode(65 + Math.floor(x/4))}${Math.floor(y/5) + 1}`,
        type: 'aisle',
        color: 'bg-blue-50/80 border-blue-200',
        icon: <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-4/5 bg-blue-300/30 rounded-full"></div>
        </div>
      };
    }
  }
}

// Create cross aisles (horizontal) with more spacing
for (let y = 10; y <= 20; y += 10) {
  for (let x = 2; x <= 27; x++) {  // Start from 2 instead of 1 for better spacing
    if (x % 4 !== 0) {  // Changed from 3 to 4 to match vertical spacing
      newGrid[y][x].walkable = true;
      newGrid[y][x].data = {
        x, y,
        section: `Cross Aisle ${y === 10 ? 'A' : 'B'}`,
        type: 'aisle',
        color: 'bg-blue-50/80 border-blue-200',
        icon: <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-4/5 bg-blue-300/30 rounded-full"></div>
        </div>
      };
    }
  }
}


    // Create departments with colors
    createSection(1, 1, 2, 4, 'Produce');
    createSection(4, 1, 5, 4, 'Bakery');
    createSection(7, 1, 8, 4, 'Floral');
    createSection(1, 6, 5, 9, 'Dairy');
    createSection(7, 6, 11, 9, 'Frozen Foods');
    createSection(1, 11, 5, 14, 'Meat');
    createSection(7, 11, 11, 14, 'Seafood');
    createSection(13, 1, 17, 9, 'Pharmacy');
    createSection(19, 1, 23, 9, 'Electronics');
    createSection(25, 1, 28, 9, 'Clothing');
    createSection(13, 11, 17, 19, 'Home Goods');
    createSection(19, 11, 23, 19, 'Toys');
    createSection(25, 11, 28, 19, 'Books');
    createSection(10, 21, 20, 25, 'Checkout');
    createSection(1, 21, 3, 23, 'Restrooms');
    createSection(25, 21, 28, 23, 'Customer Service');

    // Add some decorative obstacles
    createSection(15, 15, 17, 17, 'Display', false);
    createSection(22, 5, 24, 7, 'Kiosk', false);

    // Add decorative elements
    // Store entrance
    for (let x = 14; x <= 16; x++) {
      newGrid[0][x].walkable = true;
      newGrid[0][x].data = {
        x, y: 0,
        section: 'Entrance',
        type: 'service',
        color: 'bg-white border-gray-300',
        icon: <div className="absolute inset-0 flex items-center justify-center text-xs">🚪</div>
      };
    }

    setGrid(newGrid);
  }, []);

  // A* Pathfinding Algorithm (same as before)
  const findPath = useCallback((start: Position, end: Position): Position[] => {
    if (!grid.length) return [];

    const heuristic = (a: Position, b: Position) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    const getKey = (pos: Position) => `${pos.x},${pos.y}`;

    const openSet: Position[] = [start];
    const cameFrom: Record<string, Position> = {};
    const gScore: Record<string, number> = {};
    const fScore: Record<string, number> = {};

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
      let current = openSet[0];
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (fScore[getKey(openSet[i])] < fScore[getKey(current)]) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      if (current.x === end.x && current.y === end.y) {
        const path: Position[] = [current];
        while (cameFrom[getKey(current)]) {
          current = cameFrom[getKey(current)];
          path.unshift(current);
        }
        return path;
      }

      openSet.splice(currentIndex, 1);

      const neighbors = [
        { x: current.x, y: current.y - 1 },
        { x: current.x, y: current.y + 1 },
        { x: current.x - 1, y: current.y },
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y - 1 },
        { x: current.x + 1, y: current.y - 1 },
        { x: current.x - 1, y: current.y + 1 },
        { x: current.x + 1, y: current.y + 1 },
      ].filter(pos => 
        pos.x >= 0 && pos.x < GRID_SIZE && 
        pos.y >= 0 && pos.y < GRID_SIZE &&
        grid[pos.y][pos.x].walkable
      );

      for (const neighbor of neighbors) {
        const neighborPos: Position = grid[neighbor.y][neighbor.x].data || {
          ...neighbor,
          section: `Aisle ${neighbor.x},${neighbor.y}`
        };
        const tentativeGScore = gScore[getKey(current)] + 
          (neighbor.x !== current.x && neighbor.y !== current.y ? 1.414 : 1);

        if (tentativeGScore < gScore[getKey(neighborPos)]) {
          cameFrom[getKey(neighborPos)] = current;
          gScore[getKey(neighborPos)] = tentativeGScore;
          fScore[getKey(neighborPos)] = tentativeGScore + heuristic(neighborPos, end);

          if (!openSet.some(pos => pos.x === neighborPos.x && pos.y === neighborPos.y)) {
            openSet.push(neighborPos);
          }
        }
      }
    }

    return [];
  }, [grid]);

  // Handle map click
  const handleMapClick = (x: number, y: number) => {
    if (!grid[y] || !grid[y][x]) return;

    const position = grid[y][x].data || {
      x,
      y,
      section: `Aisle ${x},${y}`
    };

    if (mode === 'start') {
      setCurrentPosition(position);
      setMode('destination');
      setVisitedSections([position.section]);
    } else {
      setDestination(position);
      if (currentPosition) {
        const newPath = findPath(currentPosition, position);
        setPath(newPath);
        setEstimatedTime(`${Math.ceil(newPath.length * 0.2)} min`);
      }
    }
  };

  // Move along the path (same as before)
  useEffect(() => {
    if (!isMoving || !path.length || !currentPosition || !destination) return;

    const moveInterval = setInterval(() => {
      setPath(prevPath => {
        if (prevPath.length <= 1) {
          clearInterval(moveInterval);
          setIsMoving(false);
          setCurrentPosition(destination);
          setVisitedSections(prev => [...prev, destination.section]);
          return [];
        }

        const newPath = [...prevPath];
        newPath.shift();
        const newPosition = newPath[0];
        setCurrentPosition(newPosition);
        setVisitedSections(prev => [...prev, newPosition.section]);

        return newPath;
      });
    }, MOVEMENT_SPEED);

    return () => clearInterval(moveInterval);
  }, [isMoving, path, currentPosition, destination]);

  // Reset path
  const resetPath = () => {
    setPath([]);
    setDestination(null);
    setIsMoving(false);
    setMode('start');
  };

  // Quick navigation
  const quickNavigate = (location: string) => {
    const locations: Record<string, Position> = {
      'Restrooms': getPositionBySection('Restrooms'),
      'Checkout': getPositionBySection('Checkout'),
      'Customer Service': getPositionBySection('Customer Service'),
      'Entrance': getPositionBySection('Entrance')
    };

    const dest = locations[location];
    if (!dest) return;

    if (!currentPosition) {
      setMode('destination');
      setDestination(dest);
      alert('Please first select your starting point on the map');
      return;
    }

    const newPath = findPath(currentPosition, dest);
    setDestination(dest);
    setPath(newPath);
    setEstimatedTime(`${Math.ceil(newPath.length * 0.2)} min`);
  };

  // Helper to find position by section name
  const getPositionBySection = (section: string): Position => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y] && grid[y][x].data?.section === section) {
          return grid[y][x].data!;
        }
      }
    }
    return { x: 1, y: 1, section: 'Unknown' };
  };

  // Get aisle coordinates for shopping items
  const getAisleCoordinates = (aisle: string): Position => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y] && grid[y][x].data?.section === aisle) {
          return grid[y][x].data!;
        }
      }
    }
    
    const aisleLetter = aisle.charAt(0);
    const aisleNumber = parseInt(aisle.slice(1)) || 1;
    const x = 3 + (aisleLetter.charCodeAt(0) - 65) * 3;
    const y = 2 + (aisleNumber - 1) * 5;
    
    return {
      x: Math.min(Math.max(x, 3), GRID_SIZE - 1),
      y: Math.min(Math.max(y, 2), GRID_SIZE - 1),
      section: aisle,
      type: 'aisle'
    };
  };

  return (
    <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Premium Store Navigation</h2>
              <p className="text-xs font-normal opacity-80">Interactive shopping assistant</p>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="flex items-center space-x-1.5 bg-white/20 text-white border-white/30 px-3 py-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{estimatedTime}</span>
            </Badge>
            <Button 
              size="sm" 
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm"
              onClick={resetPath}
            >
              <Navigation className="w-4 h-4 mr-1.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Instructions */}
        <div className="mb-4 p-3 bg-blue-50/80 rounded-lg border border-blue-200/80 backdrop-blur-sm shadow-inner">
          <p className="text-sm text-blue-800 font-medium flex items-center">
            {mode === 'start' ? (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 text-blue-600">
                  1
                </span>
                Click on the map to set your STARTING POSITION
              </>
            ) : (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 text-blue-600">
                  2
                </span>
                Now click to set your DESTINATION
              </>
            )}
          </p>
          {(currentPosition || destination) && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {currentPosition && (
                <div className="text-xs text-blue-700 bg-blue-100/50 px-2 py-1 rounded">
                  <span className="font-semibold">Current:</span> {currentPosition.section}
                </div>
              )}
              {destination && (
                <div className="text-xs text-blue-700 bg-blue-100/50 px-2 py-1 rounded">
                  <span className="font-semibold">Destination:</span> {destination.section}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Store Map */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 h-[500px] overflow-hidden border border-slate-200/80 shadow-inner">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-300 blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-purple-300 blur-xl"></div>
          </div>
          
          {/* Grid */}
          <div className="relative w-full h-full">
            {grid.map((row, y) => (
              <React.Fragment key={y}>
                {row.map((cell, x) => {
                  const isPath = path.some(p => p.x === x && p.y === y);
                  const isVisited = visitedSections.includes(cell.data?.section || '');
                  const isCurrent = currentPosition?.x === x && currentPosition?.y === y;
                  const isDest = destination?.x === x && destination?.y === y;
                  
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`absolute 
                        ${cell.data?.color || 'bg-white'} 
                        ${isPath ? 'bg-purple-100/60' : ''}
                        ${isVisited && !isPath ? 'bg-blue-50/70' : ''}
                        border ${cell.walkable ? 'border-white/80' : 'border-gray-300/80'}
                        ${cell.walkable ? 'cursor-pointer hover:bg-blue-100/50' : ''}
                        transition-all duration-200 ease-in-out
                        ${isCurrent ? 'z-20' : isDest ? 'z-20' : 'z-10'}
                        shadow-xs`}
                      style={{
                        left: `${x * CELL_SIZE}%`,
                        top: `${y * CELL_SIZE}%`,
                        width: `${CELL_SIZE}%`,
                        height: `${CELL_SIZE}%`,
                      }}
                      onClick={() => handleMapClick(x, y)}
                    >
                      {/* Cell content */}
                      <div className="absolute inset-0 overflow-hidden">
                        {cell.data?.icon && (
                          <div className={`absolute inset-0 flex items-center justify-center 
                            ${cell.data.section.includes('Aisle') ? 'text-blue-400/40' : 'text-gray-700'}`}>
                            {cell.data.icon}
                          </div>
                        )}
                        {cell.data?.section && !cell.data.section.includes('Aisle') && (
                          <div className="absolute bottom-0 left-0 right-0 text-[5px] text-center font-bold text-gray-600 truncate px-0.5">
                            {cell.data.section.split(' ')[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Path */}
            {path.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <marker 
                    id="arrowhead" 
                    markerWidth="8" 
                    markerHeight="6" 
                    refX="6" 
                    refY="3" 
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="url(#pathGradient)" />
                  </marker>
                </defs>
                <path
                  d={`M ${path[0].x * CELL_SIZE + CELL_SIZE/2}% ${path[0].y * CELL_SIZE + CELL_SIZE/2}% 
                    ${path.slice(1).map(p => `L ${p.x * CELL_SIZE + CELL_SIZE/2}% ${p.y * CELL_SIZE + CELL_SIZE/2}%`).join(' ')}`}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                  markerEnd="url(#arrowhead)"
                  strokeLinecap="round"
                />
                {path.map((point, index) => (
                  <circle
                    key={index}
                    cx={`${point.x * CELL_SIZE + CELL_SIZE/2}%`}
                    cy={`${point.y * CELL_SIZE + CELL_SIZE/2}%`}
                    r="1.2%"
                    fill="url(#pathGradient)"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
            )}

            {/* Current Position */}
            {currentPosition && (
              <div
                className="absolute w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-lg z-30 flex items-center justify-center text-white animate-pulse"
                style={{
                  left: `${currentPosition.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${currentPosition.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <LocateFixed className="w-4 h-4" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
              </div>
            )}

            {/* Destination */}
            {destination && (
              <div
                className="absolute w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full border-2 border-white shadow-lg z-30 flex items-center justify-center text-white"
                style={{
                  left: `${destination.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${destination.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Target className="w-4 h-4" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30"></div>
              </div>
            )}

            {/* Shopping List Items */}
            {shoppingList.filter(item => !item.found).map((item) => {
              const pos = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white shadow-md z-20 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    left: `${pos.x * CELL_SIZE + CELL_SIZE/2}%`,
                    top: `${pos.y * CELL_SIZE + CELL_SIZE/2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${item.name} (Aisle ${item.aisle})`}
                >
                  {item.name.charAt(0)}
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border border-red-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Legend */}
          {/* Interactive Legend */}
<div className={`absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 transition-all duration-300 ${
  showLegend ? 'p-4 w-52' : 'w-10 h-10 overflow-hidden'
}`}>
  <button 
    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
    onClick={() => setShowLegend(!showLegend)}
  >
    {showLegend ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
  </button>
  
  {showLegend && (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 mb-1">Map Legend</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white flex items-center justify-center shrink-0">
            <LocateFixed className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-gray-700">You</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-white flex items-center justify-center shrink-0">
            <Target className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-gray-700">Destination</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <span className="text-xs text-gray-700">Item</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-blue-100/80 rounded border border-blue-200 shrink-0"></div>
          <span className="text-xs text-gray-700">Visited</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-purple-100/70 rounded border border-purple-200 shrink-0"></div>
          <span className="text-xs text-gray-700">Path</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gray-300 rounded border border-gray-400 shrink-0"></div>
          <span className="text-xs text-gray-700">Wall</span>
        </div>
      </div>
    </div>
  )}
</div>
         
        {/* Controls */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button 
            variant={isMoving ? 'destructive' : 'default'}
            className="w-full h-11 shadow-sm"
            onClick={() => setIsMoving(!isMoving)}
            disabled={!path.length}
          >
            {isMoving ? (
              <>
                <Navigation className="w-4 h-4 mr-2 animate-pulse" />
                <span>Stop Navigation</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                <span>Start Navigation</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-11 shadow-sm border-gray-300 hover:border-blue-300"
            onClick={() => {
              if (currentPosition && destination) {
                const newPath = findPath(currentPosition, destination);
                setPath(newPath);
                setEstimatedTime(`${Math.ceil(newPath.length * 0.2)} min`);
              }
            }}
            disabled={!currentPosition || !destination}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span>Recalculate</span>
          </Button>
        </div>

        {/* Quick Navigation */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-800 flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Quick Navigation</span>
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Entrance')}
            >
              <span className="text-xl">🚪</span>
              <span className="text-xs font-medium">Entrance</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Checkout')}
            >
              <ShoppingCart className="w-5 h-5 text-green-600 group-hover:text-green-700" />
              <span className="text-xs font-medium">Checkout</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Customer Service')}
            >
              <AlertCircle className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
              <span className="text-xs font-medium">Service</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex-col space-y-1 h-auto py-3 hover:bg-teal-50 hover:border-teal-300 transition-all duration-200 group"
              onClick={() => quickNavigate('Restrooms')}
            >
              <span className="text-xl">🚻</span>
              <span className="text-xs font-medium">Restrooms</span>
            </Button>
          </div>
        </div>

        {/* Path Details */}
        {path.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50/70 to-purple-50/70 rounded-lg border border-blue-200/70 backdrop-blur-sm">
            <h4 className="font-bold text-blue-800 flex items-center space-x-2 mb-2">
              <Navigation className="w-4 h-4" />
              <span>Navigation Steps</span>
            </h4>
            <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
              {path.map((step, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 bg-white/90 p-2 rounded-lg border border-blue-200/70 shadow-xs flex items-center space-x-2"
                >
                  <span className="text-xs font-bold text-blue-600 bg-blue-100/50 rounded-full w-5 h-5 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs text-blue-800 font-medium">{step.section}</span>
                  {step.icon && (
                    <span className="text-xs opacity-70">
                      {step.icon}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
