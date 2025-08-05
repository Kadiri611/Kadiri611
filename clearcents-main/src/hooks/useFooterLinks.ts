import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FooterLink {
  id: string;
  link_type: 'navigation' | 'social';
  title: string;
  url: string;
  icon_name?: string;
  display_order: number;
  section_group?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFooterLinks() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .eq('is_active', true)
        .order('section_group')
        .order('display_order');

      if (error) {
        console.error('Error fetching footer links:', error);
      } else {
        setLinks((data || []) as FooterLink[]);
      }
    } catch (error) {
      console.error('Error fetching footer links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const createLink = async (linkData: Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('footer_links')
        .insert([linkData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLinks(prev => [...prev, data as FooterLink]);
      return data;
    } catch (error) {
      console.error('Error creating footer link:', error);
      throw error;
    }
  };

  const updateLink = async (id: string, updates: Partial<FooterLink>) => {
    try {
      const { data, error } = await supabase
        .from('footer_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLinks(prev => 
        prev.map(link => 
          link.id === id ? (data as FooterLink) : link
        )
      );
      return data;
    } catch (error) {
      console.error('Error updating footer link:', error);
      throw error;
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('footer_links')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting footer link:', error);
      throw error;
    }
  };

  const updateDisplayOrder = async (linkId: string, newOrder: number) => {
    return updateLink(linkId, { display_order: newOrder });
  };

  const getNavigationLinks = () => {
    return links.filter(link => link.link_type === 'navigation');
  };

  const getSocialLinks = () => {
    return links.filter(link => link.link_type === 'social');
  };

  const getNavigationByGroup = () => {
    const navLinks = getNavigationLinks();
    const groups: Record<string, FooterLink[]> = {};
    
    navLinks.forEach(link => {
      const group = link.section_group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(link);
    });

    // Sort links within each group by display_order
    Object.keys(groups).forEach(group => {
      groups[group].sort((a, b) => a.display_order - b.display_order);
    });

    return groups;
  };

  return {
    links,
    loading,
    createLink,
    updateLink,
    deleteLink,
    updateDisplayOrder,
    getNavigationLinks,
    getSocialLinks,
    getNavigationByGroup,
    refetch: fetchLinks
  };
}