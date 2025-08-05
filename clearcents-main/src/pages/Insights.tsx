import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Lightbulb, TrendingDown } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

// Sample data for the expenditure chart
const expenditureData = {
  daily: [
    { date: "Mon", amount: 45 },
    { date: "Tue", amount: 120 },
    { date: "Wed", amount: 89 },
    { date: "Thu", amount: 156 },
    { date: "Fri", amount: 203 },
    { date: "Sat", amount: 78 },
    { date: "Sun", amount: 92 }
  ],
  weekly: [
    { date: "Week 1", amount: 850 },
    { date: "Week 2", amount: 1200 },
    { date: "Week 3", amount: 950 },
    { date: "Week 4", amount: 1100 }
  ],
  monthly: [
    { date: "Jan", amount: 3200 },
    { date: "Feb", amount: 2800 },
    { date: "Mar", amount: 3500 },
    { date: "Apr", amount: 2900 },
    { date: "May", amount: 3800 },
    { date: "Jun", amount: 3100 }
  ]
};

const Insights = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "monthly">("daily");
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      setUser(user);
    } catch (error) {
      console.error("Error getting user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            Spent: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-h1 font-heading font-book text-primary mb-2">
              Insights
            </h1>
            <p className="text-body text-muted-foreground">
              Understand your spending patterns and discover opportunities to save more.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-8">
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-foreground">
                    Time Range:
                  </label>
                  <Select value={timeFilter} onValueChange={(value: "daily" | "weekly" | "monthly") => setTimeFilter(value)}>
                    <SelectTrigger className="w-48 rounded-lg border-border hover:border-accent transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Expenditure Chart */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-h3 font-heading font-book text-foreground">
                    Expenditure Overview
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your spending breakdown for the selected time period
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenditureData[timeFilter]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={formatCurrency}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="amount" 
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                          className="hover:fill-secondary transition-colors"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Tip Box */}
            <div className="lg:col-span-1">
              <Card className="border-border shadow-sm bg-gradient-to-br from-background to-accent/5">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Lightbulb className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-h4 font-heading font-book text-foreground">
                      AI Tip to Save More
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Reduce Dining Out Expenses
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You've spent 40% more on dining out this month compared to last month. 
                        Consider meal prepping 2-3 days a week to save approximately $180/month.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Potential monthly savings:</span>
                      <span className="font-medium text-accent">$180</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Quick Stats */}
              <Card className="border-border shadow-sm mt-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-h4 font-heading font-book text-foreground">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Month's Spending</span>
                    <span className="font-medium text-foreground">$2,845</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Daily</span>
                    <span className="font-medium text-foreground">$94.83</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Top Category</span>
                    <span className="font-medium text-secondary">Dining Out</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">vs Last Month</span>
                    <span className="font-medium text-destructive">+12%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;