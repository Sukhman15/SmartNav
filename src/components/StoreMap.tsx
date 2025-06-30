import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Navigation, Clock, AlertCircle, Zap, Target,
  ChevronRight, LocateFixed, ShoppingCart, Milk, Beef, Apple,
  Pill, Shirt, Home, ToyBrick, BookOpen, RefreshCw
} from 'lucide-react';

type Position = {
  x: number;
  y: number;
  section: string;
  type?: 'department' | 'aisle' | 'service';
  icon?: React.ReactNode;
};

interface StoreMapProps {
  shoppingList: Array<{ id: number; name: string; found: boolean; aisle: string; price: number }>;
}

const GRID_SIZE = 30; // Larger grid for more complex layout
const CELL_SIZE = 3.33; // Adjusted for larger grid
const MOVEMENT_SPEED = 200; // ms between moves

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
  const [productMarkers, setProductMarkers] = useState<Array<{id: number, name: string, position: Position}>>([
    { id: 1, name: 'Organic Apples', position: { x: 1, y: 3, section: 'Produce' } },
    { id: 2, name: 'Almond Milk', position: { x: 3, y: 7, section: 'Dairy' } },
    { id: 3, name: 'Whole Wheat Bread', position: { x: 4, y: 3, section: 'Bakery' } }
  ]);

  // Department icons
  const departmentIcons: Record<string, React.ReactNode> = {
    'Produce': <Apple className="w-3 h-3" />,
    'Dairy': <Milk className="w-3 h-3" />,
    'Meat': <Beef className="w-3 h-3" />,
    'Bakery': <span className="text-xs">🥖</span>,
    'Pharmacy': <Pill className="w-3 h-3" />,
    'Clothing': <Shirt className="w-3 h-3" />,
    'Home Goods': <Home className="w-3 h-3" />,
    'Electronics': <span className="text-xs">📱</span>,
    'Toys': <ToyBrick className="w-3 h-3" />,
    'Books': <BookOpen className="w-3 h-3" />,
    'Checkout': <ShoppingCart className="w-3 h-3" />,
    'Customer Service': <AlertCircle className="w-3 h-3" />,
    'Restrooms': <span className="text-xs">🚻</span>
  };

  // Initialize grid with complex layout
  useEffect(() => {
    const newGrid: {x: number, y: number, walkable: boolean, data?: Position}[][] = [];
    
    // Create empty grid
    for (let y = 0; y < GRID_SIZE; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push({ x, y, walkable: true });
      }
      newGrid.push(row);
    }

    // Helper function to create sections
    const createSection = (x1: number, y1: number, x2: number, y2: number, section: string, walkable = false) => {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          if (newGrid[y] && newGrid[y][x]) {
            newGrid[y][x].walkable = walkable;
            newGrid[y][x].data = {
              x, y, 
              section,
              type: walkable ? 'aisle' : 'department',
              icon: departmentIcons[section]
            };
          }
        }
      }
    };

    // Create main aisles (vertical)
    for (let x = 3; x <= 27; x += 3) {
      for (let y = 2; y <= 25; y++) {
        if (y !== 10 && y !== 20) { // Cross aisles at y=10 and y=20
          newGrid[y][x].walkable = true;
          newGrid[y][x].data = {
            x, y,
            section: `Aisle ${String.fromCharCode(65 + Math.floor(x/3))}${Math.floor(y/5) + 1}`,
            type: 'aisle'
          };
        }
      }
    }

    // Create cross aisles (horizontal)
    for (let y = 10; y <= 20; y += 10) {
      for (let x = 1; x <= 28; x++) {
        if (x % 3 !== 0) { // Don't overwrite vertical aisles
          newGrid[y][x].walkable = true;
          newGrid[y][x].data = {
            x, y,
            section: `Cross Aisle ${y === 10 ? 'A' : 'B'}`,
            type: 'aisle'
          };
        }
      }
    }

    // Create departments
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

    // Add some obstacles
    createSection(15, 15, 17, 17, 'Display', false);
    createSection(22, 5, 24, 7, 'Kiosk', false);

    setGrid(newGrid);
    
    // Set entrance as default starting position
    const entrancePosition = { x: 5, y: 29, section: 'Entrance' };
    setCurrentPosition(entrancePosition);
    setVisitedSections([entrancePosition.section]);
  }, []);

  // A* Pathfinding Algorithm
  const findPath = useCallback((start: Position, end: Position): Position[] => {
    if (!grid.length) return [];

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

      // Check neighbors (including diagonals)
      const neighbors = [
        { x: current.x, y: current.y - 1 }, // up
        { x: current.x, y: current.y + 1 }, // down
        { x: current.x - 1, y: current.y }, // left
        { x: current.x + 1, y: current.y }, // right
        { x: current.x - 1, y: current.y - 1 }, // up-left
        { x: current.x + 1, y: current.y - 1 }, // up-right
        { x: current.x - 1, y: current.y + 1 }, // down-left
        { x: current.x + 1, y: current.y + 1 }, // down-right
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
          (neighbor.x !== current.x && neighbor.y !== current.y ? 1.414 : 1); // Diagonal cost

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

    return []; // No path found
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

  // Move along the path
  useEffect(() => {
    if (!isMoving || !path.length || !currentPosition || !destination) return;

    const moveInterval = setInterval(() => {
      setPath(prevPath => {
        if (prevPath.length <= 1) {
          clearInterval(moveInterval);
          setIsMoving(false);
          setCurrentPosition(destination);
          setVisitedSections(prev => [...prev, destination.section]);
          
          // Check if we reached a product marker
          const reachedProduct = productMarkers.find(p => 
            p.position.x === destination.x && p.position.y === destination.y
          );
          
          if (reachedProduct) {
            // Remove the reached product marker
            setProductMarkers(prev => 
              prev.filter(p => !(p.position.x === destination.x && p.position.y === destination.y))
            );
            
            // Find next product marker to navigate to
            const nextProduct = productMarkers.find(p => 
              !(p.position.x === destination.x && p.position.y === destination.y)
            );
            
            if (nextProduct) {
              const newPath = findPath(destination, nextProduct.position);
              setDestination(nextProduct.position);
              setPath(newPath);
              setEstimatedTime(`${Math.ceil(newPath.length * 0.2)} min`);
              setIsMoving(true);
            }
          }
          
          return [];
        }

        const newPath = [...prevPath];
        newPath.shift(); // Remove first step
        const newPosition = newPath[0];
        setCurrentPosition(newPosition);
        setVisitedSections(prev => [...prev, newPosition.section]);

        return newPath;
      });
    }, MOVEMENT_SPEED);

    return () => clearInterval(moveInterval);
  }, [isMoving, path, currentPosition, destination, productMarkers, findPath]);

  // Create initial path to first product when grid is loaded
  useEffect(() => {
    if (grid.length > 0 && currentPosition && productMarkers.length > 0) {
      const firstProduct = productMarkers[0];
      const newPath = findPath(currentPosition, firstProduct.position);
      setDestination(firstProduct.position);
      setPath(newPath);
      setEstimatedTime(`${Math.ceil(newPath.length * 0.2)} min`);
    }
  }, [grid, currentPosition, productMarkers, findPath]);

  // Reset path
  const resetPath = () => {
    setPath([]);
    setDestination(null);
    setIsMoving(false);
    setMode('start');
    // Reset product markers
    setProductMarkers([
      { id: 1, name: 'Organic Apples', position: { x: 1, y: 3, section: 'Produce' } },
      { id: 2, name: 'Almond Milk', position: { x: 3, y: 7, section: 'Dairy' } },
      { id: 3, name: 'Whole Wheat Bread', position: { x: 4, y: 3, section: 'Bakery' } }
    ]);
    // Reset to entrance
    const entrancePosition = { x: 5, y: 29, section: 'Entrance' };
    setCurrentPosition(entrancePosition);
    setVisitedSections([entrancePosition.section]);
  };

  // Quick navigation
  const quickNavigate = (location: string) => {
    const locations: Record<string, Position> = {
      'Restrooms': getPositionBySection('Restrooms'),
      'Checkout': getPositionBySection('Checkout'),
      'Customer Service': getPositionBySection('Customer Service')
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
    // Try to find exact aisle match first
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y] && grid[y][x].data?.section === aisle) {
          return grid[y][x].data!;
        }
      }
    }
    
    // Fallback to approximate position based on aisle number
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
              onClick={resetPath}
            >
              <Navigation className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Instructions */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">
            {mode === 'start' ? (
              '👉 First, click on the map to set your STARTING POSITION'
            ) : (
              '👉 Now click to set your DESTINATION'
            )}
          </p>
          {currentPosition && (
            <p className="text-xs text-blue-700 mt-1">
              Current: {currentPosition.section} (X: {currentPosition.x}, Y: {currentPosition.y})
            </p>
          )}
          {destination && (
            <p className="text-xs text-blue-700 mt-1">
              Destination: {destination.section} (X: {destination.x}, Y: {destination.y})
            </p>
          )}
        </div>

        {/* Store Map */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 h-[500px] overflow-hidden border-2 border-slate-200 shadow-inner">
          {/* Grid */}
          <div className="relative w-full h-full">
            {grid.map((row, y) => (
              <React.Fragment key={y}>
                {row.map((cell, x) => {
                  const isPath = path.some(p => p.x === x && p.y === y);
                  const isVisited = visitedSections.includes(cell.data?.section || '');
                  
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`absolute 
                        ${cell.walkable ? 
                          isVisited ? 'bg-blue-50/70' : 'bg-white/70' : 
                          'bg-gray-300/70'}
                        ${isPath ? 'bg-purple-100/50' : ''}
                        border border-gray-100
                        ${cell.walkable ? 'cursor-pointer hover:bg-blue-100/70' : ''}
                        transition-colors duration-200`}
                      style={{
                        left: `${x * CELL_SIZE}%`,
                        top: `${y * CELL_SIZE}%`,
                        width: `${CELL_SIZE}%`,
                        height: `${CELL_SIZE}%`,
                      }}
                      onClick={() => handleMapClick(x, y)}
                    >
                      {cell.data?.icon && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                          {cell.data.icon}
                        </div>
                      )}
                      {cell.data?.section && (
                        <div className="absolute bottom-0 left-0 right-0 text-[5px] text-center font-bold text-gray-600 truncate">
                          {cell.data.section.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                {path.map((point, index) => (
                  <circle
                    key={index}
                    cx={`${point.x * CELL_SIZE + CELL_SIZE/2}%`}
                    cy={`${point.y * CELL_SIZE + CELL_SIZE/2}%`}
                    r="1%"
                    fill="url(#pathGradient)"
                  />
                ))}
              </svg>
            )}

            {/* Current Position */}
            {currentPosition && (
              <div
                className="absolute w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-white shadow-xl z-20 flex items-center justify-center text-white"
                style={{
                  left: `${currentPosition.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${currentPosition.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <LocateFixed className="w-4 h-4" />
              </div>
            )}

            {/* Destination */}
            {destination && (
              <div
                className="absolute w-6 h-6 bg-gradient-to-br from-green-500 to-green-700 rounded-full border-2 border-white shadow-xl z-20 flex items-center justify-center text-white"
                style={{
                  left: `${destination.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${destination.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Target className="w-4 h-4" />
              </div>
            )}

            {/* Shopping List Items */}
            {shoppingList.filter(item => !item.found).map((item) => {
              const pos = getAisleCoordinates(item.aisle);
              return (
                <div
                  key={item.id}
                  className="absolute w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-white shadow-lg z-15 flex items-center justify-center text-white text-xs"
                  style={{
                    left: `${pos.x * CELL_SIZE + CELL_SIZE/2}%`,
                    top: `${pos.y * CELL_SIZE + CELL_SIZE/2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${item.name} (Aisle ${item.aisle})`}
                >
                  {item.name.charAt(0)}
                </div>
              );
            })}

            {/* Product Markers */}
            {productMarkers.map((product) => (
              <div
                key={product.id}
                className="absolute w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full border-2 border-white shadow-lg z-15 flex items-center justify-center text-white text-xs"
                style={{
                  left: `${product.position.x * CELL_SIZE + CELL_SIZE/2}%`,
                  top: `${product.position.y * CELL_SIZE + CELL_SIZE/2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={product.name}
              >
                {product.name.split(' ').map(word => word[0]).join('')}
              </div>
            ))}
          </div>

          {/* Interactive Legend */}
          <div className={`absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50 transition-all duration-300 ${showLegend ? '' : 'w-8 h-8 overflow-hidden'}`}>
            <button 
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setShowLegend(!showLegend)}
            >
              {showLegend ? '×' : '?'}
            </button>
            
            {showLegend && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border border-white flex items-center justify-center">
                    <LocateFixed className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-700">You</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-700 rounded-full border border-white flex items-center justify-center">
                    <Target className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-700">Destination</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full border border-white flex items-center justify-center text-white text-xs">
                    A
                  </div>
                  <span className="text-gray-700">Item</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full border border-white flex items-center justify-center text-white text-xs">
                    OA
                  </div>
                  <span className="text-gray-700">Product</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 rounded border border-blue-200"></div>
                  <span className="text-gray-700">Visited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-100 rounded border border-purple-200"></div>
                  <span className="text-gray-700">Path</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded border border-gray-400"></div>
                  <span className="text-gray-700">Wall</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button 
            variant={isMoving ? 'destructive' : 'default'}
            className="w-full"
            onClick={() => setIsMoving(!isMoving)}
            disabled={!path.length}
          >
            {isMoving ? (
              <>
                <Navigation className="w-4 h-4 mr-2 animate-pulse" />
                Stop Moving
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Start Moving
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
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
            Recalculate Path
          </Button>
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
              <span className="text-xl">🚻</span>
              <span className="text-xs font-medium">Restrooms</span>
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
              <span className="text-xs font-medium">Help</span>
            </Button>
          </div>
        </div>

        {/* Path Details */}
        {path.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 flex items-center space-x-2 mb-2">
              <Navigation className="w-4 h-4" />
              <span>Navigation Path</span>
            </h4>
            <div className="flex overflow-x-auto pb-2 space-x-2">
              {path.map((step, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 bg-white/80 p-2 rounded-lg border border-blue-200 shadow-xs flex items-center space-x-2"
                >
                  <span className="text-xs font-bold text-blue-600">{index + 1}.</span>
                  <span className="text-xs text-blue-800">{step.section}</span>
                  {step.icon && (
                    <span className="text-xs">
                      {step.icon}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreMap;
