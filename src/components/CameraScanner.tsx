
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Scan, Info, ShoppingCart, Star, MapPin, Zap, Eye } from 'lucide-react';

interface ScannedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  aisle: string;
  nutritionScore: string;
  ingredients: string[];
  alternatives: Array<{
    name: string;
    price: number;
    savings: number;
  }>;
  inStock: boolean;
}

const CameraScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'text' | 'nutrition'>('barcode');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate product recognition after 3 seconds
      setTimeout(() => {
        simulateProductScan();
        stopScanning();
      }, 3000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
      // Simulate scan for demo purposes
      setTimeout(() => {
        simulateProductScan();
      }, 1000);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateProductScan = () => {
    const mockProduct: ScannedProduct = {
      id: 'prod-123',
      name: 'Great Value Organic Whole Wheat Bread',
      price: 3.49,
      rating: 4.3,
      reviews: 127,
      aisle: 'B7',
      nutritionScore: 'B+',
      ingredients: ['Organic whole wheat flour', 'Water', 'Organic cane sugar', 'Yeast', 'Sea salt', 'Organic sunflower oil'],
      alternatives: [
        { name: 'Dave\'s Killer Bread', price: 4.99, savings: -1.50 },
        { name: 'Store Brand Wheat', price: 2.99, savings: 0.50 },
        { name: 'Pepperidge Farm', price: 4.29, savings: -0.80 }
      ],
      inStock: true
    };
    setScannedProduct(mockProduct);
  };

  const handleAddToList = () => {
    if (scannedProduct) {
      console.log('Adding to shopping list:', scannedProduct.name);
      // This would integrate with the shopping list component
    }
  };

  const scanModes = [
    { id: 'barcode', name: 'Barcode', icon: Scan, description: 'Scan product barcodes' },
    { id: 'text', name: 'Text', icon: Eye, description: 'Read product labels' },
    { id: 'nutrition', name: 'Nutrition', icon: Info, description: 'Analyze nutrition facts' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Camera Interface */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Smart Scanner</span>
            <Badge variant="secondary" className="ml-auto">
              AI Vision Powered
            </Badge>
          </CardTitle>
          
          {/* Scan Mode Selector */}
          <div className="flex space-x-2 mt-4">
            {scanModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={scanMode === mode.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScanMode(mode.id as any)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="w-3 h-3" />
                  <span>{mode.name}</span>
                </Button>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {isScanning ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Scan className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">Scanning...</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Point camera at product</p>
                  <p className="text-sm opacity-75">
                    {scanModes.find(m => m.id === scanMode)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Start Scanning</span>
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="destructive">
                Stop Scanning
              </Button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Instant Recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-green-600" />
              <span>Nutrition Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span>Price Comparison</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-purple-600" />
              <span>Quick Add to List</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      <div className="space-y-6">
        {scannedProduct ? (
          <>
            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{scannedProduct.name}</span>
                  <Badge variant={scannedProduct.inStock ? "secondary" : "outline"}>
                    {scannedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ${scannedProduct.price}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{scannedProduct.rating}</span>
                    <span className="text-gray-500">({scannedProduct.reviews} reviews)</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Found in Aisle {scannedProduct.aisle}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button onClick={handleAddToList} className="flex-1">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to List
                  </Button>
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Nutrition Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span>Nutrition Score</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {scannedProduct.nutritionScore}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scannedProduct.ingredients.slice(0, 4).map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {scannedProduct.ingredients.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{scannedProduct.ingredients.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternatives */}
            <Card>
              <CardHeader>
                <CardTitle>Alternative Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scannedProduct.alternatives.map((alt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{alt.name}</h5>
                      <p className="text-sm text-gray-500">${alt.price}</p>
                    </div>
                    <Badge 
                      variant={alt.savings > 0 ? "secondary" : "outline"}
                      className={alt.savings > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                    >
                      {alt.savings > 0 ? `Save $${alt.savings.toFixed(2)}` : `+$${Math.abs(alt.savings).toFixed(2)}`}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Scan className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Scan</h3>
              <p className="text-gray-500 mb-4">
                Point your camera at any product to get instant information, 
                price comparisons, and smart recommendations.
              </p>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                <p>✓ Barcode scanning for product details</p>
                <p>✓ Text recognition for ingredients</p>
                <p>✓ Nutrition analysis and scoring</p>
                <p>✓ Price comparison with alternatives</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CameraScanner;
