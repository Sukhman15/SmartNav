
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
