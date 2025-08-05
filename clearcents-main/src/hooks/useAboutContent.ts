import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AboutContent {
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
  background_color: string | null;
  image_url: string | null;
}

export function useAboutContent() {
  const [content, setContent] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    console.log('Fetching about content...');
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('section_id');

      if (error) {
        console.error('Error fetching about content:', error);
      } else {
        console.log('Fetched about content:', data);
        setContent(data || []);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (sectionId: string, updates: Partial<AboutContent>) => {
    console.log('useAboutContent - updateContent called with:', { sectionId, updates });
    
    try {
      const { data: existingData, error: checkError } = await supabase
        .from('about_content')
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
        console.log('Updating existing content...');
        const { data, error } = await supabase
          .from('about_content')
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
        console.log('Creating new content...');
        const { data, error } = await supabase
          .from('about_content')
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

      console.log('Updating local state with result:', result);
      setContent(prev => {
        const existingIndex = prev.findIndex(item => item.section_id === sectionId);
        const newContent = existingIndex >= 0
          ? prev.map(item => item.section_id === sectionId ? { ...item, ...result } : item)
          : [...prev, result];
        console.log('New content state:', newContent);
        return newContent;
      });

      console.log('updateContent completed successfully');
      return result;
    } catch (error) {
      console.error('Error in updateContent:', error);
      throw error;
    }
  };

  const getContentBySection = useCallback((sectionId: string) => {
    const foundContent = content.find(item => item.section_id === sectionId);
    console.log(`getContentBySection(${sectionId}):`, foundContent);
    console.log('Available content:', content);
    return foundContent;
  }, [content]);

  return {
    content,
    loading,
    updateContent,
    getContentBySection,
    refetch: fetchContent
  };
} 