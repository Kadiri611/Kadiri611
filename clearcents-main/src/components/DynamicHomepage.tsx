import { useHomepageContent } from "@/hooks/useHomepageContent";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { PageManager } from "@/components/admin/PageManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, CreditCard, DollarSign, BarChart3, PieChart, Globe } from "lucide-react";
import Layout from "@/components/Layout";
export function DynamicHomepage() {
  const {
    content,
    loading,
    getContentBySection
  } = useHomepageContent();
  if (loading) {
    return <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>;
  }
  const heroContent = getContentBySection('hero');
  const empowerContent = getContentBySection('empower');
  const trackExpensesContent = getContentBySection('track-expenses');
  const sendMoneyContent = getContentBySection('send-money');
  const achieveExcellenceContent = getContentBySection('achieve-excellence');
  const integrationsContent = getContentBySection('integrations');
  const finalCtaContent = getContentBySection('final-cta');
  const mainCtaContent = getContentBySection('main-cta');
  const liveChatContent = getContentBySection('live-chat');
  const watchDemoContent = getContentBySection('watch-demo');
  return <Layout>
      {/* Hero Section */}
      <AdminContentWrapper sectionId="hero" className="relative bg-background py-16 lg:py-24 overflow-hidden">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8">
                <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight" style={{
                color: heroContent?.title_color || '#000000'
              }}>
                  {heroContent?.title || 'Maximize 💰 Your Financial Potential'}
                </h1>
                <p className="font-body text-lg md:text-xl lg:text-2xl" style={{
                color: heroContent?.subtitle_color || '#666666'
              }}>
                  {heroContent?.subtitle || 'All-in-one Financial Analytics Dashboard'}
                </p>
                {heroContent?.button_text && <Button variant="default" size="lg" className="rounded-full px-8" style={{
                backgroundColor: heroContent.button_color || '#500CB0',
                color: heroContent.button_text_color || '#FFFFFF'
              }}>
                    {heroContent.button_text}
                  </Button>}
              </div>
              <div className="relative">
                {heroContent?.image_url && <img src={heroContent.image_url} alt="Financial dashboard with subscription management" className="w-full h-auto rounded-3xl shadow-2xl" />}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Trust Indicators */}
      

      {/* Empower Section */}
      <AdminContentWrapper sectionId="empower" className="py-16 lg:py-24 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl" style={{
              color: empowerContent?.title_color || '#000000'
            }}>
              {empowerContent?.title || 'Empower Your Financial Future with us'}
            </h2>
          </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative">
                {empowerContent?.image_url && <img src={empowerContent.image_url} alt="Comprehensive Financial Analytics Dashboard" className="w-full h-auto rounded-3xl shadow-2xl" />}
              </div>
              <div>
                <h3 className="font-heading font-bold text-3xl mb-6" style={{
                color: empowerContent?.subtitle_color || '#000000'
              }}>
                  {empowerContent?.subtitle || 'Comprehensive Financial Analytics Dashboard'}
                </h3>
                <p className="font-body text-lg mb-8" style={{
                color: empowerContent?.description_color || '#666666'
              }}>
                  {empowerContent?.description || 'Gain real-time visibility into your financial performance with intuitive dashboards.'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Keep tracking balance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Send money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Receive money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Convert currency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Track Expenses Section */}
      <AdminContentWrapper sectionId="track-expenses" className="py-16 lg:py-24 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8">
                <h3 className="font-heading font-bold text-3xl lg:text-4xl text-foreground">
                  {trackExpensesContent?.title || 'Track Your all the Expense Easily'}
                </h3>
                <p className="font-body text-lg text-muted-foreground">
                  {trackExpensesContent?.description || 'Effortlessly monitor and manage all your expenses with our intuitive tracking system.'}
                </p>
                {trackExpensesContent?.button_text && <Button variant="default" size="lg" className="rounded-full px-8" style={{
                backgroundColor: trackExpensesContent.button_color || '#500CB0',
                color: trackExpensesContent.button_text_color || '#FFFFFF'
              }}>
                    {trackExpensesContent.button_text}
                  </Button>}
              </div>
              <div className="relative">
                {trackExpensesContent?.image_url && <img src={trackExpensesContent.image_url} alt="Expense tracking dashboard with pie chart and subscription management" className="w-full h-auto rounded-3xl shadow-2xl" />}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Send Money Section */}
      <AdminContentWrapper sectionId="send-money" className="py-16 lg:py-24 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                {sendMoneyContent?.title || 'Send Money Across the Globe'}
              </h2>
              <p className="font-body text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                {sendMoneyContent?.description || 'Transfer money instantly to anywhere in the world with our secure and reliable global payment system.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="bg-card border-border p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                    Send USD Currency
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Send US dollars to over 180 countries worldwide with competitive exchange rates.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                    Convert USD Currency
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Convert your USD to any major currency with real-time exchange rates.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                    Unlimited Transactions
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Make unlimited transactions with no hidden fees or monthly limits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Achieve Excellence Section */}
      <AdminContentWrapper sectionId="achieve-excellence" className="py-16 lg:py-24 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative">
                {achieveExcellenceContent?.image_url ? <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img src={achieveExcellenceContent.image_url} alt={achieveExcellenceContent.title || 'Achieve Financial Excellence'} className="w-full h-80 object-cover" />
                  </div> : <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-8 shadow-2xl transform rotate-3">
                    <div className="bg-white rounded-2xl p-6">
                      <div className="text-2xl font-bold text-charcoal mb-2">Financial Excellence</div>
                      <div className="text-sm text-muted-foreground">Your Success Story</div>
                    </div>
                  </div>}
              </div>
              <div className="space-y-6 lg:space-y-8">
                <h3 className="font-heading font-bold text-3xl lg:text-4xl text-foreground">
                  {achieveExcellenceContent?.title || 'Achieve Financial Excellence'}
                </h3>
                <p className="font-body text-lg text-muted-foreground">
                  {achieveExcellenceContent?.description || 'Take control of your financial future with our comprehensive suite of tools designed for success.'}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="font-body text-foreground">Smart budget planning and forecasting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="font-body text-foreground">Investment tracking and analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="font-body text-foreground">Personalized financial insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>


      {/* Three Card CTA Section */}
      <AdminContentWrapper sectionId="main-cta" className="py-16 lg:py-24 bg-white">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Main CTA Card - spans full width on mobile, takes up space on desktop */}
              <div className="lg:col-span-2 mb-6 lg:mb-8">
                <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
                  {/* Background mockups */}
                  <div className="absolute left-8 top-8 bottom-8 w-80 opacity-20">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="space-y-4">
                        <div className="bg-white/30 rounded-2xl p-4 h-24">
                          <div className="text-xs opacity-80">Spotify</div>
                          <div className="text-sm">/month</div>
                        </div>
                        <div className="bg-white/30 rounded-2xl p-6 flex-1">
                          <div className="text-lg font-bold">$1,928.92</div>
                          <div className="text-xs opacity-80">Total Expense</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/30 rounded-2xl p-4 h-32">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-black rounded-full"></div>
                            <div className="text-xs">iCloud</div>
                          </div>
                          <div className="text-lg font-bold">$50</div>
                          <div className="text-xs opacity-80">/month</div>
                        </div>
                        <div className="bg-white/30 rounded-2xl p-4 flex-1">
                          <div className="text-sm font-semibold mb-3">Add Friends</div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg">+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 ml-auto max-w-xl">
                    <h2 className="font-heading font-bold text-4xl lg:text-5xl mb-4" style={{
                    color: mainCtaContent?.title_color || '#FFFFFF'
                  }}>
                      {mainCtaContent?.title || 'Ready to Run your Business Better with us'}
                    </h2>
                    <p className="font-body text-lg mb-8" style={{
                    color: mainCtaContent?.description_color || '#E0E7FF'
                  }}>
                      {mainCtaContent?.description || 'Welcome to FinSuite, where financial management meets simplicity and efficiency.'}
                    </p>
                    {mainCtaContent?.button_text && <Button variant="default" size="lg" className="rounded-full px-8 py-3" style={{
                    backgroundColor: mainCtaContent.button_color || '#3B82F6',
                    color: mainCtaContent.button_text_color || '#FFFFFF'
                  }}>
                        {mainCtaContent.button_text}
                      </Button>}
                  </div>
                </div>
              </div>
              
              {/* Live Chat Card */}
              <AdminContentWrapper sectionId="live-chat" className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 text-white h-80 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                        <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-3xl mb-4">
                      {liveChatContent?.title || 'Live Chat'}
                    </h3>
                    <p className="font-body text-purple-100 mb-6">
                      {liveChatContent?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>
                  {liveChatContent?.button_text && <Button variant="outline" size="lg" className="rounded-full w-fit" style={{
                  borderColor: liveChatContent.button_text_color || '#FFFFFF',
                  color: liveChatContent.button_text_color || '#FFFFFF'
                }}>
                      {liveChatContent.button_text}
                    </Button>}
                </div>
              </AdminContentWrapper>
              
              {/* Watch Demo Card */}
              <AdminContentWrapper sectionId="watch-demo" className="lg:col-span-1">
                <div className="bg-gradient-to-br from-lime-400 to-green-500 rounded-3xl p-8 text-black h-80 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-3xl mb-4">
                      {watchDemoContent?.title || 'Watch a Demo'}
                    </h3>
                    <p className="font-body text-green-800 mb-6">
                      {watchDemoContent?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>
                  {watchDemoContent?.button_text && <Button variant="outline" size="lg" className="rounded-full w-fit" style={{
                  borderColor: watchDemoContent.button_text_color || '#000000',
                  color: watchDemoContent.button_text_color || '#000000'
                }}>
                      {watchDemoContent.button_text}
                    </Button>}
                </div>
              </AdminContentWrapper>
            </div>
          </div>
        </section>
      </AdminContentWrapper>
      
      {/* Page Manager for Admins */}
      <PageManager />
    </Layout>;
}