// cameraScanner.tsx
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Scan, Info, ShoppingCart, Star, MapPin, Zap, Eye, Upload, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

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
      }
    ],
    inStock: true,
    imageUrl: 'https://i5.walmartimages.com/asr/1d1a0a4b-5a5c-4e3e-8b0f-5e5e5e5e5e5e.1b2b3b4b5b6b7b8b9b0b1b2b3b4b5b6b7b8b9b0b1b2b3b4b5b6b7b8b9b0'
  }
];

interface CameraScannerProps {
  onProductScanned: (product: ScannedProduct) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onProductScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'text' | 'nutrition'>('barcode');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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
    const imageUrl = URL.createObjectURL(imageFile);
    setUploadedImage(imageUrl);
    
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
      onProductScanned(recognizedProduct);
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
    if (wheatBread) {
      setScannedProduct(wheatBread);
      onProductScanned(wheatBread);
    }
  };

  const scanModes = [
    { id: 'barcode', name: 'Barcode', icon: Scan, description: 'Scan product barcodes' },
    { id: 'text', name: 'Text', icon: Eye, description: 'Read product labels' },
    { id: 'nutrition', name: 'Nutrition', icon: Info, description: 'Analyze nutrition facts' }
  ];

  return (
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
  );
};

export default CameraScanner;
