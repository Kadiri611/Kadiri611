import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, User, Mail, Lock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.name,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-mint-light/50 to-white min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Form */}
            <div className="order-2 lg:order-1">
              <Card className="border-2 border-mint shadow-2xl">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-heading font-bold text-2xl text-navy">ClearCents</span>
                  </div>
                  <h1 className="font-heading font-bold text-3xl text-navy mb-2">
                    Start your free trial today
                  </h1>
                  <p className="font-body text-muted-foreground">
                    Join thousands of users taking control of their finances
                  </p>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body font-medium text-navy">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-2 border-mint-light focus:border-mint"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body font-medium text-navy">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-2 border-mint-light focus:border-mint"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-body font-medium text-navy">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-2 border-mint-light focus:border-mint"
                          placeholder="Create a secure password"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create My Account"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                  
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    No credit card required to start
                  </p>
                  
                  <div className="text-center mt-6 pt-6 border-t">
                    <p className="font-body text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-navy font-semibold hover:text-navy-light">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Benefits */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading font-bold text-4xl text-navy mb-4">
                    Why choose ClearCents?
                  </h2>
                  <p className="font-body text-lg text-muted-foreground">
                    Everything you need to budget like a pro, without the complexity.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-navy">1</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-navy mb-2">
                        Quick Setup
                      </h3>
                      <p className="font-body text-muted-foreground">
                        Get your budget up and running in just a few minutes with our guided setup process.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-navy">2</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-navy mb-2">
                        Zero-Based Budgeting
                      </h3>
                      <p className="font-body text-muted-foreground">
                        Give every dollar a purpose with the proven zero-based budgeting method.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-navy">3</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-navy mb-2">
                        Works Everywhere
                      </h3>
                      <p className="font-body text-muted-foreground">
                        Access your budget from any device with automatic cloud sync.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint to-mint-light rounded-2xl p-6">
                  <div className="text-center">
                    <h3 className="font-heading font-bold text-2xl text-navy mb-2">
                      14-Day Free Trial
                    </h3>
                    <p className="font-body text-navy-light">
                      Try all features risk-free. Cancel anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SignUp;