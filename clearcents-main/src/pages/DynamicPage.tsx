import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePages } from '@/hooks/usePages';
import Layout from '@/components/Layout';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getPageBySlug } = usePages();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getPageBySlug(slug).then((pageData) => {
        setPage(pageData);
        setLoading(false);
      });
    }
  }, [slug, getPageBySlug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content || '' }}
        />
      </div>
    </Layout>
  );
}