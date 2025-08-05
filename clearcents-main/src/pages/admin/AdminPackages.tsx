import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, DollarSign, FileText, Palette } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { usePricingContent } from '@/hooks/usePricingContent';
import { toast } from 'sonner';

export default function AdminPackages() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { getContentBySection, updateContent, loading } = usePricingContent();

  const [pricingData, setPricingData] = useState({
    title: '',
    description: '',
    price: '9',
    features: 'Unlimited budgeting categories\nUnlimited manual transactions\nCloud sync on all devices\nFull access to all features\nBudget tracking & adjustments\nSimple reports & insights\nEmail support\nCancel anytime',
    buttonText: '',
    titleColor: '#000000',
    descriptionColor: '#666666',
    buttonColor: '#500CB0',
    buttonTextColor: '#FFFFFF',
    backgroundColor: '#FFFFFF'
  });

  const [saving, setSaving] = useState(false);

  // Load existing pricing content
  useEffect(() => {
    if (!loading) {
      const content = getContentBySection('pricing');
      if (content) {
        setPricingData(prev => ({
          ...prev,
          title: content.title || '',
          description: content.description || '',
          price: content.price ? content.price.toString() : '9',
          buttonText: content.button_text || '',
          titleColor: content.title_color || '#000000',
          descriptionColor: content.description_color || '#666666',
          buttonColor: content.button_color || '#500CB0',
          buttonTextColor: content.button_text_color || '#FFFFFF',
          backgroundColor: content.background_color || '#FFFFFF'
        }));
      }
    }
  }, [loading]);

  const handleSave = async () => {
    console.log('=== PACKAGE SAVE DEBUG ===');
    console.log('Current pricing data:', pricingData);
    console.log('Price value:', pricingData.price);
    console.log('Parsed price:', parseFloat(pricingData.price));
    
    setSaving(true);
    try {
      const saveData = {
        title: pricingData.title,
        description: pricingData.description,
        button_text: pricingData.buttonText,
        price: parseFloat(pricingData.price) || 9.00,
        title_color: pricingData.titleColor,
        description_color: pricingData.descriptionColor,
        button_color: pricingData.buttonColor,
        button_text_color: pricingData.buttonTextColor,
        background_color: pricingData.backgroundColor
      };
      
      console.log('Data being saved:', saveData);
      
      const result = await updateContent('pricing', saveData);
      console.log('Save result:', result);
      
      toast.success('Package configuration updated successfully!');
      
      // Refresh the data after successful save
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving package config:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details
      });
      toast.error('Failed to save package configuration');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Package Configurator</h1>
          <p className="text-muted-foreground mt-2">
            Configure pricing package content and appearance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="space-y-6">
            {/* Content Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Package Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Package Title</Label>
                  <Input
                    id="title"
                    value={pricingData.title}
                    onChange={(e) => setPricingData({ ...pricingData, title: e.target.value })}
                    placeholder="e.g., FinSuite Monthly"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={pricingData.description}
                    onChange={(e) => setPricingData({ ...pricingData, description: e.target.value })}
                    placeholder="e.g., Everything you need to budget like a pro"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={pricingData.buttonText}
                    onChange={(e) => setPricingData({ ...pricingData, buttonText: e.target.value })}
                    placeholder="e.g., Start Now"
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={pricingData.features}
                    onChange={(e) => setPricingData({ ...pricingData, features: e.target.value })}
                    placeholder="Enter features, one per line"
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="price">Monthly Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricingData.price}
                    onChange={(e) => setPricingData({ ...pricingData, price: e.target.value })}
                    placeholder="9"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Note: This only updates the display. Payment integration requires additional setup.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Style Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleColor">Title Color</Label>
                    <Input
                      id="titleColor"
                      type="color"
                      value={pricingData.titleColor}
                      onChange={(e) => setPricingData({ ...pricingData, titleColor: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descriptionColor">Description Color</Label>
                    <Input
                      id="descriptionColor"
                      type="color"
                      value={pricingData.descriptionColor}
                      onChange={(e) => setPricingData({ ...pricingData, descriptionColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buttonColor">Button Color</Label>
                    <Input
                      id="buttonColor"
                      type="color"
                      value={pricingData.buttonColor}
                      onChange={(e) => setPricingData({ ...pricingData, buttonColor: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                    <Input
                      id="buttonTextColor"
                      type="color"
                      value={pricingData.buttonTextColor}
                      onChange={(e) => setPricingData({ ...pricingData, buttonTextColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Section Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={pricingData.backgroundColor}
                    onChange={(e) => setPricingData({ ...pricingData, backgroundColor: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Package Configuration'}
            </Button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-6 rounded-lg border-2 border-primary/20"
                  style={{ backgroundColor: pricingData.backgroundColor }}
                >
                  <div className="text-center">
                    <Badge className="mb-4">MOST POPULAR</Badge>
                    <h3 
                      className="text-2xl font-bold mb-2"
                      style={{ color: pricingData.titleColor }}
                    >
                      {pricingData.title || 'Package Title'}
                    </h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold" style={{ color: pricingData.titleColor }}>
                        ${pricingData.price || '9'}
                      </span>
                      <span className="text-lg ml-2" style={{ color: pricingData.descriptionColor }}>
                        /month
                      </span>
                    </div>
                    <p 
                      className="mb-6"
                      style={{ color: pricingData.descriptionColor }}
                    >
                      {pricingData.description || 'Package description'}
                    </p>
                    
                    <div className="space-y-2 mb-6 text-sm">
                      {pricingData.features.split('\n').filter(f => f.trim()).slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center text-left">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {pricingData.features.split('\n').filter(f => f.trim()).length > 4 && (
                        <p className="text-xs text-muted-foreground">
                          +{pricingData.features.split('\n').filter(f => f.trim()).length - 4} more features
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full"
                      style={{ 
                        backgroundColor: pricingData.buttonColor,
                        color: pricingData.buttonTextColor 
                      }}
                    >
                      {pricingData.buttonText || 'Button Text'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}