import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, TrendingUp, Target, Sparkles, Lightbulb, 
  ShoppingCart, Star, Heart, Zap, Users 
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { ScannedProduct, productDatabase } from './productData';

interface Recommendation {
  product: ScannedProduct;
  score: number;
  reason: string;
  type: 'collaborative' | 'content' | 'contextual' | 'trending';
}

interface UserProfile {
  preferences: string[];
  dietary: string[];
  budget: 'low' | 'medium' | 'high';
  shoppingHistory: string[];
  ratings: Record<string, number>;
}

const MLRecommendationEngine: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    preferences: ['organic', 'healthy'],
    dietary: ['gluten-free'],
    budget: 'medium',
    shoppingHistory: ['prod-123', 'prod-124'],
    ratings: { 'prod-123': 4, 'prod-124': 5 }
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'collaborative' | 'content' | 'contextual' | 'trending'>('all');

  useEffect(() => {
    generateRecommendations();
  }, [userProfile]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Get recommendations from AI service
      const aiRecommendations = await aiService.getPersonalizedRecommendations({
        userHistory: userProfile.shoppingHistory,
        currentProducts: userProfile.shoppingHistory,
        preferences: [...userProfile.preferences, ...userProfile.dietary]
      });

      // Generate different types of recommendations
      const allRecommendations: Recommendation[] = [];

      // Collaborative filtering recommendations
      const collaborativeRecs = generateCollaborativeRecommendations();
      allRecommendations.push(...collaborativeRecs);

      // Content-based recommendations
      const contentRecs = generateContentBasedRecommendations();
      allRecommendations.push(...contentRecs);

      // Contextual recommendations
      const contextualRecs = generateContextualRecommendations();
      allRecommendations.push(...contextualRecs);

      // Trending recommendations
      const trendingRecs = generateTrendingRecommendations();
      allRecommendations.push(...trendingRecs);

      // Sort by score and remove duplicates
      const uniqueRecs = removeDuplicateRecommendations(allRecommendations);
      setRecommendations(uniqueRecs);

    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCollaborativeRecommendations = (): Recommendation[] => {
    // Simulate collaborative filtering based on similar users
    const similarUsers = findSimilarUsers(userProfile);
    const recommendations: Recommendation[] = [];

    similarUsers.forEach(user => {
      const userProducts = user.shoppingHistory.filter(id => 
        !userProfile.shoppingHistory.includes(id)
      );
      
      userProducts.forEach(productId => {
        const product = productDatabase.find(p => p.id === productId);
        if (product) {
          recommendations.push({
            product,
            score: 0.85,
            reason: `Popular among users with similar preferences`,
            type: 'collaborative'
          });
        }
      });
    });

    return recommendations.slice(0, 3);
  };

  const generateContentBasedRecommendations = (): Recommendation[] => {
    // Simulate content-based filtering based on product features
    const recommendations: Recommendation[] = [];
    
    userProfile.shoppingHistory.forEach(productId => {
      const product = productDatabase.find(p => p.id === productId);
      if (product) {
        // Find products with similar features
        const similarProducts = productDatabase.filter(p => 
          p.id !== productId &&
          p.aisle === product.aisle &&
          p.nutritionScore === product.nutritionScore &&
          Math.abs(p.price - product.price) < 2
        );

        similarProducts.forEach(similarProduct => {
          recommendations.push({
            product: similarProduct,
            score: 0.78,
            reason: `Similar to ${product.name}`,
            type: 'content'
          });
        });
      }
    });

    return recommendations.slice(0, 3);
  };

  const generateContextualRecommendations = (): Recommendation[] => {
    // Simulate contextual recommendations based on current context
    const recommendations: Recommendation[] = [];
    
    // Time-based recommendations (e.g., breakfast items in morning)
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10) {
      const breakfastItems = productDatabase.filter(p => 
        p.name.toLowerCase().includes('bread') || 
        p.name.toLowerCase().includes('yogurt') ||
        p.name.toLowerCase().includes('apple')
      );
      
      breakfastItems.forEach(product => {
        recommendations.push({
          product,
          score: 0.82,
          reason: 'Perfect for breakfast',
          type: 'contextual'
        });
      });
    }

    // Dietary preference recommendations
    userProfile.dietary.forEach(diet => {
      const dietaryProducts = productDatabase.filter(p => {
        if (diet === 'gluten-free') {
          return !p.allergens.includes('Wheat');
        }
        if (diet === 'organic') {
          return p.name.toLowerCase().includes('organic');
        }
        return false;
      });

      dietaryProducts.forEach(product => {
        recommendations.push({
          product,
          score: 0.88,
          reason: `Matches your ${diet} preference`,
          type: 'contextual'
        });
      });
    });

    return recommendations.slice(0, 3);
  };

  const generateTrendingRecommendations = (): Recommendation[] => {
    // Simulate trending recommendations based on popularity
    const recommendations: Recommendation[] = [];
    
    // Sort products by rating and reviews
    const trendingProducts = productDatabase
      .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
      .slice(0, 5);

    trendingProducts.forEach((product, index) => {
      recommendations.push({
        product,
        score: 0.9 - (index * 0.1),
        reason: 'Trending and highly rated',
        type: 'trending'
      });
    });

    return recommendations.slice(0, 3);
  };

  const findSimilarUsers = (currentUser: UserProfile): UserProfile[] => {
    // Mock similar users based on preferences
    return [
      {
        preferences: ['organic', 'healthy'],
        dietary: ['gluten-free'],
        budget: 'medium',
        shoppingHistory: ['prod-125', 'prod-123'],
        ratings: { 'prod-125': 5, 'prod-123': 4 }
      },
      {
        preferences: ['organic'],
        dietary: ['vegan'],
        budget: 'high',
        shoppingHistory: ['prod-124', 'prod-125'],
        ratings: { 'prod-124': 5, 'prod-125': 4 }
      }
    ];
  };

  const removeDuplicateRecommendations = (recs: Recommendation[]): Recommendation[] => {
    const seen = new Set<string>();
    return recs.filter(rec => {
      if (seen.has(rec.product.id)) {
        return false;
      }
      seen.add(rec.product.id);
      return true;
    }).sort((a, b) => b.score - a.score);
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'collaborative': return 'bg-blue-100 text-blue-800';
      case 'content': return 'bg-green-100 text-green-800';
      case 'contextual': return 'bg-purple-100 text-purple-800';
      case 'trending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case 'collaborative': return <Users className="w-4 h-4" />;
      case 'content': return <Target className="w-4 h-4" />;
      case 'contextual': return <Lightbulb className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const filteredRecommendations = selectedType === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>ML Recommendation Engine</span>
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Personalized recommendations using collaborative filtering, content-based analysis, and contextual AI.
          </p>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recommendation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: recommendations.length },
              { key: 'collaborative', label: 'Collaborative', count: recommendations.filter(r => r.type === 'collaborative').length },
              { key: 'content', label: 'Content-Based', count: recommendations.filter(r => r.type === 'content').length },
              { key: 'contextual', label: 'Contextual', count: recommendations.filter(r => r.type === 'contextual').length },
              { key: 'trending', label: 'Trending', count: recommendations.filter(r => r.type === 'trending').length }
            ].map(({ key, label, count }) => (
              <Button
                key={key}
                variant={selectedType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(key as any)}
                className="text-xs"
              >
                {label} ({count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Generating recommendations...</span>
            </div>
          </div>
        ) : (
          filteredRecommendations.map((recommendation, index) => (
            <Card key={`${recommendation.product.id}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getRecommendationTypeIcon(recommendation.type)}
                    <Badge className={getRecommendationTypeColor(recommendation.type)}>
                      {recommendation.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {(recommendation.score * 100).toFixed(0)}%
                    </div>
                    <Progress value={recommendation.score * 100} className="w-16 h-2" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{recommendation.product.name}</h3>
                  <p className="text-xs text-gray-600">{recommendation.reason}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">${recommendation.product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{recommendation.product.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Aisle {recommendation.product.aisle}</span>
                  <span>{recommendation.product.nutritionScore}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 text-xs">
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Heart className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* User Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Preferences</div>
              <div className="text-gray-600">{userProfile.preferences.join(', ')}</div>
            </div>
            <div>
              <div className="font-medium">Dietary</div>
              <div className="text-gray-600">{userProfile.dietary.join(', ')}</div>
            </div>
            <div>
              <div className="font-medium">Budget</div>
              <div className="text-gray-600 capitalize">{userProfile.budget}</div>
            </div>
            <div>
              <div className="font-medium">History</div>
              <div className="text-gray-600">{userProfile.shoppingHistory.length} items</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLRecommendationEngine; 