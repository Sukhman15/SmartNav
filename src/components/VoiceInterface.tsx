
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
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (isActive && 'webkitSpeechRecognition' in window) {
      startListening();
    } else {
      stopListening();
    }
  }, [isActive]);

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript("Find organic apples");
      handleVoiceCommand("Find organic apples");
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
    setResponse('');
  };

  const handleVoiceCommand = (command: string) => {
    // Simulate AI processing
    setTimeout(() => {
      const response = generateVoiceResponse(command);
      setResponse(response);
      
      // Simulate text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const generateVoiceResponse = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('find') && lowerCommand.includes('apple')) {
      return "I found organic apples in aisle A3 for $4.99 per pound. They're currently on sale. Would you like me to add them to your shopping list and navigate you there?";
    }
    
    if (lowerCommand.includes('where') || lowerCommand.includes('location')) {
      return "You're currently at the main entrance. I can guide you to any section or product. What are you looking for?";
    }
    
    if (lowerCommand.includes('price') || lowerCommand.includes('cost')) {
      return "I can check prices for you. What product would you like me to look up?";
    }
    
    if (lowerCommand.includes('recipe') || lowerCommand.includes('cook')) {
      return "I'd be happy to suggest recipes! Based on your preferences, I can recommend healthy, quick meals. What type of cuisine interests you?";
    }
    
    return "I'm here to help with your shopping. You can ask me to find products, check prices, get directions, or suggest recipes. What would you like to do?";
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
