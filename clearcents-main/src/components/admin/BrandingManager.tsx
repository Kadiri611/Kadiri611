import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, Save } from 'lucide-react';
import { useBrandingSettings } from '@/contexts/BrandingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

export function BrandingManager() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { settings, updateSettings, uploadLogo, loading } = useBrandingSettings();
  const [uploading, setUploading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#500CB0');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');

  // Update form state when settings load
  useEffect(() => {
    if (settings) {
      setBusinessName(settings.business_name || '');
      setPrimaryColor(settings.primary_color || '#500CB0');
      setSecondaryColor(settings.secondary_color || '#FFFFFF');
    }
  }, [settings]);

  if (!isAdmin) return null;

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, or SVG file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      await uploadLogo(file);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        business_name: businessName || null,
        primary_color: primaryColor,
        secondary_color: secondaryColor
      });
      toast.success('Branding settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update branding settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Business Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings?.logo_url && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
              <img 
                src={settings.logo_url} 
                alt="Current logo" 
                className="h-16 w-auto object-contain"
              />
              <div>
                <p className="text-sm font-medium">Current Logo</p>
                <p className="text-xs text-muted-foreground">This logo appears in your header and footer</p>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="logo-upload">Upload New Logo</Label>
            <div className="mt-2">
              <input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
                disabled={uploading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose Logo File'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: PNG, JPG, SVG (max 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This name will appear in your header, footer, and throughout the site
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#500CB0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Save Branding Settings
      </Button>
    </div>
  );
}