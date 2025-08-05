import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pages:', error);
      } else {
        setPages(data || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const createPage = async (pageData: Omit<Page, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([pageData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPages(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPages(prev => 
        prev.map(page => page.id === id ? data : page)
      );
      return data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPages(prev => prev.filter(page => page.id !== id));
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  };

  const getPageBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching page by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return null;
    }
  };

  return {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    getPageBySlug,
    refetch: fetchPages
  };
}