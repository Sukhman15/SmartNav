// Enhanced AI Service with Advanced ML and Product Knowledge
import { ScannedProduct, productDatabase } from '../components/productData';

// Language detection and translation
interface LanguageInfo {
  code: string;
  name: string;
  confidence: number;
}

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

// Enhanced AI Response with ML features
export interface EnhancedAIResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  action?: 'navigate' | 'add_to_list' | 'compare' | 'recipe' | 'nutrition' | 'translate' | 'help' | 'search' | 'recommend';
  metadata?: {
    productId?: string;
    aisle?: string;
    price?: number;
    alternatives?: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    detectedLanguage?: string;
    intent?: string;
    context?: any;
    products?: ScannedProduct[];
  };
  mlInsights?: {
    intentConfidence: number;
    sentimentScore: number;
    languageDetection: LanguageInfo;
    responseTime: number;
    modelVersion: string;
  };
}

// Conversation context with memory
interface ConversationContext {
  userHistory: string[];
  assistantHistory: string[];
  currentLanguage: string;
  userPreferences: {
    dietary: string[];
    budget: 'low' | 'medium' | 'high';
    organic: boolean;
    language: string;
  };
  shoppingList: string[];
  sessionStart: Date;
  conversationTurns: number;
  lastProducts: ScannedProduct[];
}

// Multi-language support
const supportedLanguages = {
  'en': { name: 'English', flag: '🇺🇸' },
  'hi': { name: 'Hindi', flag: '🇮🇳' },
  'fr': { name: 'French', flag: '🇫🇷' },
  'es': { name: 'Spanish', flag: '🇪🇸' },
  'de': { name: 'German', flag: '🇩🇪' },
  'zh': { name: 'Chinese', flag: '🇨🇳' },
  'ja': { name: 'Japanese', flag: '🇯🇵' },
  'ar': { name: 'Arabic', flag: '🇸🇦' }
};

// Language-specific responses and patterns
const languagePatterns = {
  'en': {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    farewells: ['bye', 'goodbye', 'see you', 'thank you', 'thanks'],
    affirmations: ['yes', 'yeah', 'sure', 'okay', 'alright', 'correct'],
    negations: ['no', 'nope', 'not', "don't", 'never', 'wrong']
  },
  'hi': {
    greetings: ['नमस्ते', 'हैलो', 'सुप्रभात', 'शुभ दिन', 'शुभ संध्या'],
    farewells: ['अलविदा', 'फिर मिलेंगे', 'धन्यवाद', 'शुक्रिया'],
    affirmations: ['हाँ', 'बिल्कुल', 'ठीक है', 'सही'],
    negations: ['नहीं', 'नही', 'मत', 'गलत']
  },
  'fr': {
    greetings: ['bonjour', 'salut', 'bonsoir', 'coucou', 'bonne journée'],
    farewells: ['au revoir', 'salut', 'merci', 'à bientôt', 'adieu'],
    affirmations: ['oui', 'd\'accord', 'bien sûr', 'ok', 'exact'],
    negations: ['non', 'pas', 'ne', 'jamais', 'incorrect']
  }
};

// Add language keywords for detection
const languageKeywords = {
  fr: ["où", "quel", "combien", "le", "la", "des", "du", "est-ce", "avec", "dans", "montrez-moi", "comparez"],
  es: ["donde", "cual", "cuanto", "el", "la", "de", "es", "con", "en", "muestrame", "compara"],
  de: ["wo", "was", "wie", "der", "die", "das", "ist", "mit", "im", "zeigen", "vergleichen"]
};

// Product knowledge base with synonyms and categories
const productKnowledge = {
  categories: {
    'fruits': ['apple', 'banana', 'strawberry', 'berries', 'fruit', 'organic fruit'],
    'vegetables': ['spinach', 'carrot', 'vegetable', 'greens', 'organic vegetable'],
    'dairy': ['yogurt', 'milk', 'cheese', 'dairy', 'greek yogurt'],
    'dairy_alternatives': ['almond milk', 'oat milk', 'soy milk', 'plant milk'],
    'grains': ['bread', 'oats', 'oatmeal', 'whole wheat', 'grain'],
    'proteins': ['chicken', 'salmon', 'fish', 'meat', 'protein'],
    'snacks': ['almonds', 'peanut butter', 'nuts', 'snack'],
    'beverages': ['tea', 'green tea', 'drink', 'beverage'],
    'condiments': ['olive oil', 'oil', 'sauce', 'condiment'],
    'frozen': ['frozen berries', 'frozen fruit', 'frozen food'],
    'canned': ['chickpeas', 'beans', 'canned food'],
    'baking': ['flour', 'baking', 'bake'],
    'spices': ['cinnamon', 'spice', 'seasoning']
  },
  synonyms: {
    'apple': ['apples', 'fuji', 'gala', 'honeycrisp'],
    'banana': ['bananas'],
    'strawberry': ['strawberries', 'berries'],
    'spinach': ['greens', 'leafy greens'],
    'carrot': ['carrots'],
    'yogurt': ['greek yogurt', 'yoghurt'],
    'milk': ['almond milk', 'dairy milk'],
    'bread': ['whole wheat bread', 'sliced bread'],
    'oats': ['oatmeal', 'rolled oats'],
    'chicken': ['chicken breast', 'poultry'],
    'salmon': ['fish', 'wild salmon'],
    'almonds': ['almond', 'nuts'],
    'peanut butter': ['peanut butter', 'pb'],
    'tea': ['green tea', 'herbal tea'],
    'olive oil': ['evoo', 'olive oil'],
    'chickpeas': ['garbanzo beans', 'chick peas'],
    'flour': ['all purpose flour', 'wheat flour'],
    'cinnamon': ['ground cinnamon', 'cinnamon spice']
  },
  attributes: {
    'organic': ['organic', 'natural', 'pesticide-free'],
    'gluten_free': ['gluten-free', 'gluten free', 'no gluten'],
    'vegan': ['vegan', 'plant-based', 'dairy-free'],
    'low_carb': ['low-carb', 'low carb', 'keto'],
    'high_protein': ['high protein', 'protein-rich', 'protein'],
    'budget': ['cheap', 'inexpensive', 'affordable', 'budget-friendly'],
    'premium': ['expensive', 'premium', 'high-end', 'luxury']
  }
};

// Advanced NLP with ML capabilities
class AdvancedNLP {
  // Enhanced language detection
  detectLanguage(text: string): LanguageInfo {
    const patterns = {
      'hi': /[\u0900-\u097F]/g, // Devanagari script
      'zh': /[\u4E00-\u9FFF]/g, // Chinese characters
      'ja': /[\u3040-\u309F\u30A0-\u30FF]/g, // Japanese characters
      'ar': /[\u0600-\u06FF]/g, // Arabic script
      'ko': /[\uAC00-\uD7AF]/g, // Korean characters
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return { code: lang, name: supportedLanguages[lang as keyof typeof supportedLanguages]?.name || lang, confidence: 0.95 };
      }
    }

    // Keyword-based detection for fr, es, de
    const lower = text.toLowerCase();
    for (const [lang, keywords] of Object.entries(languageKeywords)) {
      if (keywords.some(word => lower.includes(word))) {
        return { code: lang, name: supportedLanguages[lang as keyof typeof supportedLanguages]?.name || lang, confidence: 0.9 };
      }
    }

    // Enhanced word-based detection (fallback)
    const words = lower.split(/\s+/);
    const languageScores: { [key: string]: number } = {};

    for (const [lang, patterns] of Object.entries(languagePatterns)) {
      let score = 0;
      for (const word of words) {
        if (patterns.greetings.includes(word) || patterns.farewells.includes(word) || 
            patterns.affirmations.includes(word) || patterns.negations.includes(word)) {
          score += 1;
        }
      }
      languageScores[lang] = score / Math.max(words.length, 1);
    }

    const detectedLang = Object.entries(languageScores)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      code: detectedLang[0],
      name: supportedLanguages[detectedLang[0] as keyof typeof supportedLanguages]?.name || detectedLang[0],
      confidence: detectedLang[1]
    };
  }

  // Advanced sentiment analysis
  analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } {
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'like', 
      'helpful', 'thanks', 'thank you', 'awesome', 'fantastic', 'delicious', 'healthy',
      'fresh', 'organic', 'natural', 'tasty', 'yummy', 'satisfied', 'happy'
    ];
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'dislike', 'wrong', 'error', 'problem', 
      'issue', 'not working', 'expensive', 'cheap', 'poor', 'disappointed', 'sick',
      'unhealthy', 'artificial', 'processed', 'tasteless', 'bland'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    for (const word of words) {
      if (positiveWords.includes(word)) positiveScore += 1;
      if (negativeWords.includes(word)) negativeScore += 1;
    }

    const totalScore = positiveScore - negativeScore;
    
    if (totalScore > 0) return { sentiment: 'positive', score: totalScore };
    if (totalScore < 0) return { sentiment: 'negative', score: Math.abs(totalScore) };
    return { sentiment: 'neutral', score: 0 };
  }

  // Advanced intent classification with product knowledge
  classifyIntent(text: string, context: ConversationContext): { intent: string; confidence: number; entities: any } {
    const lowerText = text.toLowerCase();
    const entities: any = {};

    // Enhanced intent classification
    const intents = [
      { name: 'greeting', keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'], confidence: 0.9 },
      { name: 'farewell', keywords: ['bye', 'goodbye', 'see you', 'thank you', 'thanks'], confidence: 0.9 },
      { name: 'find_product', keywords: ['where', 'find', 'location', 'aisle', 'section', 'locate', 'place', 'spot', 'which aisle', 'which section', 'which location', 'in which'], confidence: 0.8 },
      { name: 'check_price', keywords: ['price', 'cost', 'cheap', 'expensive', 'how much', 'costs', 'dollars'], confidence: 0.8 },
      { name: 'nutrition_info', keywords: ['nutrition', 'calories', 'ingredients', 'healthy', 'protein', 'fiber', 'vitamins'], confidence: 0.8 },
      { name: 'recipe', keywords: ['recipe', 'cook', 'meal', 'food', 'dish', 'make', 'prepare', 'cooking'], confidence: 0.8 },
      { name: 'add_to_list', keywords: ['add', 'list', 'shopping', 'buy', 'purchase', 'cart'], confidence: 0.7 },
      { name: 'compare', keywords: ['compare', 'difference', 'better', 'alternative', 'vs', 'versus', 'which'], confidence: 0.7 },
      { name: 'recommend', keywords: ['recommend', 'suggestion', 'best', 'top', 'popular', 'good'], confidence: 0.8 },
      { name: 'search', keywords: ['search', 'look for', 'find', 'available', 'show me'], confidence: 0.7 },
      { name: 'language_change', keywords: ['language', 'translate', 'hindi', 'french', 'spanish'], confidence: 0.9 },
      { name: 'help', keywords: ['help', 'assist', 'support', 'what can you do', 'how'], confidence: 0.8 }
    ];

    let bestIntent = { name: 'general', confidence: 0.5 };
    
    for (const intent of intents) {
      const matches = intent.keywords.filter(keyword => lowerText.includes(keyword));
      if (matches.length > 0) {
        const confidence = intent.confidence * (matches.length / intent.keywords.length);
        if (confidence > bestIntent.confidence) {
          bestIntent = { name: intent.name, confidence };
        }
      }
    }

    // Enhanced entity extraction with plural/singular and fuzzy matching
    for (const product of productDatabase) {
      const productName = product.name.toLowerCase();
      const productWords = productName.split(/\s+/);
      const singular = productName.replace(/s$/, '');
      const plural = productName.endsWith('s') ? productName : productName + 's';
      // Direct match
      if (
        lowerText.includes(productName) ||
        lowerText.includes(singular) ||
        lowerText.includes(plural)
      ) {
        entities.product = product.name;
        entities.productId = product.id;
        break;
      }
      // Fuzzy match for each word
      for (const word of productWords) {
        if (
          lowerText.includes(word) ||
          lowerText.includes(word.replace(/s$/, '')) ||
          lowerText.includes(word + 's')
        ) {
          entities.product = product.name;
          entities.productId = product.id;
          break;
        }
      }
      // Synonym match
      const synonyms = productKnowledge.synonyms[productName] || [];
      for (const synonym of synonyms) {
        if (
          lowerText.includes(synonym) ||
          lowerText.includes(synonym.replace(/s$/, '')) ||
          lowerText.includes(synonym + 's')
        ) {
          entities.product = product.name;
          entities.productId = product.id;
          break;
        }
      }
    }

    // Extract categories
    for (const [category, keywords] of Object.entries(productKnowledge.categories)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          entities.category = category;
          break;
        }
      }
    }

    // Extract dietary preferences
    for (const [preference, keywords] of Object.entries(productKnowledge.attributes)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          if (!entities.dietary) entities.dietary = [];
          entities.dietary.push(preference);
        }
      }
    }

    // Extract price ranges
    if (lowerText.includes('cheap') || lowerText.includes('budget') || lowerText.includes('inexpensive')) {
      entities.priceRange = 'low';
    }
    if (lowerText.includes('expensive') || lowerText.includes('premium') || lowerText.includes('high-end')) {
      entities.priceRange = 'high';
    }

    return { intent: bestIntent.name, confidence: bestIntent.confidence, entities };
  }

  // Advanced product search
  searchProducts(query: string, filters: any = {}): ScannedProduct[] {
    const lowerQuery = query.toLowerCase();
    const results: Array<ScannedProduct & { score: number }> = [];

    for (const product of productDatabase) {
      let score = 0;
      
      // Name matching
      if (product.name.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }
      
      // Category matching
      if (product.category.toLowerCase().includes(lowerQuery)) {
        score += 5;
      }
      
      // Tag matching
      for (const tag of product.tags) {
        if (tag.toLowerCase().includes(lowerQuery)) {
          score += 3;
        }
      }
      
      // Synonym matching
      const synonyms = productKnowledge.synonyms[product.name.toLowerCase()] || [];
      for (const synonym of synonyms) {
        if (synonym.includes(lowerQuery)) {
          score += 7;
        }
      }
      
      // Apply filters
      if (filters.organic && !product.name.toLowerCase().includes('organic')) {
        score = 0;
      }
      
      if (filters.category && product.category !== filters.category) {
        score = 0;
      }
      
      if (filters.maxPrice && product.price > filters.maxPrice) {
        score = 0;
      }
      
      if (score > 0) {
        results.push({ ...product, score });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  // Generate contextual responses
  generateResponse(intent: string, entities: any, context: ConversationContext, detectedLanguage: string): string {
    const responses: { [key: string]: { [key: string]: string[] } } = {
      'en': {
        greeting: [
          "Hello! I'm your AI shopping assistant with advanced ML capabilities. How can I help you today?",
          "Hi there! I can help you find products, compare prices, get nutrition info, and more. What would you like to do?",
          "Welcome! I'm here to make your shopping experience easier. What can I help you with?"
        ],
        farewell: [
          "Goodbye! Have a great shopping experience!",
          "See you later! Don't hesitate to ask if you need more help.",
          "Take care! Happy shopping!"
        ],
        find_product: [
          `I can help you find ${entities.product || 'products'} in the store. What specific item are you looking for?`,
          "I'll help you locate any product. Just tell me what you need!",
          "Let me guide you to the right aisle. What product are you searching for?"
        ],
        check_price: [
          "I can help you compare prices and find the best deals. What would you like to check?",
          "Let me show you price comparisons and alternatives. What's your budget?",
          "I'll find the most cost-effective options for you. What are you looking for?"
        ],
        nutrition_info: [
          "I can provide detailed nutrition information for any product. Which item would you like to know about?",
          "Let me show you the nutritional facts and health benefits. What product interests you?",
          "I'll help you make healthy choices. What nutritional information do you need?"
        ],
        recipe: [
          "I'd love to help with recipe suggestions! What type of cuisine are you interested in?",
          "Let me recommend some delicious recipes and add ingredients to your list. What are you craving?",
          "I can suggest meals based on your preferences. What kind of food do you enjoy?"
        ],
        recommend: [
          "I can recommend products based on your preferences. What are you looking for?",
          "Let me suggest some great options for you. What category interests you?",
          "I'll help you find the best products. What do you need recommendations for?"
        ],
        search: [
          "I can search our product database for you. What are you looking for?",
          "Let me find what you need. What product or category are you interested in?",
          "I'll search for the best options. What would you like to find?"
        ],
        language_change: [
          "I can help you in multiple languages. Which language would you prefer?",
          "I support Hindi, French, Spanish, and more. What language would you like to use?",
          "Let me switch to your preferred language. Which one would you like?"
        ],
        help: [
          "I can help you with:\n• Finding products and locations\n• Price comparisons\n• Nutrition information\n• Recipe suggestions\n• Product recommendations\n• Multi-language support\nWhat would you like to know?",
          "Here's what I can do:\n• Product search and navigation\n• Price optimization\n• Health and nutrition info\n• Meal planning\n• Language assistance\nHow can I help?"
        ],
        general: [
          "I'm here to help with your shopping! I can find products, check prices, nutrition info, and more. What would you like to know?",
          "How can I assist you today? I can help with product searches, price comparisons, recipes, and shopping recommendations.",
          "I'm your AI shopping assistant! I can help you find what you need, compare prices, and make healthy choices. What can I help you with?"
        ]
      },
      'hi': {
        greeting: [
          "नमस्ते! मैं आपकी AI शॉपिंग सहायक हूं। मैं आपकी कैसे मदद कर सकती हूं?",
          "हैलो! आपकी शॉपिंग में मदद करने के लिए तैयार हूं। आपको क्या चाहिए?",
          "स्वागत है! मैं आपको उत्पाद खोजने, कीमतों की तुलना करने में मदद कर सकती हूं।"
        ],
        find_product: [
          "मैं आपको स्टोर में उत्पाद खोजने में मदद कर सकती हूं। आप क्या ढूंढ रहे हैं?",
          "मैं आपको सही एसल में ले जाऊंगी। आप कौन सा उत्पाद खोज रहे हैं?"
        ],
        help: [
          "मैं आपकी मदद कर सकती हूं:\n• उत्पाद और स्थान खोजने में\n• कीमतों की तुलना\n• पोषण जानकारी\n• रेसिपी सुझाव\nक्या आप जानना चाहते हैं?"
        ],
        general: [
          "मैं आपकी शॉपिंग में मदद करने के लिए यहाँ हूं! मैं उत्पाद खोज सकती हूं, कीमतें बता सकती हूं, और अधिक। आप क्या जानना चाहते हैं?"
        ]
      },
      'fr': {
        greeting: [
          "Bonjour! Je suis votre assistant d'achat IA avec des capacités ML avancées.",
          "Salut! Prêt à vous aider avec vos achats. Que voulez-vous?",
          "Bienvenue! Je peux vous aider à trouver des produits et comparer les prix."
        ],
        find_product: [
          "Je peux vous aider à trouver des produits dans le magasin. Que cherchez-vous?",
          "Je vais vous guider vers le bon rayon. Quel produit recherchez-vous?"
        ],
        help: [
          "Je peux vous aider avec:\n• Trouver des produits et des emplacements\n• Comparer les prix\n• Informations nutritionnelles\n• Suggestions de recettes\nQue voulez-vous savoir?"
        ],
        general: [
          "Je suis là pour vous aider avec vos achats! Je peux trouver des produits, vérifier les prix, et plus encore. Que voulez-vous savoir?"
        ]
      }
    };

    const languageResponses = responses[detectedLanguage as keyof typeof responses] || responses['en'];
    const intentResponses = languageResponses[intent as keyof typeof languageResponses] || languageResponses['general'];
    
    return intentResponses[Math.floor(Math.random() * intentResponses.length)];
  }

  // Generate product-specific responses
  generateProductResponse(product: ScannedProduct, intent: string, language: string): string {
    const responses: { [key: string]: { [key: string]: string } } = {
      'en': {
        price: `${product.name} costs $${product.price.toFixed(2)}. It has a ${product.rating}/5 rating from ${product.reviews} reviews.`,
        location: `${product.name} is located in aisle ${product.aisle}.`,
        nutrition: `${product.name} has ${product.nutritionFacts.calories} calories, ${product.nutritionFacts.protein}g protein, and ${product.nutritionFacts.fiber}g fiber. It's rated ${product.nutritionScore} for nutrition.`,
        alternatives: `Here are some alternatives to ${product.name}:\n${product.alternatives.slice(0, 3).map(alt => `• ${alt.name} - $${alt.price.toFixed(2)} (${alt.nutritionScore})`).join('\n')}`,
        pairings: `Great pairings for ${product.name}:\n${product.recommendedPairings.slice(0, 3).map(pair => `• ${pair.name} - ${pair.reason}`).join('\n')}`,
        general: `${product.name} is a great choice! It costs $${product.price.toFixed(2)} and is located in aisle ${product.aisle}. It has ${product.nutritionFacts.calories} calories and is rated ${product.nutritionScore} for nutrition.`
      },
      'hi': {
        price: `${product.name} की कीमत $${product.price.toFixed(2)} है। इसे ${product.rating}/5 रेटिंग मिली है ${product.reviews} रिव्यू से।`,
        location: `${product.name} एसल ${product.aisle} में मिलेगा।`,
        nutrition: `${product.name} में ${product.nutritionFacts.calories} कैलोरी, ${product.nutritionFacts.protein}g प्रोटीन, और ${product.nutritionFacts.fiber}g फाइबर है। पोषण के लिए ${product.nutritionScore} रेटिंग।`,
        general: `${product.name} एक बेहतरीन विकल्प है! इसकी कीमत $${product.price.toFixed(2)} है और यह एसल ${product.aisle} में मिलेगा।`
      }
    };

    const languageResponses = responses[language as keyof typeof responses] || responses['en'];
    return languageResponses[intent as keyof typeof languageResponses] || languageResponses['general'];
  }
}

// Hardcoded Q&A pairs for each language
const HARDCODED_QA: Record<string, Array<{ q: string, a: string }>> = {
  en: [
    { q: "where can i find apples", a: "You can find apples in aisle A1. They are fresh and organic!" },
    { q: "what is the price of bread", a: "Great Value Organic Whole Wheat Bread costs $3.49 and is in aisle B1." },
    { q: "how much is greek yogurt", a: "Chobani Greek Yogurt Plain is $4.99 and located in aisle D1." },
    { q: "where is almond milk", a: "Almond Milk Unsweetened is in aisle D2, perfect for dairy-free diets." },
    { q: "what are the nutrition facts for spinach", a: "Fresh Spinach: 23 calories, 3g protein, 2g fiber per serving. Aisle A3." },
    { q: "recommend a healthy snack", a: "Organic Almonds and Organic Peanut Butter are great healthy snacks!" },
    { q: "which aisle is chicken in", a: "Organic Chicken Breast is in aisle P1." },
    { q: "show me organic products", a: "Try Organic Fuji Apples, Organic Strawberries, and Organic Carrots in aisles A1-A3." },
    { q: "what goes well with bread", a: "Bread pairs well with Organic Peanut Butter, Local Honey, and Avocado." },
    { q: "compare almond milk and dairy milk", a: "Almond milk is plant-based and lower in calories; dairy milk has more protein and calcium." }
  ],
  hi: [
    { q: "सेब कहाँ मिलेंगे", a: "सेब आपको A1 एसल में मिलेंगे। वे ताजे और ऑर्गेनिक हैं!" },
    { q: "ब्रेड की कीमत क्या है", a: "ग्रेट वैल्यू ऑर्गेनिक होल व्हीट ब्रेड $3.49 में है और B1 एसल में है।" },
    { q: "ग्रीक योगर्ट कितने का है", a: "चोबानी ग्रीक योगर्ट प्लेन $4.99 में है और D1 एसल में है।" },
    { q: "आलमंड मिल्क कहाँ है", a: "आलमंड मिल्क अनस्वीटेंड D2 एसल में है, यह डेयरी-फ्री डाइट के लिए उत्तम है।" },
    { q: "पालक के पोषण तथ्य क्या हैं", a: "फ्रेश पालक: 23 कैलोरी, 3g प्रोटीन, 2g फाइबर प्रति सर्विंग। एसल A3।" },
    { q: "स्वस्थ स्नैक सुझाएं", a: "ऑर्गेनिक बादाम और ऑर्गेनिक पीनट बटर बेहतरीन स्वस्थ स्नैक्स हैं!" },
    { q: "चिकन किस एसल में है", a: "ऑर्गेनिक चिकन ब्रेस्ट P1 एसल में है।" },
    { q: "ऑर्गेनिक उत्पाद दिखाएं", a: "ऑर्गेनिक फूजी सेब, ऑर्गेनिक स्ट्रॉबेरी, और ऑर्गेनिक गाजर A1-A3 एसल में हैं।" },
    { q: "ब्रेड के साथ क्या अच्छा लगता है", a: "ब्रेड के साथ ऑर्गेनिक पीनट बटर, लोकल हनी, और एवोकाडो अच्छा लगता है।" },
    { q: "आलमंड मिल्क और डेयरी मिल्क की तुलना करें", a: "आलमंड मिल्क प्लांट-बेस्ड है और कम कैलोरी वाला है; डेयरी मिल्क में अधिक प्रोटीन और कैल्शियम होता है।" }
  ],
  fr: [
    { q: "ou puis-je trouver des pommes", a: "Vous pouvez trouver des pommes dans l'allée A1. Elles sont fraîches et bio !" },
    { q: "quel est le prix du pain", a: "Le pain complet bio Great Value coûte 3,49 $ et se trouve dans l'allée B1." },
    { q: "combien coute le yaourt grec", a: "Le yaourt grec Chobani nature coûte 4,99 $ et se trouve dans l'allée D1." },
    { q: "ou est le lait damande", a: "Le lait d'amande non sucré est dans l'allée D2, parfait pour les régimes sans produits laitiers." },
    { q: "quels sont les faits nutritionnels des epinards", a: "Épinards frais : 23 calories, 3g de protéines, 2g de fibres par portion. Allée A3." },
    { q: "recommandez une collation saine", a: "Les amandes bio et le beurre de cacahuète bio sont d'excellentes collations saines !" },
    { q: "dans quelle allee est le poulet", a: "Le blanc de poulet bio est dans l'allée P1." },
    { q: "montrez-moi des produits bio", a: "Essayez les pommes Fuji bio, les fraises bio et les carottes bio dans les allées A1-A3." },
    { q: "avec quoi le pain se marie-t-il bien", a: "Le pain se marie bien avec le beurre de cacahuète bio, le miel local et l'avocat." },
    { q: "comparez le lait damande et le lait de vache", a: "Le lait d'amande est végétal et moins calorique ; le lait de vache contient plus de protéines et de calcium." }
  ],
  es: [
    { q: "donde puedo encontrar manzanas", a: "Puedes encontrar manzanas en el pasillo A1. ¡Son frescas y orgánicas!" },
    { q: "cual es el precio del pan", a: "El pan integral orgánico Great Value cuesta $3.49 y está en el pasillo B1." },
    { q: "cuanto cuesta el yogur griego", a: "El yogur griego Chobani cuesta $4.99 y está en el pasillo D1." },
    { q: "donde esta la leche de almendras", a: "La leche de almendras sin azúcar está en el pasillo D2, perfecta para dietas sin lácteos." },
    { q: "cuales son los datos nutricionales de la espinaca", a: "Espinaca fresca: 23 calorías, 3g de proteína, 2g de fibra por porción. Pasillo A3." },
    { q: "recomienda un snack saludable", a: "¡Las almendras orgánicas y la mantequilla de maní orgánica son excelentes snacks saludables!" },
    { q: "en que pasillo esta el pollo", a: "La pechuga de pollo orgánica está en el pasillo P1." },
    { q: "muestrame productos organicos", a: "Prueba manzanas Fuji orgánicas, fresas orgánicas y zanahorias orgánicas en los pasillos A1-A3." },
    { q: "con que combina bien el pan", a: "El pan combina bien con mantequilla de maní orgánica, miel local y aguacate." },
    { q: "compara la leche de almendras y la leche de vaca", a: "La leche de almendras es vegetal y baja en calorías; la leche de vaca tiene más proteínas y calcio." }
  ],
  de: [
    { q: "wo finde ich apfel", a: "Sie finden Äpfel im Gang A1. Sie sind frisch und bio!" },
    { q: "was kostet brot", a: "Great Value Bio-Vollkornbrot kostet 3,49 $ und befindet sich im Gang B1." },
    { q: "wie viel kostet griechischer joghurt", a: "Chobani Griechischer Joghurt kostet 4,99 $ und befindet sich im Gang D1." },
    { q: "wo ist mandelmilch", a: "Mandelmilch ungesüßt befindet sich im Gang D2, perfekt für laktosefreie Ernährung." },
    { q: "was sind die nahrwerte von spinat", a: "Frischer Spinat: 23 Kalorien, 3g Protein, 2g Ballaststoffe pro Portion. Gang A3." },
    { q: "empfehlen sie einen gesunden snack", a: "Bio-Mandeln und Bio-Erdnussbutter sind tolle gesunde Snacks!" },
    { q: "in welchem gang ist huhn", a: "Bio-Hähnchenbrust befindet sich im Gang P1." },
    { q: "zeigen sie mir bio produkte", a: "Probieren Sie Bio-Fuji-Äpfel, Bio-Erdbeeren und Bio-Karotten in den Gängen A1-A3." },
    { q: "was passt gut zu brot", a: "Brot passt gut zu Bio-Erdnussbutter, lokalem Honig und Avocado." },
    { q: "vergleichen sie mandelmilch und kuhmilch", a: "Mandelmilch ist pflanzlich und kalorienarm; Kuhmilch enthält mehr Protein und Kalzium." }
  ]
};

function normalizeQuestion(q: string) {
  // Remove accents, punctuation, and lowercase
  return q
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s\u0900-\u097F]/g, '');
}

// Main Enhanced AI Service
export class EnhancedAIService {
  private nlp: AdvancedNLP;
  private context: ConversationContext;

  constructor() {
    this.nlp = new AdvancedNLP();
    this.context = {
      userHistory: [],
      assistantHistory: [],
      currentLanguage: 'en',
      userPreferences: {
        dietary: [],
        budget: 'medium',
        organic: false,
        language: 'en'
      },
      shoppingList: [],
      sessionStart: new Date(),
      conversationTurns: 0,
      lastProducts: []
    };
  }

  // Main method to process user messages with ML capabilities
  async processMessage(message: string): Promise<EnhancedAIResponse> {
    const startTime = Date.now();
    
    console.log('Processing message:', message);
    
    // Language detection
    const languageInfo = this.nlp.detectLanguage(message);
    // Try all languages for hardcoded Q&A
    const normMsg = normalizeQuestion(message);
    let qaMatch = null;
    let qaLang = 'en';
    for (const lang of Object.keys(HARDCODED_QA)) {
      const qa = HARDCODED_QA[lang].find(({ q }) => normMsg === normalizeQuestion(q));
      if (qa) {
        qaMatch = qa;
        qaLang = lang;
        break;
      }
    }
    if (qaMatch) {
      return {
        content: qaMatch.a,
        confidence: 1,
        suggestions: [],
        action: undefined,
        metadata: {
          detectedLanguage: qaLang,
          intent: 'hardcoded',
          context: this.context
        },
        mlInsights: {
          intentConfidence: 1,
          sentimentScore: 0,
          languageDetection: { ...languageInfo, code: qaLang },
          responseTime: Date.now() - startTime,
          modelVersion: 'hardcoded-1.0'
        }
      };
    }
    console.log('Language detected:', languageInfo);
    
    // Sentiment analysis
    const sentiment = this.nlp.analyzeSentiment(message);
    console.log('Sentiment:', sentiment);
    
    // Intent classification with context
    const intentAnalysis = this.nlp.classifyIntent(message, this.context);
    console.log('Intent analysis:', intentAnalysis);
    
    // Product search if needed
    let products: ScannedProduct[] = [];
    if (intentAnalysis.entities.product || intentAnalysis.entities.category) {
      const searchQuery = intentAnalysis.entities.product || intentAnalysis.entities.category;
      console.log('Searching for products with query:', searchQuery);
      products = this.nlp.searchProducts(searchQuery, {
        organic: this.context.userPreferences.organic,
        category: intentAnalysis.entities.category,
        maxPrice: intentAnalysis.entities.priceRange === 'low' ? 5 : undefined
      });
      console.log('Found products:', products);
    }

    // Generate response
    let response = this.nlp.generateResponse(
      intentAnalysis.intent, 
      intentAnalysis.entities, 
      this.context, 
      languageInfo.code
    );

    // Add product-specific information if products found
    if (products.length > 0) {
      const product = products[0];
      const productResponse = this.nlp.generateProductResponse(product, intentAnalysis.intent, languageInfo.code);
      response = productResponse;
      
      // Update context
      this.context.lastProducts = [product];
    } else if (intentAnalysis.intent !== 'greeting' && intentAnalysis.intent !== 'farewell' && intentAnalysis.intent !== 'help') {
      // If no products found but user is asking about products, provide helpful response
      response = this.generateHelpfulResponse(message, intentAnalysis.intent, languageInfo.code);
    }

    // Update context
    this.context.userHistory.push(message);
    this.context.assistantHistory.push(response);
    this.context.conversationTurns += 1;
    this.context.currentLanguage = languageInfo.code;

    // Handle specific intents
    let action: EnhancedAIResponse['action'] = undefined;
    let metadata: any = {};

    switch (intentAnalysis.intent) {
      case 'find_product':
        action = 'navigate';
        if (products.length > 0) {
          metadata = {
            productId: products[0].id,
            aisle: products[0].aisle,
            price: products[0].price,
            products: products
          };
        }
        break;
      case 'check_price':
        action = 'compare';
        if (products.length > 0) {
          metadata = {
            productId: products[0].id,
            price: products[0].price,
            alternatives: products[0].alternatives,
            products: products
          };
        }
        break;
      case 'nutrition_info':
        action = 'nutrition';
        if (products.length > 0) {
          metadata = {
            productId: products[0].id,
            nutritionFacts: products[0].nutritionFacts,
            nutritionScore: products[0].nutritionScore,
            products: products
          };
        }
        break;
      case 'recipe':
        action = 'recipe';
        if (products.length > 0) {
          metadata = {
            productId: products[0].id,
            recommendedPairings: products[0].recommendedPairings,
            products: products
          };
        }
        break;
      case 'add_to_list':
        action = 'add_to_list';
        if (products.length > 0) {
          metadata = {
            productId: products[0].id,
            products: products
          };
        }
        break;
      case 'recommend':
        action = 'recommend';
        metadata = {
          products: products,
          category: intentAnalysis.entities.category
        };
        break;
      case 'search':
        action = 'search';
        metadata = {
          products: products,
          query: message
        };
        break;
      case 'language_change':
        action = 'translate';
        break;
    }

    const responseTime = Date.now() - startTime;

    return {
      content: response,
      confidence: intentAnalysis.confidence,
      suggestions: this.generateSuggestions(intentAnalysis.intent, languageInfo.code, products),
      action,
      metadata: {
        ...metadata,
        sentiment: sentiment.sentiment,
        detectedLanguage: languageInfo.code,
        intent: intentAnalysis.intent,
        context: this.context
      },
      mlInsights: {
        intentConfidence: intentAnalysis.confidence,
        sentimentScore: sentiment.score,
        languageDetection: languageInfo,
        responseTime,
        modelVersion: '3.0'
      }
    };
  }

  // Generate helpful response when no products found
  private generateHelpfulResponse(message: string, intent: string, language: string): string {
    const responses: { [key: string]: { [key: string]: string } } = {
      'en': {
        find_product: "I couldn't find that specific product, but I can help you search for similar items. Could you try describing what you're looking for in more detail?",
        check_price: "I don't have pricing information for that item. Could you tell me the specific product name or category you're interested in?",
        nutrition_info: "I'd be happy to provide nutrition information! Could you specify which product or food category you'd like to know about?",
        recipe: "I can help with recipe suggestions! What type of food or ingredients are you interested in cooking with?",
        general: "I'm here to help! I can assist with finding products, checking prices, nutrition info, recipes, and more. What would you like to know?"
      },
      'hi': {
        find_product: "मुझे वह विशिष्ट उत्पाद नहीं मिला, लेकिन मैं आपको समान वस्तुओं की खोज में मदद कर सकती हूं। क्या आप बता सकते हैं कि आप क्या ढूंढ रहे हैं?",
        general: "मैं मदद करने के लिए यहाँ हूं! मैं उत्पाद खोजने, कीमतें जांचने, पोषण जानकारी, रेसिपी और अधिक में सहायता कर सकती हूं।"
      }
    };

    const languageResponses = responses[language as keyof typeof responses] || responses['en'];
    return languageResponses[intent as keyof typeof languageResponses] || languageResponses['general'];
  }

  // Generate contextual suggestions
  private generateSuggestions(intent: string, language: string, products: ScannedProduct[] = []): string[] {
    const suggestions: { [key: string]: { [key: string]: string[] } } = {
      'en': {
        greeting: ['Find products', 'Check prices', 'Get recipes', 'Nutrition info', 'Product recommendations'],
        find_product: ['Search by category', 'Browse popular items', 'Check availability', 'Find alternatives'],
        check_price: ['Show deals', 'Compare alternatives', 'Budget options', 'Price history'],
        nutrition_info: ['Healthy alternatives', 'Dietary options', 'Nutrition comparison', 'Health benefits'],
        recipe: ['Quick meals', 'Healthy recipes', 'Budget-friendly options', 'Meal planning'],
        recommend: ['Popular items', 'Best sellers', 'Customer favorites', 'Trending products'],
        search: ['Browse categories', 'Filter by price', 'Sort by rating', 'Organic options'],
        general: ['Product search', 'Price comparison', 'Store navigation', 'Help', 'Language settings']
      },
      'hi': {
        greeting: ['उत्पाद खोजें', 'कीमतें देखें', 'रेसिपी प्राप्त करें', 'पोषण जानकारी', 'उत्पाद सुझाव'],
        find_product: ['श्रेणी के अनुसार खोजें', 'लोकप्रिय आइटम देखें', 'उपलब्धता जांचें', 'विकल्प खोजें'],
        general: ['उत्पाद खोज', 'कीमत तुलना', 'स्टोर नेविगेशन', 'मदद']
      },
      'fr': {
        greeting: ['Trouver des produits', 'Vérifier les prix', 'Obtenir des recettes', 'Info nutrition', 'Recommandations'],
        find_product: ['Rechercher par catégorie', 'Parcourir les articles populaires', 'Vérifier la disponibilité'],
        general: ['Recherche de produits', 'Comparaison de prix', 'Navigation en magasin', 'Aide']
      }
    };

    const languageSuggestions = suggestions[language as keyof typeof suggestions] || suggestions['en'];
    const intentSuggestions = languageSuggestions[intent as keyof typeof languageSuggestions] || languageSuggestions['general'];
    
    // Add product-specific suggestions
    if (products.length > 0) {
      const product = products[0];
      return [
        `Learn more about ${product.name}`,
        `Compare ${product.name} with alternatives`,
        `Add ${product.name} to shopping list`,
        ...intentSuggestions.slice(0, 2)
      ];
    }
    
    return intentSuggestions;
  }

  // Get conversation context
  getContext(): ConversationContext {
    return this.context;
  }

  // Update user preferences
  updatePreferences(preferences: Partial<ConversationContext['userPreferences']>): void {
    this.context.userPreferences = { ...this.context.userPreferences, ...preferences };
  }

  // Add item to shopping list
  addToShoppingList(productId: string): void {
    if (!this.context.shoppingList.includes(productId)) {
      this.context.shoppingList.push(productId);
    }
  }

  // Get shopping list
  getShoppingList(): string[] {
    return this.context.shoppingList;
  }

  // Search products
  searchProducts(query: string, filters: any = {}): ScannedProduct[] {
    return this.nlp.searchProducts(query, filters);
  }
}

// Export singleton instance
export const enhancedAIService = new EnhancedAIService(); 