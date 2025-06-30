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
