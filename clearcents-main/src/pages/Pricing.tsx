import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { usePricingContent } from "@/hooks/usePricingContent";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const { getContentBySection } = usePricingContent();
  const [faqs, setFaqs] = useState([]);
  
  const heroContent = getContentBySection('hero');
  const pricingContent = getContentBySection('pricing');
  const faqContent = getContentBySection('faq');
  const ctaContent = getContentBySection('cta');

  // Fetch FAQs from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (error) {
          console.error('Error fetching FAQs:', error);
        } else {
          setFaqs(data || []);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFAQs();
  }, []);
  
  const features = [
    "Unlimited budgeting categories",
    "Unlimited manual transactions",
    "Cloud sync on all devices",
    "Full access to all features",
    "Budget tracking & adjustments",
    "Simple reports & insights",
    "Email support",
    "Cancel anytime"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <AdminContentWrapper sectionId="hero" contentType="pricing">
        <section 
          className="py-20 text-white"
          style={{ backgroundColor: heroContent?.background_color || '#2c3e50' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="font-heading font-bold text-5xl md:text-6xl mb-6"
              style={{ color: heroContent?.title_color || '#ffffff' }}
            >
              {heroContent?.title || 'Simple, transparent pricing'}
            </h1>
            <p 
              className="font-body text-xl md:text-2xl mb-4"
              style={{ color: heroContent?.subtitle_color || '#ffffff' }}
            >
              {heroContent?.subtitle || 'One plan. All features. No surprises.'}
            </p>
            <p 
              className="font-body text-lg max-w-2xl mx-auto"
              style={{ color: heroContent?.description_color || '#ffffff' }}
            >
              {heroContent?.description || 'We believe budgeting tools should be accessible to everyone. That\'s why we offer everything you need in one simple package.'}
            </p>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Pricing Card */}
      <AdminContentWrapper sectionId="pricing" contentType="pricing">
        <section 
          className="py-20"
          style={{ backgroundColor: pricingContent?.background_color || '#ffffff' }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-primary"></div>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="inline-block bg-primary text-white px-4 py-1 rounded-full font-heading font-semibold text-sm mb-4">
                  MOST POPULAR
                </div>
                <h2 
                  className="font-heading font-bold text-3xl mb-2"
                  style={{ color: pricingContent?.title_color || '#000000' }}
                >
                  {pricingContent?.title || 'FinSuite Monthly'}
                </h2>
                <div className="flex items-center justify-center mb-4">
                  <span 
                    className="font-heading font-bold text-6xl"
                    style={{ color: pricingContent?.title_color || '#000000' }}
                  >
                    ${pricingContent?.price || '9'}
                  </span>
                  <span 
                    className="font-body text-2xl ml-2"
                    style={{ color: pricingContent?.subtitle_color || '#666666' }}
                  >
                    /month
                  </span>
                </div>
                <p 
                  className="font-body text-lg"
                  style={{ color: pricingContent?.description_color || '#666666' }}
                >
                  {pricingContent?.description || 'Everything you need to budget like a pro'}
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="font-body text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/signup" className="block">
                  <Button 
                    variant="default" 
                    size="lg"
                    className="w-full rounded-full py-3"
                    style={{ 
                      backgroundColor: pricingContent?.button_color || '#500CB0',
                      color: pricingContent?.button_text_color || '#FFFFFF'
                    }}
                  >
                    {pricingContent?.button_text || 'Start Now'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Cancel anytime. No hidden fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </AdminContentWrapper>

      {/* FAQ Section */}
      <AdminContentWrapper sectionId="faq" contentType="pricing">
        <section 
          className="py-20"
          style={{ backgroundColor: faqContent?.background_color || '#ffffff' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="font-heading font-bold text-3xl md:text-4xl mb-4"
                style={{ color: faqContent?.title_color || '#000000' }}
              >
                {faqContent?.title || 'Frequently Asked Questions'}
              </h2>
              <p 
                className="font-body text-lg"
                style={{ color: faqContent?.description_color || '#666666' }}
              >
                {faqContent?.description || 'Everything you need to know about FinSuite pricing.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={faq.id || index} className="border-2 border-transparent hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                      {faq.question}
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* CTA Section */}
      <AdminContentWrapper sectionId="cta" contentType="pricing">
        <section 
          className="py-20"
          style={{ backgroundColor: ctaContent?.background_color || '#4c1d95' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 
              className="font-heading font-bold text-4xl md:text-5xl mb-6"
              style={{ color: ctaContent?.title_color || '#ffffff' }}
            >
              {ctaContent?.title || 'Start your financial journey today'}
            </h2>
            <p 
              className="font-body text-xl mb-8"
              style={{ color: ctaContent?.description_color || '#ffffff' }}
            >
              {ctaContent?.description || 'Join thousands of users who have taken control of their finances with FinSuite.'}
            </p>
            <Link to="/signup">
              <Button 
                variant="default" 
                size="lg"
                className="rounded-full px-8 py-3"
                style={{ 
                  backgroundColor: ctaContent?.button_color || '#ffffff',
                  color: ctaContent?.button_text_color || '#4c1d95'
                }}
              >
                {ctaContent?.button_text || 'Get Started Now'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </AdminContentWrapper>
    </Layout>
  );
};

export default Pricing;