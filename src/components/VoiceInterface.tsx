import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageCircle } from 'lucide-react';

interface VoiceInterfaceProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ isActive, onToggle }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isActive && 'webkitSpeechRecognition' in window) {
      startListening();
      if (!hasInitialized) {
        // Set default question and answer
        const defaultQuestion = "Where is almond milk?";
        setTranscript(defaultQuestion);
        handleVoiceCommand(defaultQuestion);
        setHasInitialized(true);
      }
    } else {
      stopListening();
    }
  }, [isActive]);

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const sampleCommands = [
        "Where can I find organic apples?",
        "What's the nutrition info for wide wheat bread?",
        "Is almond milk in stock?",
        "Find greek yogurt",
        "Show me healthy options"
      ];
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      setTranscript(randomCommand);
      handleVoiceCommand(randomCommand);
    }, 2000);
  };


  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
    setResponse('');
    setSuggestions([]);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();
    
    // Product location questions
    if (lowerInput.includes('organic apples') && (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('aisle'))) {
      return {
        content: "Organic apples are located in Aisle C2. Current stock level: 45/100.",
        suggestions: ['Navigate to Aisle C2', 'Check other organic fruits', 'Add to shopping list']
      };
    }
    
    if (lowerInput.includes('wide wheat bread') && (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('aisle'))) {
      return {
        content: "Wide wheat bread is located in Aisle C2. Current stock level: 8/50 (low stock).",
        suggestions: ['Navigate to Aisle C2', 'Find alternatives', 'Check other bread options']
      };
    }
    
    if (lowerInput.includes('almond milk') && (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('aisle'))) {
      return {
        content: "Almond milk is located in Aisle C2. Current stock level: 5/30 (low stock). Would you like me to check nearby stores or suggest alternatives?",
        suggestions: ['Check nearby stores', 'Find alternatives', 'Notify when restocked']
      };
    }
    
    if (lowerInput.includes('greek yogurt') && (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('aisle'))) {
      return {
        content: "Greek yogurt is located in Aisle C2. Current stock level: 25/40.",
        suggestions: ['Navigate to Aisle C2', 'Check flavors available', 'Add to shopping list']
      };
    }
    
    // Nutrition information
    if (lowerInput.includes('nutrition') || lowerInput.includes('calories') || lowerInput.includes('ingredients')) {
      if (lowerInput.includes('wide wheat bread') || lowerInput.includes('wheat bread')) {
        return {
          content: `Nutrition Information for Wide Wheat Bread:
          B+ Nutrition Score
          Calories: 110 per slice
          Protein: 4g
          Carbs: 22g
          Fat: 1.5g
          Fiber: 3g
          Sugar: 3g
          
          Ingredients:
          Organic whole wheat flour
          Water
          Organic cane sugar
          Yeast
          Sea salt
          Organic sunflower oil
          
          Allergens: Wheat`,
          suggestions: ['Compare with other breads', 'Check gluten-free options', 'Find recipes using this bread']
        };
      }
      
      if (lowerInput.includes('organic apples')) {
        return {
          content: `Nutrition Information for Organic Apples:
          A Nutrition Score
          Calories: 95 per medium apple
          Protein: 0.5g
          Carbs: 25g
          Fat: 0.3g
          Fiber: 4g
          Sugar: 19g (natural)
          
          Rich in vitamin C and antioxidants`,
          suggestions: ['Compare with other fruits', 'Find apple recipes', 'Check organic certification']
        };
      }
      
      if (lowerInput.includes('almond milk')) {
        return {
          content: `Nutrition Information for Almond Milk (unsweetened):
          A- Nutrition Score
          Calories: 30 per cup
          Protein: 1g
          Carbs: 1g
          Fat: 2.5g
          Fiber: 1g
          Sugar: 0g
          
          Ingredients:
          Filtered water
          Almonds
          Calcium carbonate
          Sea salt
          Potassium citrate
          Sunflower lecithin
          Vitamin E acetate
          Vitamin D2
          
          Allergens: Tree nuts (almonds)`,
          suggestions: ['Compare with dairy milk', 'Check sweetened version', 'Find other plant-based milks']
        };
      }
      
      if (lowerInput.includes('greek yogurt')) {
        return {
          content: `Nutrition Information for Greek Yogurt (plain, non-fat):
          A Nutrition Score
          Calories: 100 per 170g
          Protein: 18g
          Carbs: 6g
          Fat: 0g
          Fiber: 0g
          Sugar: 4g (natural lactose)
          
          Ingredients:
          Cultured pasteurized non-fat milk
          Live active cultures
          
          Excellent source of protein and probiotics`,
          suggestions: ['Compare with regular yogurt', 'Check flavored options', 'Find yogurt-based recipes']
        };
      }
    }
    
    // Stock level questions
    if (lowerInput.includes('stock') || lowerInput.includes('available') || lowerInput.includes('quantity')) {
      if (lowerInput.includes('organic apples')) {
        return {
          content: "Organic apples current stock level: 45/100 (45% in stock).",
          suggestions: ['Reserve some apples', 'Check delivery options', 'Find similar products']
        };
      }
      
      if (lowerInput.includes('wide wheat bread')) {
        return {
          content: "Wide wheat bread current stock level: 8/50 (16% in stock, low availability). Would you like me to check if more is available in the back?",
          suggestions: ['Check back stock', 'Find alternatives', 'Notify when restocked']
        };
      }
      
      if (lowerInput.includes('almond milk')) {
        return {
          content: "Almond milk current stock level: 5/30 (low stock). Expected restock tomorrow morning.",
          suggestions: ['Check nearby stores', 'Find alternatives', 'Notify when restocked']
        };
      }
      
      if (lowerInput.includes('greek yogurt')) {
        return {
          content: "Greek yogurt current stock level: 25/40 (62% in stock).",
          suggestions: ['Reserve some yogurt', 'Check flavors available', 'Add to shopping list']
        };
      }
    }
    
    // Default responses for other queries
    if (lowerInput.includes('organic') || lowerInput.includes('healthy')) {
      return {
        content: "Great choice! I found several organic options for you. The organic produce section is in Aisle A3, and we have fresh organic apples on sale for $4.99/lb. Would you like me to add these to your list and show you the quickest route?",
        suggestions: ['Add to shopping list', 'Show me more organic options', 'Check nutritional info', 'Find recipe ideas']
      };
    }
    
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('cheap')) {
      return {
        content: "I can help you find the best deals! Currently, we have price matches available on several items. The Great Value brand offers 20-30% savings compared to name brands. Would you like me to show you budget-friendly alternatives for your list?",
        suggestions: ['Show price comparisons', 'Find store coupons', 'Check weekly deals', 'Budget optimization']
      };
    }
    
    if (lowerInput.includes('recipe') || lowerInput.includes('cook') || lowerInput.includes('meal')) {
      return {
        content: "I'd love to help with meal planning! Based on your dietary preferences, I can suggest recipes and automatically add all ingredients to your shopping list. What type of cuisine are you in the mood for?",
        suggestions: ['Quick 30-min meals', 'Healthy dinner ideas', 'Budget-friendly recipes', 'Dietary restriction meals']
      };
    }
    
    if (lowerInput.includes('find') || lowerInput.includes('where') || lowerInput.includes('location')) {
      return {
        content: "I can help you locate any item in the store! Just tell me what you're looking for, and I'll show you the exact aisle and provide turn-by-turn navigation. I can also check if it's currently in stock.",
        suggestions: ['Navigate to item', 'Check stock levels', 'Find alternatives', 'Add to route']
      };
    }
    
    return {
      content: "I understand you're looking for assistance with your shopping. I can help you find products, compare prices, check nutritional information, get recipe suggestions, and navigate the store efficiently. What specific help do you need?",
      suggestions: ['Product search', 'Price comparison', 'Store navigation', 'Recipe ideas']
    };
  };

  const handleVoiceCommand = (command: string) => {
    const { content, suggestions } = generateAIResponse(command);
    setResponse(content);
    setSuggestions(suggestions || []);
    
    // Simulate text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleVoice = () => {
    onToggle(!isActive);
  };

  // Simulate audio level animation
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);


  // ... [rest of the component code remains exactly the same until the return statement]

  return (
    <>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleVoice}
          size="lg"
          className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
            isActive 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isActive ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Voice Interface Panel */}
      {isActive && (
        <div className="fixed bottom-24 right-6 z-40">
          <Card className="w-80 shadow-xl border-2">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Voice Assistant</span>
                </div>
                <Badge variant={isListening ? "default" : "secondary"}>
                  {isListening ? 'Listening...' : 'Ready'}
                </Badge>
              </div>

              {/* Audio Visualization */}
              <div className="flex items-center justify-center mb-4 h-16">
                <div className="flex items-end space-x-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 bg-blue-500 rounded-t transition-all duration-100 ${
                        isListening ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        height: isListening 
                          ? `${Math.max(8, (audioLevel + i * 10) % 40)}px` 
                          : '8px' 
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">"{transcript}"</p>
                  </div>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Volume2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">{response}</p>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8 px-2"
                        onClick={() => handleVoiceCommand(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="text-xs text-gray-500 text-center">
                <p className="mb-1">
                  {isListening 
                    ? "Speak now... I'm listening for your command" 
                    : "Tap the microphone to start voice commands"
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-1 text-[10px]">
                  <span>"Find products"</span>
                  <span>"Check prices"</span>
                  <span>"Get directions"</span>
                  <span>"Recipe ideas"</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVoice}
                  className="flex items-center space-x-2"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop Voice</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default VoiceInterface;
