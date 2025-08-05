import { useFeaturesContent } from "@/hooks/useFeaturesContent";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  BarChart3, 
  DollarSign, 
  Target, 
  Zap, 
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  PieChart
} from "lucide-react";
import Layout from "@/components/Layout";

export function DynamicFeatures() {
  const { content, loading, getContentBySection } = useFeaturesContent();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  const heroContent = getContentBySection('hero');
  const smartBudgetingContent = getContentBySection('smart-budgeting');
  const expenseTrackingContent = getContentBySection('expense-tracking');
  const analyticsContent = getContentBySection('analytics');
  const securityContent = getContentBySection('security');
  const integrationsContent = getContentBySection('integrations');

  return (
    <Layout>
      {/* Hero Section */}
      <AdminContentWrapper 
        sectionId="hero" 
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: heroContent?.background_color || '#1a1a1a' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
              style={{ color: heroContent?.title_color || '#FFFFFF' }}
            >
              {heroContent?.title || 'Powerful Financial Features'}
            </h1>
            <p 
              className="font-body text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              style={{ color: heroContent?.subtitle_color || '#CCCCCC' }}
            >
              {heroContent?.subtitle || 'Everything you need to manage your finances effectively'}
            </p>
            <p 
              className="font-body text-lg mb-12 max-w-4xl mx-auto"
              style={{ color: heroContent?.description_color || '#AAAAAA' }}
            >
              {heroContent?.description || 'Discover the comprehensive suite of tools designed to simplify your financial management and boost your productivity.'}
            </p>
            {heroContent?.button_text && (
              <Button 
                variant="default" 
                size="lg" 
                className="rounded-full px-8"
                style={{
                  backgroundColor: heroContent.button_color || '#500CB0',
                  color: heroContent.button_text_color || '#FFFFFF'
                }}
              >
                {heroContent.button_text}
              </Button>
            )}
          </div>
        </section>
      </AdminContentWrapper>

      {/* Smart Budgeting Section */}
      <AdminContentWrapper 
        sectionId="smart-budgeting" 
        className="py-20"
        style={{ backgroundColor: smartBudgetingContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="font-heading font-bold text-4xl mb-6"
                  style={{ color: smartBudgetingContent?.title_color || '#000000' }}
                >
                  {smartBudgetingContent?.title || 'Smart Budgeting'}
                </h2>
                <p 
                  className="font-body text-xl mb-6"
                  style={{ color: smartBudgetingContent?.subtitle_color || '#666666' }}
                >
                  {smartBudgetingContent?.subtitle || 'Intelligent budget planning and tracking'}
                </p>
                <p 
                  className="font-body text-lg mb-8"
                  style={{ color: smartBudgetingContent?.description_color || '#666666' }}
                >
                  {smartBudgetingContent?.description || 'Set realistic budgets and track your spending with our AI-powered insights that help you stay on track.'}
                </p>
                {smartBudgetingContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                    style={{
                      backgroundColor: smartBudgetingContent.button_color || '#500CB0',
                      color: smartBudgetingContent.button_text_color || '#FFFFFF'
                    }}
                  >
                    {smartBudgetingContent.button_text}
                  </Button>
                )}
              </div>
              <div className="relative">
                {smartBudgetingContent?.image_url ? (
                  <img 
                    src={smartBudgetingContent.image_url} 
                    alt="Smart budgeting dashboard" 
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 h-80 flex items-center justify-center">
                    <Target className="w-32 h-32 text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Expense Tracking Section */}
      <AdminContentWrapper 
        sectionId="expense-tracking" 
        className="py-20"
        style={{ backgroundColor: expenseTrackingContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                {expenseTrackingContent?.image_url ? (
                  <img 
                    src={expenseTrackingContent.image_url} 
                    alt="Expense tracking dashboard" 
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 h-80 flex items-center justify-center">
                    <DollarSign className="w-32 h-32 text-green-500" />
                  </div>
                )}
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="font-heading font-bold text-4xl mb-6"
                  style={{ color: expenseTrackingContent?.title_color || '#000000' }}
                >
                  {expenseTrackingContent?.title || 'Advanced Expense Tracking'}
                </h2>
                <p 
                  className="font-body text-xl mb-6"
                  style={{ color: expenseTrackingContent?.subtitle_color || '#666666' }}
                >
                  {expenseTrackingContent?.subtitle || 'Real-time expense monitoring'}
                </p>
                <p 
                  className="font-body text-lg mb-8"
                  style={{ color: expenseTrackingContent?.description_color || '#666666' }}
                >
                  {expenseTrackingContent?.description || 'Monitor every transaction with detailed categorization and analytics for better financial visibility.'}
                </p>
                {expenseTrackingContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                    style={{
                      backgroundColor: expenseTrackingContent.button_color || '#500CB0',
                      color: expenseTrackingContent.button_text_color || '#FFFFFF'
                    }}
                  >
                    {expenseTrackingContent.button_text}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Analytics Section */}
      <AdminContentWrapper 
        sectionId="analytics" 
        className="py-20"
        style={{ backgroundColor: analyticsContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="font-heading font-bold text-4xl mb-6"
                  style={{ color: analyticsContent?.title_color || '#000000' }}
                >
                  {analyticsContent?.title || 'Financial Analytics'}
                </h2>
                <p 
                  className="font-body text-xl mb-6"
                  style={{ color: analyticsContent?.subtitle_color || '#666666' }}
                >
                  {analyticsContent?.subtitle || 'Deep insights into your spending patterns'}
                </p>
                <p 
                  className="font-body text-lg mb-8"
                  style={{ color: analyticsContent?.description_color || '#666666' }}
                >
                  {analyticsContent?.description || 'Get comprehensive reports and visualizations that help you understand your financial behavior.'}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Trend Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PieChart className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Category Breakdown</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Monthly Reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Real-time Data</span>
                  </div>
                </div>
                {analyticsContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                    style={{
                      backgroundColor: analyticsContent.button_color || '#500CB0',
                      color: analyticsContent.button_text_color || '#FFFFFF'
                    }}
                  >
                    {analyticsContent.button_text}
                  </Button>
                )}
              </div>
              <div className="relative">
                {analyticsContent?.image_url ? (
                  <img 
                    src={analyticsContent.image_url} 
                    alt="Financial analytics dashboard" 
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 h-80 flex items-center justify-center">
                    <BarChart3 className="w-32 h-32 text-purple-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Security & Integrations Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Security Card */}
            <AdminContentWrapper 
              sectionId="security" 
              className="rounded-3xl p-8"
              style={{ backgroundColor: securityContent?.background_color || '#FFFFFF' }}
              contentType="features"
            >
              <Card className="border-0 bg-transparent h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-4"
                    style={{ color: securityContent?.title_color || '#000000' }}
                  >
                    {securityContent?.title || 'Bank-Grade Security'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-6 flex-grow"
                    style={{ color: securityContent?.description_color || '#666666' }}
                  >
                    {securityContent?.description || 'Your data is protected with military-grade encryption'}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-red-500" />
                      <span className="font-body text-foreground">256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-red-500" />
                      <span className="font-body text-foreground">Multi-factor authentication</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-red-500" />
                      <span className="font-body text-foreground">Real-time fraud detection</span>
                    </div>
                  </div>
                  {securityContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 w-full"
                      style={{
                        backgroundColor: securityContent.button_color || '#500CB0',
                        color: securityContent.button_text_color || '#FFFFFF'
                      }}
                    >
                      {securityContent.button_text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </AdminContentWrapper>

            {/* Integrations Card */}
            <AdminContentWrapper 
              sectionId="integrations" 
              className="rounded-3xl p-8"
              style={{ backgroundColor: integrationsContent?.background_color || '#FFFFFF' }}
              contentType="features"
            >
              <Card className="border-0 bg-transparent h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-4"
                    style={{ color: integrationsContent?.title_color || '#000000' }}
                  >
                    {integrationsContent?.title || 'Seamless Integrations'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-6 flex-grow"
                    style={{ color: integrationsContent?.description_color || '#666666' }}
                  >
                    {integrationsContent?.description || 'Connect with your favorite financial tools'}
                  </p>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  {integrationsContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 w-full"
                      style={{
                        backgroundColor: integrationsContent.button_color || '#500CB0',
                        color: integrationsContent.button_text_color || '#FFFFFF'
                      }}
                    >
                      {integrationsContent.button_text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </AdminContentWrapper>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
            Take Your Finances Anywhere
          </h2>
          <p className="font-body text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Access all your financial data on the go with our powerful mobile app. Available for iOS and Android.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="rounded-full px-8 bg-white text-purple-900 hover:bg-white/90"
            >
              Download for iOS
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 border-white text-white hover:bg-white/10"
            >
              Download for Android
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}