import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { useAboutContent } from "@/hooks/useAboutContent";

interface AboutStat {
  id: string;
  label: string;
  value: string;
  is_active: boolean;
  display_order: number;
}

const About = () => {
  const { getContentBySection } = useAboutContent();
  const [stats, setStats] = useState<AboutStat[]>([]);
  
  const heroContent = getContentBySection('hero');
  const storyContent = getContentBySection('story');
  const valuesContent = getContentBySection('values');
  const statsContent = getContentBySection('stats');
  const teamContent = getContentBySection('team');
  const ctaContent = getContentBySection('cta');

  // Debug logging
  console.log('About page content debug:', {
    heroContent,
    storyContent,
    valuesContent,
    statsContent,
    teamContent,
    ctaContent
  });

  // Use static stats since about_stats table doesn't exist in current schema
  useEffect(() => {
    const staticStats: AboutStat[] = [
      {
        id: '1',
        label: 'Happy Users',
        value: '10K+',
        is_active: true,
        display_order: 1
      },
      {
        id: '2',
        label: 'Budgets Managed',
        value: '$2M+',
        is_active: true,
        display_order: 2
      },
      {
        id: '3',
        label: 'Satisfaction Rate',
        value: '98%',
        is_active: true,
        display_order: 3
      }
    ];
    
    setStats(staticStats);
  }, []);

  const values = [
    {
      icon: Target,
      title: "Clarity",
      description: "We believe financial management should be crystal clear. No jargon, no confusion—just simple tools that work."
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "Everyone deserves to feel confident about their money. We build tools that help you take control of your financial future."
    },
    {
      icon: Heart,
      title: "Simplicity",
      description: "Budgeting doesn't have to be complicated. We focus on what matters most, keeping everything simple and effective."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <AdminContentWrapper sectionId="hero" contentType="about">
        <section 
          className="text-white py-20"
          style={{ 
            background: heroContent?.background_color || 'linear-gradient(to bottom right, #2c3e50, #34495e)'
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="font-heading font-bold text-5xl md:text-6xl mb-6"
              style={{ color: heroContent?.title_color || '#ffffff' }}
            >
              {heroContent?.title || 'Why we built FinSuite'}
            </h1>
            <p 
              className="font-body text-xl md:text-2xl text-white/80 mb-8"
              style={{ color: heroContent?.subtitle_color || '#ffffff' }}
            >
              {heroContent?.subtitle || 'Making budgeting simple and stress-free for everyone.'}
            </p>
            {heroContent?.description && (
              <p 
                className="font-body text-lg max-w-2xl mx-auto"
                style={{ color: heroContent?.description_color || '#ffffff' }}
              >
                {heroContent.description}
              </p>
            )}
          </div>
        </section>
      </AdminContentWrapper>

      {/* Story Section */}
      <AdminContentWrapper sectionId="story" contentType="about">
        <section 
          className="py-20 bg-white"
          style={{ backgroundColor: storyContent?.background_color || '#ffffff' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 
                  className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6"
                  style={{ color: storyContent?.title_color || '#000000' }}
                >
                  {storyContent?.title || 'Our Story'}
                </h2>
                <div className="space-y-4 font-body text-lg text-muted-foreground">
                  <p style={{ color: storyContent?.description_color || '#666666' }}>
                    {storyContent?.description || 'We started FinSuite because we were frustrated with existing budgeting tools. They were either too complicated, too expensive, or missing key features that real people actually need.'}
                  </p>
                  {storyContent?.subtitle && (
                    <p style={{ color: storyContent?.description_color || '#666666' }}>
                      {storyContent.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-8 shadow-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Our Mission</h3>
                    <p className="font-body text-muted-foreground">
                      To make budgeting accessible, effective, and stress-free for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Values Section */}
      <AdminContentWrapper sectionId="values" contentType="about">
        <section 
          className="py-20 bg-background"
          style={{ backgroundColor: valuesContent?.background_color || '#f8fafc' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 
                className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4"
                style={{ color: valuesContent?.title_color || '#000000' }}
              >
                {valuesContent?.title || 'Our Values'}
              </h2>
              <p 
                className="font-body text-xl text-muted-foreground max-w-2xl mx-auto"
                style={{ color: valuesContent?.description_color || '#666666' }}
              >
                {valuesContent?.description || 'These principles guide everything we do at FinSuite.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-xl transition-all text-center group">
                  <CardContent className="p-8">
                    <value.icon className="w-16 h-16 text-primary mx-auto mb-6 group-hover:text-primary/80 transition-colors" />
                    <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                      {value.title}
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Stats Section */}
      <AdminContentWrapper sectionId="stats" contentType="about">
        <section 
          className="py-20 bg-white"
          style={{ backgroundColor: statsContent?.background_color || '#ffffff' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {statsContent?.title && (
              <div className="text-center mb-12">
                <h2 
                  className="font-heading font-bold text-3xl md:text-4xl mb-4"
                  style={{ color: statsContent?.title_color || '#000000' }}
                >
                  {statsContent.title}
                </h2>
                {statsContent?.description && (
                  <p 
                    className="font-body text-lg"
                    style={{ color: statsContent?.description_color || '#666666' }}
                  >
                    {statsContent.description}
                  </p>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.length > 0 ? (
                stats.map((stat, index) => (
                  <div key={stat.id || index}>
                    <div 
                      className="font-heading font-bold text-5xl mb-2"
                      style={{ color: statsContent?.title_color || '#500CB0' }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="font-body text-lg"
                      style={{ color: statsContent?.description_color || '#666666' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback stats if none in database
                <>
                  <div>
                    <div className="font-heading font-bold text-5xl text-primary mb-2">10K+</div>
                    <div className="font-body text-lg text-muted-foreground">Happy Users</div>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-5xl text-primary mb-2">$2M+</div>
                    <div className="font-body text-lg text-muted-foreground">Budgets Managed</div>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-5xl text-primary mb-2">98%</div>
                    <div className="font-body text-lg text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Team Section */}
      <AdminContentWrapper sectionId="team" contentType="about">
        <section 
          className="py-20 bg-background"
          style={{ backgroundColor: teamContent?.background_color || '#f8fafc' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4"
                style={{ color: teamContent?.title_color || '#000000' }}
              >
                {teamContent?.title || 'Built by a small, passionate team'}
              </h2>
              <p 
                className="font-body text-lg text-muted-foreground"
                style={{ color: teamContent?.description_color || '#666666' }}
              >
                {teamContent?.description || 'We\'re a tight-knit group of designers, developers, and financial enthusiasts who believe in making budgeting better for everyone.'}
              </p>
            </div>
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-primary to-primary/80 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                  We're hiring!
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  Want to help us make budgeting better for millions of people? We're always looking for talented individuals who share our passion for simplicity and financial empowerment.
                </p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  style={{ 
                    borderColor: teamContent?.button_color || '#500CB0',
                    color: teamContent?.button_color || '#500CB0'
                  }}
                >
                  {teamContent?.button_text || 'View Open Positions'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </AdminContentWrapper>

      {/* CTA Section */}
      <AdminContentWrapper sectionId="cta" contentType="about">
        <section 
          className="py-20"
          style={{ 
            background: ctaContent?.background_color || 'linear-gradient(to bottom right, #4c1d95, #7c3aed)'
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 
              className="font-heading font-bold text-4xl md:text-5xl text-white mb-6"
              style={{ color: ctaContent?.title_color || '#ffffff' }}
            >
              {ctaContent?.title || 'Join us and take control of your money today'}
            </h2>
            <p 
              className="font-body text-xl text-white/80 mb-8"
              style={{ color: ctaContent?.description_color || '#ffffff' }}
            >
              {ctaContent?.description || 'Become part of a community that believes in financial clarity and empowerment.'}
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
                {ctaContent?.button_text || 'Start Your Journey'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </AdminContentWrapper>
    </Layout>
  );
};

export default About;