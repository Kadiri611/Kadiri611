import { ReactNode, CSSProperties } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminEditButton } from './AdminEditButton';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useFeaturesContent } from '@/hooks/useFeaturesContent';
import { usePricingContent } from '@/hooks/usePricingContent';

interface AdminContentWrapperProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  contentType?: 'homepage' | 'features' | 'pricing';
}

export function AdminContentWrapper({ 
  sectionId, 
  children, 
  className = '', 
  style,
  contentType = 'homepage'
}: AdminContentWrapperProps) {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { getContentBySection: getHomepageContent, updateContent: updateHomepageContent } = useHomepageContent();
  const { getContentBySection: getFeaturesContent, updateContent: updateFeaturesContent } = useFeaturesContent();
  const { getContentBySection: getPricingContent, updateContent: updatePricingContent } = usePricingContent();
  
  const currentContent = contentType === 'features' 
    ? getFeaturesContent(sectionId) 
    : contentType === 'pricing'
    ? getPricingContent(sectionId)
    : getHomepageContent(sectionId);

  const updateFunction = contentType === 'features' 
    ? updateFeaturesContent 
    : contentType === 'pricing'
    ? updatePricingContent
    : updateHomepageContent;

  return (
    <div className={`relative ${className}`} style={style}>
      {isAdmin && (
        <AdminEditButton 
          sectionId={sectionId} 
          currentContent={currentContent} 
          contentType={contentType}
          updateContent={updateFunction}
        />
      )}
      {children}
    </div>
  );
}