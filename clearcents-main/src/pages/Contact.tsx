import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Clock, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally send the message
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
            We'd love to hear from you
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/80">
            Have questions? Need help? Just want to say hello? Get in touch!
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-2 border-primary/20 shadow-xl">
                <CardHeader>
                  <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
                    Send us a message
                  </h2>
                  <p className="font-body text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body font-medium text-foreground">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-12 border-2 border-primary/20 focus:border-primary"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body font-medium text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12 border-2 border-primary/20 focus:border-primary"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-body font-medium text-foreground">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="min-h-32 border-2 border-primary/20 focus:border-primary resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3"
                    >
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
                  Get in touch
                </h2>
                <p className="font-body text-lg text-muted-foreground mb-8">
                  We're here to help! Whether you have questions about features, need technical support, or just want to share feedback, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                          Email Support
                        </h3>
                        <p className="font-body text-muted-foreground mb-2">
                          Drop us a line anytime at:
                        </p>
                        <a
                          href="mailto:hello@finsuite.com"
                          className="font-body font-semibold text-primary hover:text-primary/80 text-lg"
                        >
                          hello@finsuite.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                          Response Time
                        </h3>
                        <p className="font-body text-muted-foreground">
                          We typically reply within 24 hours during business days. For urgent issues, we often respond much faster!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                          What to expect
                        </h3>
                        <p className="font-body text-muted-foreground">
                          Our support team is friendly, knowledgeable, and genuinely cares about helping you succeed with your budgeting goals.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6">
                <div className="text-center">
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                    Need help getting started?
                  </h3>
                  <p className="font-body text-muted-foreground mb-4">
                    Check out our quick start guide and tutorials to get the most out of FinSuite.
                  </p>
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                    View Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Common Questions
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Quick answers to questions you might have.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  How do I reset my password?
                </h3>
                <p className="font-body text-muted-foreground">
                  Use the "Forgot Password" link on the login page, and we'll send you reset instructions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Can I import data from other apps?
                </h3>
                <p className="font-body text-muted-foreground">
                  Currently, FinSuite focuses on manual entry for maximum accuracy and awareness of your spending.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Is my financial data secure?
                </h3>
                <p className="font-body text-muted-foreground">
                  Yes! We use bank-level encryption and never store sensitive financial account information.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Do you offer business accounts?
                </h3>
                <p className="font-body text-muted-foreground">
                  FinSuite is designed for personal budgeting. We're exploring business features for the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;