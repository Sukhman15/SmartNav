import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Zap, Send, Mic, Camera, ShoppingCart, MapPin, Star } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm your AI shopping assistant. I can help you find products, check prices, get nutritional info, and optimize your shopping route. What can I help you with today?",
      timestamp: new Date(),
      suggestions: ['Find organic products', 'Check item availability', 'Get recipe suggestions', 'Compare prices']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const assistantMessage: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
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
  
  if (lowerInput.includes('whole wheat bread') && (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('aisle'))) {
    return {
      content: "Wholee wheat bread is located in Aisle C2. Current stock level: 8/50 (low stock).",
      suggestions: ['Navigate to Aisle C2', 'Find alternatives', 'Check other bread options']
    };
  }
  
  if (lowerInput.includes('almond milk') && (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('aisle'))) {
    return {
      content: "Almond milk is located in Aisle C2. Current stock level: 0/30 (out of stock). Would you like me to check nearby stores or suggest alternatives?",
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
    if (lowerInput.includes('whole wheat bread') || lowerInput.includes('wheat bread')) {
      return {
        content: `Nutrition Information for whole Wheat Bread:
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
    
    if (lowerInput.includes('whole wheat bread')) {
      return {
        content: "Whole wheat bread current stock level: 8/50 (16% in stock, low availability). Would you like me to check if more is available in the back?",
        suggestions: ['Check back stock', 'Find alternatives', 'Notify when restocked']
      };
    }
    
    if (lowerInput.includes('almond milk')) {
      return {
        content: "Almond milk current stock level: 0/30 (out of stock). Expected restock tomorrow morning.",
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


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Chat Interface */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>AI Shopping Assistant</span>
              <Badge variant="secondary" className="ml-auto">
                Smart AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={message.type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                        {message.type === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-lg px-4 py-2 ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-100 text-green-600">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about shopping..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span>Smart Product Search</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Store Navigation</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Star className="w-4 h-4 text-yellow-600" />
              <span>Personalized Recommendations</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Visual Recognition</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to List
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              Find Item
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              Get Recipe
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Smart Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-600 space-y-2">
              <p>• 15% savings available with current coupons</p>
              <p>• 3 items on sale in your list</p>
              <p>• Alternative brands could save $8.50</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;

  
