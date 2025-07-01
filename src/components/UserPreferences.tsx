
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, AlertTriangle, Bell, MapPin, Zap, Star, Settings } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  totalVisits: number;
  favoriteStore: string;
}

interface DietaryPreference {
  id: string;
  name: string;
  active: boolean;
  icon: string;
}

interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'severe';
}

const UserPreferences: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Sukhman Saini',
    email: 'sukhmansaini1504@email.com',
    memberSince: 'March 2025',
    totalVisits: 47,
    favoriteStore: 'Walmart Supercenter - Main St'
  });

  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPreference[]>([
    { id: 'organic', name: 'Organic Products', active: true, icon: '🌱' },
    { id: 'vegetarian', name: 'Vegetarian', active: true, icon: '🥗' },
    { id: 'gluten-free', name: 'Gluten-Free', active: false, icon: '🚫' },
    { id: 'low-sodium', name: 'Low Sodium', active: false, icon: '🧂' },
    { id: 'sugar-free', name: 'Sugar-Free', active: false, icon: '🍯' },
    { id: 'keto', name: 'Keto-Friendly', active: false, icon: '🥑' }
  ]);

  const [allergies, setAllergies] = useState<Allergy[]>([
    { id: 'nuts', name: 'Tree Nuts', severity: 'severe' },
    { id: 'spice', name: 'Spicy Products', severity: 'mild' }
  ]);

  const [notifications, setNotifications] = useState({
    deals: true,
    restock: true,
    recommendations: true,
    locationBased: false
  });

  const toggleDietaryPref = (id: string) => {
    setDietaryPrefs(prev => prev.map(pref => 
      pref.id === id ? { ...pref, active: !pref.active } : pref
    ));
  };

  const addAllergy = (allergyName: string) => {
    if (allergyName.trim()) {
      const newAllergy: Allergy = {
        id: Date.now().toString(),
        name: allergyName.trim(),
        severity: 'mild'
      };
      setAllergies(prev => [...prev, newAllergy]);
    }
  };

  const removeAllergy = (id: string) => {
    setAllergies(prev => prev.filter(allergy => allergy.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Member since {profile.memberSince}</span>
                <span>•</span>
                <span>{profile.totalVisits} store visits</span>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Premium Member</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="dietary">Dietary</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          {/* Shopping Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Shopping Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-store">Favorite Store</Label>
                  <Input
                    id="preferred-store"
                    value={profile.favoriteStore}
                    onChange={(e) => setProfile(prev => ({ ...prev, favoriteStore: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Weekly Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Preferred Shopping Times</Label>
                <div className="flex flex-wrap gap-2">
                  {['Morning (8-11 AM)', 'Afternoon (12-4 PM)', 'Evening (5-8 PM)', 'Late Night (9+ PM)'].map(time => (
                    <Badge key={time} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Favorite Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {['Organic', 'Fresh Produce', 'Dairy', 'Bakery', 'Meat & Seafood', 'Frozen Foods'].map(category => (
                    <Badge key={category} variant="secondary" className="cursor-pointer">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dietary" className="space-y-6">
          {/* Dietary Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Dietary Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietaryPrefs.map(pref => (
                  <div key={pref.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{pref.icon}</span>
                      <span className="font-medium">{pref.name}</span>
                    </div>
                    <Switch
                      checked={pref.active}
                      onCheckedChange={() => toggleDietaryPref(pref.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Allergies & Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Allergies & Restrictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {allergies.map(allergy => (
                  <div key={allergy.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="font-medium">{allergy.name}</span>
                      <Badge 
                        variant={allergy.severity === 'severe' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {allergy.severity}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAllergy(allergy.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add new allergy or restriction..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addAllergy((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button variant="outline">Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Deal Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified about sales and special offers</p>
                  </div>
                  <Switch
                    checked={notifications.deals}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, deals: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Restock Notifications</h4>
                    <p className="text-sm text-gray-600">Know when out-of-stock items are available</p>
                  </div>
                  <Switch
                    checked={notifications.restock}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, restock: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Smart Recommendations</h4>
                    <p className="text-sm text-gray-600">Receive personalized product suggestions</p>
                  </div>
                  <Switch
                    checked={notifications.recommendations}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, recommendations: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Location-Based Alerts</h4>
                    <p className="text-sm text-gray-600">Get notifications when near your favorite store</p>
                  </div>
                  <Switch
                    checked={notifications.locationBased}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, locationBased: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>App Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="units">Measurement Units</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Metric (kg, g)</option>
                    <option>Imperial (lbs, oz)</option>
                        </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Data & Privacy</Label>
                <div className="space-y-2 text-sm">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Manage Location Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Voice Activation</h4>
                    <p className="text-sm text-gray-600">Enable "Hey SmartNav" wake word</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Learning Mode</h4>
                    <p className="text-sm text-gray-600">Allow AI to learn from your shopping patterns</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label htmlFor="voice-speed">Voice Response Speed</Label>
                  <input 
                    type="range" 
                    id="voice-speed"
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    defaultValue="1"
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPreferences;
