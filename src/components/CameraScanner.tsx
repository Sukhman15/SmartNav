import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Scan, Info, ShoppingCart, Star, MapPin, Zap, Eye, Upload, Loader2 } from 'lucide-react';

interface ScannedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  aisle: string;
  nutritionScore: string;
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  ingredients: string[];
  allergens: string[];
  alternatives: Array<{
    name: string;
    price: number;
    savings: number;
    rating: number;
    nutritionScore: string;
  }>;
  recommendedPairings: Array<{
    name: string;
    reason: string;
  }>;
  inStock: boolean;
  imageUrl: string;
}

const productDatabase: ScannedProduct[] = [
  {
    id: 'prod-123',
    name: 'Great Value Organic Whole Wheat Bread',
    price: 3.49,
    rating: 4.3,
    reviews: 127,
    aisle: 'B7',
    nutritionScore: 'B+',
    nutritionFacts: {
      calories: 110,
      protein: 4,
      carbs: 22,
      fat: 1.5,
      fiber: 3,
      sugar: 3,
      sodium: 180
    },
    ingredients: [
      'Organic whole wheat flour', 
      'Water', 
      'Organic cane sugar', 
      'Yeast', 
      'Sea salt', 
      'Organic sunflower oil'
    ],
    allergens: ['Wheat'],
    alternatives: [
      { 
        name: 'Dave\'s Killer Bread Organic 21 Whole Grains', 
        price: 4.99, 
        savings: -1.50,
        rating: 4.7,
        nutritionScore: 'A-'
      },
      { 
        name: 'Nature\'s Own 100% Whole Wheat', 
        price: 3.29, 
        savings: 0.20,
        rating: 4.2,
        nutritionScore: 'B+'
      },
      { 
        name: 'Sara Lee 100% Whole Wheat', 
        price: 3.49, 
        savings: 0.00,
        rating: 4.0,
        nutritionScore: 'B'
      },
      { 
        name: 'Pepperidge Farm Whole Grain', 
        price: 4.29, 
        savings: -0.80,
        rating: 4.2,
        nutritionScore: 'B+'
      }
    ],
    recommendedPairings: [
      {
        name: 'Organic Peanut Butter',
        reason: 'High in protein, complements whole grains'
      },
      {
        name: 'Local Honey',
        reason: 'Natural sweetener that pairs well with whole wheat'
      },
      {
        name: 'Avocado',
        reason: 'Healthy fats that balance the carbohydrates'
      }
    ],
    inStock: true,
    imageUrl: 'https://i5.walmartimages.com/asr/1d1a0a4b-5a5c-4e3e-8b0f-5e5e5e5e5e5e.1b2b3b4b5b6b7b8b9b0b1b2b3b4b5b6b7b8b9b0b1b2b3b4b5b6b7b8b9b0'
  }
];

const CameraScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'text' | 'nutrition'>('barcode');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<ScannedProduct[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setTimeout(() => {
        simulateProductScan();
        stopScanning();
      }, 3000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
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

  const recognizeProductFromImage = async (imageFile: File) => {
    // Create URL for the uploaded image to display it
    const imageUrl = URL.createObjectURL(imageFile);
    setUploadedImage(imageUrl);
    
    // Always return the wheat bread product for testing
    const wheatBread = productDatabase.find(p => p.id === 'prod-123');
    return new Promise<ScannedProduct>((resolve) => {
      setTimeout(() => {
        resolve(wheatBread || productDatabase[0]);
      }, 1500);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const recognizedProduct = await recognizeProductFromImage(file);
      setScannedProduct(recognizedProduct);
    } catch (error) {
      console.error('Error recognizing product:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const simulateProductScan = () => {
    const wheatBread = productDatabase.find(p => p.id === 'prod-123');
    setScannedProduct(wheatBread || productDatabase[0]);
  };

  const handleAddToList = () => {
    if (scannedProduct) {
      setShoppingList(prev => [...prev, scannedProduct]);
      console.log('Added to shopping list:', scannedProduct.name);
      // You could add a toast notification here
    }
  };

  const handleAddAlternative = (product: ScannedProduct['alternatives'][0]) => {
    const altProduct = {
      ...scannedProduct!,
      name: product.name,
      price: product.price,
      nutritionScore: product.nutritionScore
    };
    setShoppingList(prev => [...prev, altProduct]);
    console.log('Added alternative to list:', product.name);
  };

  const handleAddPairing = (pairing: ScannedProduct['recommendedPairings'][0]) => {
    console.log('Added pairing to list:', pairing.name);
    // You would add your pairing product lookup logic here
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Scan className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">Scanning...</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : scannedProduct ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded product"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <img 
                    src={scannedProduct.imageUrl} 
                    alt={scannedProduct.name}
                    className="object-contain w-full h-full"
                  />
                )}
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
              <>
                <Button onClick={startScanning} className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Scan</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  accept="image/*"
                  className="hidden"
                  id="product-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center space-x-2"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isUploading ? 'Processing...' : 'Upload'}</span>
                </Button>
              </>
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
                    ${scannedProduct.price.toFixed(2)}
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

            {/* Nutrition Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Nutrition Information</span>
                  <Badge variant="secondary" className="ml-auto">
                    {scannedProduct.nutritionScore} Score
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Calories</p>
                    <p className="font-medium">{scannedProduct.nutritionFacts.calories}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Protein</p>
                    <p className="font-medium">{scannedProduct.nutritionFacts.protein}g</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Carbs</p>
                    <p className="font-medium">{scannedProduct.nutritionFacts.carbs}g</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Fat</p>
                    <p className="font-medium">{scannedProduct.nutritionFacts.fat}g</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Fiber</p>
                    <p className="font-medium">{scannedProduct.nutritionFacts.fiber}g</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Sugar</p>
                    <p className="font-medium">{scannedProduct.nutritionFacts.sugar}g</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scannedProduct.ingredients.slice(0, 6).map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {scannedProduct.ingredients.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{scannedProduct.ingredients.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {scannedProduct.allergens.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Allergens:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scannedProduct.allergens.map((allergen, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alternatives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Alternative Options</span>
                  <Badge variant="outline" className="text-xs">
                    {scannedProduct.alternatives.length} choices
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scannedProduct.alternatives.map((alt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium truncate">{alt.name}</h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{alt.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {alt.nutritionScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <div className="font-medium">${alt.price.toFixed(2)}</div>
                      <Badge 
                        variant={alt.savings > 0 ? "secondary" : "outline"}
                        className={alt.savings > 0 ? "bg-green-100 text-green-700 text-xs" : "bg-red-100 text-red-700 text-xs"}
                      >
                        {alt.savings > 0 ? `Save $${alt.savings.toFixed(2)}` : `+$${Math.abs(alt.savings).toFixed(2)}`}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={() => handleAddAlternative(alt)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Pairings */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Pairings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scannedProduct.recommendedPairings.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-gray-100 rounded-md p-2 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-gray-500 mt-1">{item.reason}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddPairing(item)}
                    >
                      Add
                    </Button>
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
                Scan or upload an image of any product to get instant information, 
                price comparisons, and smart recommendations.
              </p>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                <p>✓ Barcode scanning for product details</p>
                <p>✓ Text recognition for ingredients</p>
                <p>✓ Nutrition analysis and scoring</p>
                <p>✓ Price comparison with alternatives</p>
                <p>✓ Allergen detection</p>
                <p>✓ Recommended pairings</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CameraScanner;
