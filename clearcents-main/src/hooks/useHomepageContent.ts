import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HomepageContent {
  id: string;
  section_id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_color: string | null;
  button_text_color: string | null;
  title_color: string | null;
  subtitle_color: string | null;
  description_color: string | null;
  image_url: string | null;
}

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section_id');

      if (error) {
        console.error('Error fetching homepage content:', error);
      } else {
        setContent(data || []);
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (sectionId: string, updates: Partial<HomepageContent>) => {
    console.log('useHomepageContent - updateContent called with:', { sectionId, updates });
    
    try {
      // First check if the section exists
      console.log('Checking if section exists...');
      const { data: existingData, error: checkError } = await supabase
        .from('homepage_content')
        .select('id')
        .eq('section_id', sectionId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing data:', checkError);
        throw checkError;
      }

      console.log('Existing data check result:', existingData);

      let result;
      
      if (existingData) {
        // Update existing content
        console.log('Updating existing content...');
        const { data, error } = await supabase
          .from('homepage_content')
          .update(updates)
          .eq('section_id', sectionId)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Update successful:', data);
        result = data;
      } else {
        // Create new content
        console.log('Creating new content...');
        const { data, error } = await supabase
          .from('homepage_content')
          .insert([{ section_id: sectionId, ...updates }])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Insert successful:', data);
        result = data;
      }

      // Update local state
      setContent(prev => {
        const existingIndex = prev.findIndex(item => item.section_id === sectionId);
        if (existingIndex >= 0) {
          // Update existing
          console.log('Updating local state - existing item');
          return prev.map(item => 
            item.section_id === sectionId ? { ...item, ...result } : item
          );
        } else {
          // Add new
          console.log('Updating local state - adding new item');
          return [...prev, result];
        }
      });

      console.log('updateContent completed successfully');
      return result;
    } catch (error) {
      console.error('Error in updateContent:', error);
      throw error;
    }
  };

  const getContentBySection = (sectionId: string) => {
    return content.find(item => item.section_id === sectionId);
  };

  return {
    content,
    loading,
    updateContent,
    getContentBySection,
    refetch: fetchContent
  };
}