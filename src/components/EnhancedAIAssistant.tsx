import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Mic, MicOff, Send, Camera, Languages, Brain, Zap } from 'lucide-react';
import { enhancedAIService, EnhancedAIResponse } from '../services/enhancedAIService';
import { ScannedProduct, productDatabase } from './productData';
import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/mobilenet';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sentiment?: string;
    detectedLanguage?: string;
    intent?: string;
    mlInsights?: any;
  };
  type?: 'product_card'; // Added for product card messages
  product?: ScannedProduct; // Added for product card messages
}

interface EnhancedAIAssistantProps {
  onProductRecognized?: (product: ScannedProduct) => void;
  onAddToShoppingList?: (product: ScannedProduct) => void;
}

// 1. Add ProductInfoCard component
const ProductInfoCard: React.FC<{ product: ScannedProduct }> = ({ product }) => {
  const nutrition = product.nutritionFacts;
  return (
    <div className="rounded-lg border p-4 bg-white shadow-md max-w-md">
      <div className="font-bold text-lg mb-2">{product.name}</div>
      <div className="mb-1">Aisle: <span className="font-semibold">{product.aisle}</span></div>
      <div className="mb-1">Price: <span className="font-semibold">${product.price.toFixed(2)}</span></div>
      <div className="mb-1">Nutrition:</div>
      <ul className="ml-4 text-sm">
        <li>Calories: {nutrition.calories}</li>
        <li>Protein: {nutrition.protein}g</li>
        <li>Carbs: {nutrition.carbs}g</li>
        <li>Fiber: {nutrition.fiber}g</li>
        <li>Sugar: {nutrition.sugar}g</li>
        <li>Sodium: {nutrition.sodium}mg</li>
      </ul>
      <div className="mt-2 text-sm">{product.description}</div>
    </div>
  );
};

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({
  onProductRecognized,
  onAddToShoppingList
}) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [model, setModel] = useState<any>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [showMLInsights, setShowMLInsights] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLanguage]);

  // Load TensorFlow.js MobileNet model
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      try {
        await tf.ready();
        const mobilenetModel = await load();
        setModel(mobilenetModel);
        console.log('MobileNet model loaded successfully');
      } catch (error) {
        console.error('Error loading MobileNet model:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `${t('welcome')} ${t('help')}`,
      sender: 'assistant',
      timestamp: new Date(),
      metadata: {
        detectedLanguage: i18n.language,
        intent: 'greeting',
        confidence: 1.0
      }
    };
    setMessages([welcomeMessage]);
  }, [t, i18n.language]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      console.log('Processing message:', content);
      
      // Process message with enhanced AI service
      const response = await enhancedAIService.processMessage(content);
      
      console.log('AI Response:', response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          confidence: response.confidence,
          sentiment: response.metadata?.sentiment,
          detectedLanguage: response.metadata?.detectedLanguage,
          intent: response.metadata?.intent,
          mlInsights: response.mlInsights
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle actions
      if (response.action === 'add_to_list' && response.metadata?.products && response.metadata.products.length > 0) {
        const product = response.metadata.products[0];
        if (onAddToShoppingList) {
          onAddToShoppingList(product);
        }
      }

      // Handle product recognition
      if (response.metadata?.products && response.metadata.products.length > 0) {
        const product = response.metadata.products[0];
        if (onProductRecognized) {
          onProductRecognized(product);
        }
      }

      // Text-to-speech for assistant response
      if (synthesisRef.current && response.metadata?.detectedLanguage) {
        const utterance = new SpeechSynthesisUtterance(response.content);
        utterance.lang = response.metadata.detectedLanguage;
        utterance.rate = 0.9;
        synthesisRef.current.speak(utterance);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!model) {
      alert('AI model is still loading. Please wait a moment.');
      return;
    }

    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Classify image using MobileNet
      const predictions = await model.classify(img);
      console.log('Image classification results:', predictions);

      // Find best matching product
      const bestMatch = findBestProductMatch(predictions);
      
      if (bestMatch) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `I scanned an image. The AI detected: ${bestMatch.name}`,
          sender: 'user',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Add product card message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'product_card',
          product: bestMatch,
          content: '', // Fix: required by Message type
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            confidence: 1.0,
            detectedLanguage: currentLanguage,
            intent: 'product_info',
            mlInsights: undefined
          }
        };

        setMessages(prev => [...prev, assistantMessage]);

        if (onProductRecognized) {
          onProductRecognized(bestMatch);
        }
      } else {
        const noMatchMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: t('noProductFound'),
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, noMatchMessage]);
      }

    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('error'),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const findBestProductMatch = (predictions: any[]): ScannedProduct | null => {
    const keywords = predictions.map(p => p.className.toLowerCase());
    console.log('MobileNet predictions:', predictions);
    console.log('Extracted keywords:', keywords);
    
    // Enhanced matching with multiple strategies
    let bestMatch: ScannedProduct | null = null;
    let bestScore = 0;

    for (const product of productDatabase) {
      const productWords = product.name.toLowerCase().split(/\s+/);
      let score = 0;

      // Strategy 1: Direct keyword matching
      for (const keyword of keywords) {
        for (const word of productWords) {
          if (keyword.includes(word) || word.includes(keyword)) {
            score += 3;
            console.log(`Direct match: ${keyword} matches ${word} for ${product.name}`);
          }
        }
      }

      // Strategy 2: Category matching with expanded keywords
      const categoryKeywords: { [key: string]: string[] } = {
        'apple': ['fruit', 'produce', 'organic', 'red', 'green', 'fuji', 'gala'],
        'banana': ['fruit', 'produce', 'yellow', 'banana'],
        'strawberry': ['fruit', 'produce', 'berry', 'berries', 'red'],
        'spinach': ['vegetable', 'greens', 'leafy', 'green'],
        'carrot': ['vegetable', 'orange', 'root'],
        'bread': ['bakery', 'grain', 'wheat', 'loaf', 'baked'],
        'yogurt': ['dairy', 'milk', 'cultured', 'white', 'container'],
        'almond': ['nut', 'nuts', 'almond', 'brown'],
        'peanut': ['nut', 'nuts', 'peanut', 'brown'],
        'chicken': ['meat', 'poultry', 'protein', 'white'],
        'salmon': ['fish', 'seafood', 'protein', 'pink', 'orange'],
        'tea': ['beverage', 'drink', 'herbal', 'green'],
        'olive': ['oil', 'liquid', 'bottle'],
        'chickpea': ['bean', 'legume', 'grain', 'round'],
        'flour': ['powder', 'white', 'baking'],
        'cinnamon': ['spice', 'brown', 'powder']
      };

      for (const [productType, categories] of Object.entries(categoryKeywords)) {
        if (product.name.toLowerCase().includes(productType)) {
          for (const category of categories) {
            if (keywords.some(k => k.includes(category))) {
              score += 2;
              console.log(`Category match: ${category} matches for ${product.name}`);
            }
          }
        }
      }

      // Strategy 3: Confidence-based scoring
      for (let i = 0; i < Math.min(predictions.length, 3); i++) {
        const prediction = predictions[i];
        if (prediction.probability > 0.3) { // Only consider high confidence predictions
          const keyword = prediction.className.toLowerCase();
          for (const word of productWords) {
            if (keyword.includes(word) || word.includes(keyword)) {
              score += prediction.probability * 5; // Weight by confidence
              console.log(`Confidence match: ${keyword} (${prediction.probability}) matches ${word} for ${product.name}`);
            }
          }
        }
      }

      // Strategy 4: Visual characteristics matching
      const visualKeywords: { [key: string]: string[] } = {
        'apple': ['red', 'round', 'fruit'],
        'banana': ['yellow', 'curved', 'fruit'],
        'strawberry': ['red', 'small', 'fruit'],
        'bread': ['brown', 'rectangular', 'baked'],
        'yogurt': ['white', 'container', 'dairy'],
        'spinach': ['green', 'leafy', 'vegetable'],
        'carrot': ['orange', 'long', 'vegetable']
      };

      for (const [productType, visualTraits] of Object.entries(visualKeywords)) {
        if (product.name.toLowerCase().includes(productType)) {
          for (const trait of visualTraits) {
            if (keywords.some(k => k.includes(trait))) {
              score += 1;
              console.log(`Visual match: ${trait} matches for ${product.name}`);
            }
          }
        }
      }

      console.log(`Total score for ${product.name}: ${score}`);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = product;
      }
    }

    console.log(`Best match: ${bestMatch?.name} with score: ${bestScore}`);
    return bestScore > 0.5 ? bestMatch : null;
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  };

  const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'hi': '🇮🇳',
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪'
    };
    return flags[lang] || '🌐';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-gray-50">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          {t('aiAssistant')}
          <Badge variant="secondary" className="ml-2">
            {t('mlEnhanced')}
          </Badge>
        </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMLInsights(!showMLInsights)}
              className="flex items-center gap-1"
            >
              <Zap className="h-4 w-4" />
              {t('mlInsights')}
            </Button>
            <div className="flex gap-1">
              {['en', 'hi', 'fr', 'es', 'de'].map(lang => (
                <Button
                  key={lang}
                  variant={currentLanguage === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeLanguage(lang)}
                  className="w-8 h-8 p-0"
                >
                  {getLanguageFlag(lang)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 bg-gray-50">
        <ScrollArea className="flex-1 border rounded-lg p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-sm border bg-white`} // Uniform bubble style
                >
                  {message.type === 'product_card' && message.product ? (
                    <ProductInfoCard product={message.product} />
                  ) : (
                    <div className="text-sm">{message.content}</div>
                  )}
                  
                  {showMLInsights && message.metadata?.mlInsights && (
                    <div className="mt-2 text-xs opacity-75">
                      <div>{t('confidence')}: {(message.metadata.mlInsights.intentConfidence * 100).toFixed(1)}%</div>
                      <div>{t('sentiment')}: {message.metadata.mlInsights.sentimentScore}</div>
                      <div>{t('language')}: {message.metadata.mlInsights.languageDetection.name}</div>
                      <div>{t('responseTime')}: {message.metadata.mlInsights.responseTime}ms</div>
                    </div>
                  )}
                  
                  {message.metadata?.detectedLanguage && (
                    <div className="mt-1 text-xs opacity-60">
                      {getLanguageFlag(message.metadata.detectedLanguage)} {message.metadata.detectedLanguage.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 bg-gray-50 pt-2 pb-2 rounded-b-lg">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCameraCapture}
            disabled={isModelLoading || isProcessing}
            title="Scan product"
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            disabled={isProcessing}
            className={isListening ? 'bg-red-500 text-white' : ''}
            title="Voice input"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('typeMessage')}
            disabled={isProcessing}
            className="flex-1"
          />

          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {isModelLoading && (
          <div className="text-center text-sm text-gray-500">
            {t('loadingModels')}
          </div>
        )}

        {isProcessing && (
          <div className="text-center text-sm text-gray-500">
            {t('processing')}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedAIAssistant; 