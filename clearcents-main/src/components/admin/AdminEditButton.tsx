import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Upload } from 'lucide-react';
import { useHomepageContent, HomepageContent } from '@/hooks/useHomepageContent';
import type { FeaturesContent } from '@/hooks/useFeaturesContent';
import type { PricingContent } from '@/hooks/usePricingContent';
import type { AboutContent } from '@/hooks/useAboutContent';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminEditButtonProps {
  sectionId: string;
  currentContent?: HomepageContent | FeaturesContent | PricingContent | AboutContent;
  contentType?: 'homepage' | 'features' | 'pricing' | 'about';
  updateContent: (sectionId: string, updates: Record<string, unknown>) => Promise<unknown>;
  refetch?: () => Promise<void>;
}

export function AdminEditButton({ sectionId, currentContent, contentType = 'homepage', updateContent, refetch }: AdminEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_color: '#500CB0',
    button_text_color: '#FFFFFF',
    title_color: '#000000',
    subtitle_color: '#000000',
    description_color: '#666666',
    background_color: '#FFFFFF',
    image_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when dialog opens or currentContent changes
  const handleDialogOpen = (open: boolean) => {
    if (open && currentContent) {
      setFormData({
        title: currentContent.title || '',
        subtitle: currentContent.subtitle || '',
        description: currentContent.description || '',
        button_text: currentContent.button_text || '',
        button_color: currentContent.button_color || '#500CB0',
        button_text_color: currentContent.button_text_color || '#FFFFFF',
        title_color: currentContent.title_color || '#000000',
        subtitle_color: currentContent.subtitle_color || '#000000',
        description_color: currentContent.description_color || '#666666',
        background_color: (currentContent as FeaturesContent | PricingContent | AboutContent).background_color || '#FFFFFF',
        image_url: currentContent.image_url || ''
      });
    }
    setIsOpen(open);
  };

  const handleSave = async () => {
    console.log('=== ADMIN EDIT SAVE DEBUG ===');
    console.log('Section ID:', sectionId);
    console.log('Content Type:', contentType);
    console.log('Current Content:', currentContent);
    console.log('Form Data:', formData);
    console.log('Update Function:', typeof updateContent);
    
    if (!updateContent) {
      console.error('Update function is not available');
      toast.error('Update function not available. Please refresh the page.');
      return;
    }
    
    setSaving(true);
    try {
      console.log('Calling updateContent...');
      const result = await updateContent(sectionId, formData);
      console.log('Save successful:', result);
      toast.success('Content updated successfully!');
      setIsOpen(false);
      // Refetch content instead of reloading the page
      if (refetch) {
        setTimeout(() => {
          refetch();
        }, 500);
      }
    } catch (error) {
      console.error('Save failed:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      toast.error('Failed to update content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      // Update form data with the uploaded image URL
      handleInputChange('image_url', urlData.publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 opacity-70 hover:opacity-100 z-10"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {sectionId} Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Section title"
            />
          </div>
          
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Section subtitle"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Section description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="button_text">Button Text</Label>
            <Input
              id="button_text"
              value={formData.button_text}
              onChange={(e) => handleInputChange('button_text', e.target.value)}
              placeholder="Button text"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="button_color">Button Color</Label>
              <Input
                id="button_color"
                type="color"
                value={formData.button_color}
                onChange={(e) => handleInputChange('button_color', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="button_text_color">Button Text Color</Label>
              <Input
                id="button_text_color"
                type="color"
                value={formData.button_text_color}
                onChange={(e) => handleInputChange('button_text_color', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title_color">Title Color</Label>
              <Input
                id="title_color"
                type="color"
                value={formData.title_color}
                onChange={(e) => handleInputChange('title_color', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="subtitle_color">Subtitle Color</Label>
              <Input
                id="subtitle_color"
                type="color"
                value={formData.subtitle_color}
                onChange={(e) => handleInputChange('subtitle_color', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description_color">Description Color</Label>
              <Input
                id="description_color"
                type="color"
                value={formData.description_color}
                onChange={(e) => handleInputChange('description_color', e.target.value)}
              />
            </div>
          </div>
          
          {(contentType === 'features' || contentType === 'pricing' || contentType === 'about') && (
            <div>
              <Label htmlFor="background_color">Background Color</Label>
              <Input
                id="background_color"
                type="color"
                value={formData.background_color}
                onChange={(e) => handleInputChange('background_color', e.target.value)}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="image_url">Image</Label>
            <div className="space-y-2">
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="Image URL or upload an image below"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                {formData.image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('image_url', '')}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-20 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}