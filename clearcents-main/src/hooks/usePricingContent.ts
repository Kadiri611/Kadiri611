import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PricingContent {
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
  price: number | null;
}

export function usePricingContent() {
  const [content, setContent] = useState<PricingContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_content')
        .select('*')
        .order('section_id');

      if (error) {
        console.error('Error fetching pricing content:', error);
      } else {
        setContent(data || []);
      }
    } catch (error) {
      console.error('Error fetching pricing content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (sectionId: string, updates: Partial<PricingContent>) => {
    try {
      const { data: existingData, error: checkError } = await supabase
        .from('pricing_content')
        .select('id')
        .eq('section_id', sectionId)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      if (existingData) {
        const { data, error } = await supabase
          .from('pricing_content')
          .update(updates)
          .eq('section_id', sectionId)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('pricing_content')
          .insert([{ section_id: sectionId, ...updates }])
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      setContent(prev => {
        const existingIndex = prev.findIndex(item => item.section_id === sectionId);
        return existingIndex >= 0
          ? prev.map(item => item.section_id === sectionId ? { ...item, ...result } : item)
          : [...prev, result];
      });

      return result;
    } catch (error) {
      console.error('Error in updateContent:', error);
      throw error;
    }
  };

  const getContentBySection = useCallback((sectionId: string) => {
    return content.find(item => item.section_id === sectionId);
  }, [content]);

  return {
    content,
    loading,
    updateContent,
    getContentBySection,
    refetch: fetchContent
  };
}