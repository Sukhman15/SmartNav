# SmartNav - AI-Powered Shopping Assistant

A comprehensive React-based shopping assistant with advanced AI/ML capabilities, multi-language support, and intelligent product recognition.

## 🚀 Features

### 🤖 Advanced AI/ML Capabilities
- **Multi-Language Support**: Chat in English, Hindi, French, Spanish, German, Chinese, Japanese, and Arabic
- **Real-time Language Detection**: Automatically detects user's language and responds accordingly
- **Sentiment Analysis**: Analyzes user sentiment to provide personalized responses
- **Intent Classification**: Advanced NLP to understand user intentions with confidence scoring
- **Context Awareness**: Maintains conversation context and user preferences
- **Dynamic Response Generation**: Contextual responses based on conversation history

### 📱 Core Features
- **Product Recognition**: TensorFlow.js MobileNet integration for image-based product identification
- **Voice Interface**: Speech-to-text and text-to-speech capabilities
- **Smart Navigation**: AI-powered store navigation and aisle recommendations
- **Shopping List Management**: Intelligent list management with product suggestions
- **Price Comparison**: Real-time price tracking and alternative suggestions
- **Nutrition Analysis**: Detailed nutritional information and dietary recommendations

### 🎯 ML/AI Technologies Used
- **TensorFlow.js**: Client-side image classification with MobileNet
- **Natural Language Processing**: Custom NLP engine with intent classification
- **Sentiment Analysis**: Keyword-based sentiment scoring
- **Language Detection**: Character pattern and word-based language identification
- **Context Management**: Conversation memory and user preference tracking

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartnav
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📦 Dependencies

### Core Dependencies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

### AI/ML Dependencies
- **@tensorflow/tfjs**: TensorFlow.js for client-side ML
- **@tensorflow-models/mobilenet**: Pre-trained MobileNet model for image classification
- **i18next**: Internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection

### UI Components
- **shadcn/ui**: Modern, accessible UI components
- **Lucide React**: Beautiful icons
- **React Router**: Client-side routing

## 🏗️ Project Structure

```
src/
├── components/
│   ├── EnhancedAIAssistant.tsx    # Main AI chatbot with ML capabilities
│   ├── CameraScanner.tsx          # Product scanning interface
│   ├── ShoppingList.tsx           # Shopping list management
│   ├── ProductRecommendations.tsx # AI-powered recommendations
│   ├── StoreMap.tsx              # Interactive store navigation
│   ├── UserPreferences.tsx       # User settings and preferences
│   └── ui/                       # Reusable UI components
├── services/
│   └── enhancedAIService.ts      # Advanced AI service with ML features
├── i18n/
│   └── config.ts                 # Multi-language configuration
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── pages/                        # Application pages
```

## 🤖 AI/ML Features Deep Dive

### 1. Multi-Language Support
The AI assistant supports 8 languages with automatic detection:
- **English** 🇺🇸
- **Hindi** 🇮🇳
- **French** 🇫🇷
- **Spanish** 🇪🇸
- **German** 🇩🇪
- **Chinese** 🇨🇳
- **Japanese** 🇯🇵
- **Arabic** 🇸🇦

**Language Detection Methods:**
- Character pattern recognition (Devanagari, Chinese, Japanese, Arabic scripts)
- Word-based detection using common phrases and greetings
- Confidence scoring for language identification

### 2. Advanced NLP Engine
**Intent Classification:**
- Greeting/Farewell detection
- Product search and navigation
- Price comparison requests
- Nutrition information queries
- Recipe suggestions
- Shopping list management
- Language change requests

**Sentiment Analysis:**
- Positive/negative/neutral classification
- Keyword-based scoring system
- Context-aware sentiment tracking

### 3. TensorFlow.js Integration
**Image Classification:**
- MobileNet model for product recognition
- Real-time image processing
- Confidence-based product matching
- Fallback mechanisms for unrecognized items

**Product Matching Algorithm:**
- Direct keyword matching
- Fuzzy string matching
- Category-based classification
- Multi-pass matching strategy

### 4. Voice Interface
**Speech Recognition:**
- Web Speech API integration
- Multi-language speech input
- Real-time transcription
- Error handling and fallbacks

**Text-to-Speech:**
- Natural language voice output
- Language-specific voice synthesis
- Adjustable speech rate and pitch

## 🎮 Usage Examples

### Multi-Language Chat
```
User (Hindi): "मुझे सेब कहाँ मिलेंगे?"
AI: "सेब A2 एसल में मिलेंगे। क्या आप ऑर्गेनिक सेब चाहते हैं?"

User (French): "Où puis-je trouver du pain?"
AI: "Le pain se trouve dans l'allée B7. Voulez-vous du pain complet ou blanc?"
```

### Product Recognition
1. Click the camera icon
2. Upload or capture an image
3. AI analyzes the image using MobileNet
4. Matches detected objects to products in database
5. Provides detailed product information

### Voice Commands
```
"Find organic apples"
"Add bread to my shopping list"
"What's the price of yogurt?"
"Show me healthy alternatives"
"Change language to Hindi"
```

## 🔧 Configuration

### Language Settings
Languages can be changed via:
- UI language selector buttons
- Voice commands
- Automatic detection based on user input

### AI Model Configuration
- MobileNet model loads automatically on app start
- Model version tracking for updates
- Fallback mechanisms for offline scenarios

### User Preferences
- Dietary restrictions
- Budget preferences
- Organic product preferences
- Language preferences

## 🚀 Performance Features

### Optimization
- Lazy loading of AI models
- Efficient image processing
- Cached language detection
- Optimized response generation

### Real-time Processing
- Instant language detection
- Quick intent classification
- Fast image recognition
- Responsive voice interface

## 🔮 Future Enhancements

### Planned Features
- **Advanced ML Models**: Integration with more sophisticated NLP models
- **Personalization**: Machine learning-based user preference learning
- **Predictive Analytics**: Shopping pattern analysis and recommendations
- **Augmented Reality**: AR-powered product identification
- **Offline Support**: Local ML model caching for offline use

### Technical Improvements
- **Model Optimization**: Smaller, faster ML models
- **Better Accuracy**: Enhanced product recognition algorithms
- **More Languages**: Support for additional languages
- **Voice Enhancement**: Better speech recognition accuracy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- TensorFlow.js team for client-side ML capabilities
- MobileNet model contributors
- i18next community for internationalization support
- shadcn/ui for beautiful UI components

---

**Built with ❤️ using React, TypeScript, and TensorFlow.js**
