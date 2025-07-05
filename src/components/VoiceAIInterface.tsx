import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, MicOff, Volume2, VolumeX, Brain, Activity, 
  Settings, Zap, MessageCircle, Headphones 
} from 'lucide-react';
import { aiService } from '../services/aiService';

interface VoiceMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  isPlaying?: boolean;
}

interface VoiceSettings {
  language: string;
  voice: string;
  speed: number;
  pitch: number;
  autoPlay: boolean;
}

const VoiceAIInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en-US',
    voice: 'default',
    speed: 1.0,
    pitch: 1.0,
    autoPlay: true
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    initializeVoiceInterface();
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    loadAvailableVoices();
  }, []);

  const initializeVoiceInterface = () => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis is not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = settings.language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = async (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          maxConfidence = Math.max(maxConfidence, confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      setConfidence(maxConfidence);

      if (finalTranscript) {
        await processVoiceCommand(finalTranscript, maxConfidence);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const loadAvailableVoices = () => {
    const voices = speechSynthesis.getVoices();
    setAvailableVoices(voices);

    // Set default voice
    const defaultVoice = voices.find(voice => voice.lang === 'en-US') || voices[0];
    if (defaultVoice) {
      setSettings(prev => ({ ...prev, voice: defaultVoice.name }));
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceCommand = async (command: string, confidence: number) => {
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now(),
      type: 'user',
      content: command,
      timestamp: new Date(),
      confidence
    };
    setMessages(prev => [...prev, userMessage]);

    // Process with AI service
    try {
      const aiResponse = await aiService.processMessage(command);
      
      const assistantMessage: VoiceMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        confidence: aiResponse.confidence
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if auto-play is enabled
      if (settings.autoPlay) {
        speakText(aiResponse.content);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorMessage: VoiceMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I didn't understand that. Could you please repeat?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      if (settings.autoPlay) {
        speakText(errorMessage.content);
      }
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesis) return;

    // Stop any current speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    synthesisRef.current = utterance;

    // Configure voice settings
    const selectedVoice = availableVoices.find(voice => voice.name === settings.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = settings.speed;
    utterance.pitch = settings.pitch;
    utterance.lang = settings.language;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Mark the message as playing
      setMessages(prev => 
        prev.map(msg => 
          msg.type === 'assistant' && msg.content === text 
            ? { ...msg, isPlaying: true }
            : msg
        )
      );
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Mark the message as not playing
      setMessages(prev => 
        prev.map(msg => ({ ...msg, isPlaying: false }))
      );
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-blue-600" />
            <span>Voice AI Assistant</span>
            <Badge variant="secondary" className="ml-auto">
              <Brain className="w-3 h-3 mr-1" />
              Speech AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              onClick={toggleVoice}
              className={`w-16 h-16 rounded-full ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="w-16 h-16 rounded-full"
            >
              <VolumeX className="w-6 h-6" />
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-sm font-medium">Listening</div>
              <div className={`text-lg ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
                {isListening ? '●' : '○'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium">Speaking</div>
              <div className={`text-lg ${isSpeaking ? 'text-blue-600' : 'text-gray-400'}`}>
                {isSpeaking ? '●' : '○'}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Transcript */}
      {isListening && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-600" />
              Live Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-medium">{transcript || 'Listening...'}</div>
              {confidence > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Confidence:</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
                    {getConfidenceLabel(confidence)} ({(confidence * 100).toFixed(1)}%)
                  </span>
                  <Progress value={confidence * 100} className="w-20 h-1" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Voice Conversation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-xs ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } ${message.isPlaying ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {message.confidence && (
                      <div className={`text-xs ${getConfidenceColor(message.confidence)}`}>
                        {(message.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1 mt-1"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium">Voice</label>
              <select
                value={settings.voice}
                onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1 mt-1"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium">Speed: {settings.speed}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speed}
                onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                className="w-full mt-1"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium">Pitch: {settings.pitch}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => setSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                className="w-full mt-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoPlay"
              checked={settings.autoPlay}
              onChange={(e) => setSettings(prev => ({ ...prev, autoPlay: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="autoPlay" className="text-sm">Auto-play AI responses</label>
          </div>
        </CardContent>
      </Card>

      {/* Quick Voice Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">"Find organic apples"</div>
              <div className="text-gray-600">Product search</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">"What's the price?"</div>
              <div className="text-gray-600">Price check</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">"Show nutrition info"</div>
              <div className="text-gray-600">Nutrition details</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">"Add to my list"</div>
              <div className="text-gray-600">Shopping list</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAIInterface; 