// AI Service Layer - Handles all AI/ML model interactions
import { ScannedProduct, productDatabase } from '../components/productData';

// Types for AI responses
export interface AIResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  action?: 'navigate' | 'add_to_list' | 'compare' | 'recipe' | 'nutrition';
  metadata?: {
    productId?: string;
    aisle?: string;
    price?: number;
    alternatives?: string[];
  };
}

export interface ProductRecognitionResult {
  productId: string;
  confidence: number;
  product: ScannedProduct;
  alternatives: ScannedProduct[];
}

export interface NLPAnalysis {
  intent: 'find_product' | 'check_price' | 'nutrition_info' | 'recipe' | 'navigation' | 'general';
  entities: {
    product?: string;
    location?: string;
    price_range?: string;
    dietary?: string[];
  };
  confidence: number;
}

// Mock AI Models (In production, these would connect to real AI services)
class AIModels {
  // Natural Language Processing Model
  async analyzeIntent(text: string): Promise<NLPAnalysis> {
    const lowerText = text.toLowerCase();
    
    // Intent classification
    let intent: NLPAnalysis['intent'] = 'general';
    if (lowerText.includes('where') || lowerText.includes('find') || lowerText.includes('location')) {
      intent = 'find_product';
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('cheap')) {
      intent = 'check_price';
    } else if (lowerText.includes('nutrition') || lowerText.includes('calories') || lowerText.includes('ingredients')) {
      intent = 'nutrition_info';
    } else if (lowerText.includes('recipe') || lowerText.includes('cook') || lowerText.includes('meal')) {
      intent = 'recipe';
    } else if (lowerText.includes('navigate') || lowerText.includes('route') || lowerText.includes('aisle')) {
      intent = 'navigation';
    }

    // Entity extraction
    const entities: NLPAnalysis['entities'] = {};
    
    // Extract product names
    const productKeywords = ['bread', 'yogurt', 'apple', 'milk', 'organic', 'whole wheat', 'greek'];
    for (const keyword of productKeywords) {
      if (lowerText.includes(keyword)) {
        entities.product = keyword;
        break;
      }
    }

    // Extract dietary preferences
    const dietaryKeywords = ['organic', 'gluten-free', 'vegan', 'dairy-free', 'low-carb', 'keto'];
    entities.dietary = dietaryKeywords.filter(keyword => lowerText.includes(keyword));

    return {
      intent,
      entities,
      confidence: 0.85
    };
  }

  // Computer Vision Model for Product Recognition
  async recognizeProduct(imageData: string): Promise<ProductRecognitionResult> {
    // Simulate image analysis with ML model
    // In production, this would use TensorFlow.js, ONNX, or cloud vision APIs
    
    // Mock product recognition based on image features
    const recognizedProducts = productDatabase.filter(product => {
      // Simulate ML model confidence scores
      const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
      return confidence > 0.7;
    });

    if (recognizedProducts.length === 0) {
      throw new Error('No products recognized in image');
    }

    const bestMatch = recognizedProducts[0];
    const alternatives = productDatabase
      .filter(p => p.id !== bestMatch.id && p.aisle === bestMatch.aisle)
      .slice(0, 3);

    return {
      productId: bestMatch.id,
      confidence: 0.92,
      product: bestMatch,
      alternatives
    };
  }

  // Recommendation Engine
  async getRecommendations(
    userHistory: string[],
    currentProducts: string[],
    preferences: string[]
  ): Promise<ScannedProduct[]> {
    // Collaborative filtering and content-based recommendation
    const recommendations: ScannedProduct[] = [];
    
    // Based on current products, find complementary items
    for (const productId of currentProducts) {
      const product = productDatabase.find(p => p.id === productId);
      if (product) {
        // Add recommended pairings
        const pairings = product.recommendedPairings.slice(0, 2);
        for (const pairing of pairings) {
          const pairingProduct = productDatabase.find(p => 
            p.name.toLowerCase().includes(pairing.name.toLowerCase())
          );
          if (pairingProduct && !recommendations.find(r => r.id === pairingProduct.id)) {
            recommendations.push(pairingProduct);
          }
        }
      }
    }

    // Add products based on user preferences
    if (preferences.includes('organic')) {
      const organicProducts = productDatabase.filter(p => 
        p.name.toLowerCase().includes('organic') && 
        !recommendations.find(r => r.id === p.id)
      );
      recommendations.push(...organicProducts.slice(0, 2));
    }

    return recommendations.slice(0, 5);
  }

  // Price Optimization Model
  async optimizePrices(products: string[]): Promise<{
    totalSavings: number;
    alternatives: Array<{ original: ScannedProduct; alternative: ScannedProduct; savings: number }>;
  }> {
    let totalSavings = 0;
    const alternatives: Array<{ original: ScannedProduct; alternative: ScannedProduct; savings: number }> = [];

    for (const productId of products) {
      const product = productDatabase.find(p => p.id === productId);
      if (product) {
        // Find cheaper alternatives with similar quality
        const cheaperAlternatives = productDatabase.filter(p => 
          p.id !== product.id && 
          p.price < product.price && 
          p.rating >= product.rating - 0.5
        );

        if (cheaperAlternatives.length > 0) {
          const bestAlternative = cheaperAlternatives.reduce((best, current) => 
            current.price < best.price ? current : best
          );
          const savings = product.price - bestAlternative.price;
          totalSavings += savings;
          alternatives.push({
            original: product,
            alternative: bestAlternative,
            savings
          });
        }
      }
    }

    return { totalSavings, alternatives };
  }

  // Nutrition Analysis Model
  async analyzeNutrition(products: string[]): Promise<{
    totalCalories: number;
    nutritionScore: string;
    recommendations: string[];
    healthScore: number;
  }> {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;

    for (const productId of products) {
      const product = productDatabase.find(p => p.id === productId);
      if (product) {
        totalCalories += product.nutritionFacts.calories;
        totalProtein += product.nutritionFacts.protein;
        totalCarbs += product.nutritionFacts.carbs;
        totalFat += product.nutritionFacts.fat;
        totalFiber += product.nutritionFacts.fiber;
        totalSugar += product.nutritionFacts.sugar;
      }
    }

    // Calculate health score (0-100)
    let healthScore = 100;
    if (totalSugar > 50) healthScore -= 20;
    if (totalFat > 30) healthScore -= 15;
    if (totalFiber < 10) healthScore -= 10;
    if (totalProtein < 20) healthScore -= 10;

    // Generate nutrition recommendations
    const recommendations: string[] = [];
    if (totalFiber < 10) recommendations.push('Consider adding more fiber-rich foods');
    if (totalSugar > 50) recommendations.push('Try to reduce sugar intake');
    if (totalProtein < 20) recommendations.push('Add more protein sources');

    // Determine nutrition score
    let nutritionScore = 'C';
    if (healthScore >= 80) nutritionScore = 'A';
    else if (healthScore >= 60) nutritionScore = 'B';
    else if (healthScore >= 40) nutritionScore = 'C';
    else nutritionScore = 'D';

    return {
      totalCalories,
      nutritionScore,
      recommendations,
      healthScore
    };
  }
}

// Main AI Service Class
export class AIService {
  private models: AIModels;

  constructor() {
    this.models = new AIModels();
  }

  // Main conversation handler
  async processMessage(message: string, context?: {
    userHistory?: string[];
    currentProducts?: string[];
    preferences?: string[];
  }): Promise<AIResponse> {
    // Analyze user intent
    const analysis = await this.models.analyzeIntent(message);
    
    // Generate appropriate response based on intent
    switch (analysis.intent) {
      case 'find_product':
        return this.handleProductSearch(message, analysis);
      case 'check_price':
        return this.handlePriceQuery(message, analysis);
      case 'nutrition_info':
        return this.handleNutritionQuery(message, analysis);
      case 'recipe':
        return this.handleRecipeQuery(message, analysis);
      case 'navigation':
        return this.handleNavigationQuery(message, analysis);
      default:
        return this.handleGeneralQuery(message, analysis, context);
    }
  }

  // Product recognition from image
  async recognizeProductFromImage(imageData: string): Promise<ProductRecognitionResult> {
    return this.models.recognizeProduct(imageData);
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(context: {
    userHistory: string[];
    currentProducts: string[];
    preferences: string[];
  }): Promise<ScannedProduct[]> {
    return this.models.getRecommendations(
      context.userHistory,
      context.currentProducts,
      context.preferences
    );
  }

  // Price optimization
  async optimizeShoppingList(products: string[]): Promise<{
    totalSavings: number;
    alternatives: Array<{ original: ScannedProduct; alternative: ScannedProduct; savings: number }>;
  }> {
    return this.models.optimizePrices(products);
  }

  // Nutrition analysis
  async analyzeShoppingListNutrition(products: string[]): Promise<{
    totalCalories: number;
    nutritionScore: string;
    recommendations: string[];
    healthScore: number;
  }> {
    return this.models.analyzeNutrition(products);
  }

  // Private methods for handling different intents
  private async handleProductSearch(message: string, analysis: NLPAnalysis): Promise<AIResponse> {
    const product = analysis.entities.product;
    if (product) {
      const foundProduct = productDatabase.find(p => 
        p.name.toLowerCase().includes(product)
      );
      
      if (foundProduct) {
        return {
          content: `${foundProduct.name} is located in Aisle ${foundProduct.aisle}. Current price: $${foundProduct.price.toFixed(2)}. ${foundProduct.inStock ? 'In stock' : 'Out of stock'}.`,
          confidence: analysis.confidence,
          suggestions: ['Navigate to aisle', 'Add to shopping list', 'Check alternatives', 'Nutrition info'],
          action: 'navigate',
          metadata: {
            productId: foundProduct.id,
            aisle: foundProduct.aisle,
            price: foundProduct.price
          }
        };
      }
    }

    return {
      content: "I can help you find any product in the store. Could you please specify which product you're looking for?",
      confidence: 0.8,
      suggestions: ['Search by category', 'Browse popular items', 'Check recent searches']
    };
  }

  private async handlePriceQuery(message: string, analysis: NLPAnalysis): Promise<AIResponse> {
    const product = analysis.entities.product;
    if (product) {
      const foundProduct = productDatabase.find(p => 
        p.name.toLowerCase().includes(product)
      );
      
      if (foundProduct) {
        const alternatives = foundProduct.alternatives.slice(0, 3);
        const savings = alternatives.map(alt => alt.savings).filter(s => s > 0);
        const totalSavings = savings.reduce((sum, s) => sum + s, 0);

        return {
          content: `${foundProduct.name} costs $${foundProduct.price.toFixed(2)}. I found ${alternatives.length} alternatives that could save you $${totalSavings.toFixed(2)}.`,
          confidence: analysis.confidence,
          suggestions: ['Show alternatives', 'Add to list', 'Price match', 'Check coupons'],
          action: 'compare',
          metadata: {
            productId: foundProduct.id,
            price: foundProduct.price,
            alternatives: alternatives.map(a => a.name)
          }
        };
      }
    }

    return {
      content: "I can help you find the best prices and deals. What product would you like to check?",
      confidence: 0.8,
      suggestions: ['Check weekly deals', 'Price comparison', 'Coupon finder']
    };
  }

  private async handleNutritionQuery(message: string, analysis: NLPAnalysis): Promise<AIResponse> {
    const product = analysis.entities.product;
    if (product) {
      const foundProduct = productDatabase.find(p => 
        p.name.toLowerCase().includes(product)
      );
      
      if (foundProduct) {
        const nutrition = foundProduct.nutritionFacts;
        return {
          content: `Nutrition for ${foundProduct.name}:\nNutrition Score: ${foundProduct.nutritionScore}\nCalories: ${nutrition.calories}\nProtein: ${nutrition.protein}g\nCarbs: ${nutrition.carbs}g\nFat: ${nutrition.fat}g\nFiber: ${nutrition.fiber}g\nSugar: ${nutrition.sugar}g`,
          confidence: analysis.confidence,
          suggestions: ['Compare with alternatives', 'Add to list', 'Find recipes', 'Check ingredients'],
          action: 'nutrition',
          metadata: {
            productId: foundProduct.id
          }
        };
      }
    }

    return {
      content: "I can provide detailed nutrition information for any product. Which item would you like to know about?",
      confidence: 0.8,
      suggestions: ['Browse healthy options', 'Nutrition comparison', 'Dietary filters']
    };
  }

  private async handleRecipeQuery(message: string, analysis: NLPAnalysis): Promise<AIResponse> {
    return {
      content: "I'd love to help with recipe suggestions! I can recommend meals based on your dietary preferences and automatically add ingredients to your shopping list. What type of cuisine are you interested in?",
      confidence: 0.9,
      suggestions: ['Quick meals', 'Healthy recipes', 'Budget-friendly', 'Dietary restrictions'],
      action: 'recipe'
    };
  }

  private async handleNavigationQuery(message: string, analysis: NLPAnalysis): Promise<AIResponse> {
    return {
      content: "I can help you navigate the store efficiently! I'll create the optimal route to collect all your items and avoid backtracking. Would you like me to plan your shopping route?",
      confidence: 0.9,
      suggestions: ['Plan route', 'Find nearest item', 'Check store map', 'Optimize path'],
      action: 'navigate'
    };
  }

  private async handleGeneralQuery(message: string, analysis: NLPAnalysis, context?: any): Promise<AIResponse> {
    return {
      content: "I'm your AI shopping assistant! I can help you find products, compare prices, check nutrition, get recipe ideas, and navigate the store efficiently. What would you like to do?",
      confidence: 0.8,
      suggestions: ['Find products', 'Check prices', 'Get recipes', 'Store navigation', 'Nutrition info']
    };
  }
}

// Export singleton instance
export const aiService = new AIService(); 