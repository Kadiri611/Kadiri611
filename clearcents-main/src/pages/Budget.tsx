import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, TrendingUp, TrendingDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import AddCategoryDialog from "@/components/dashboard/AddCategoryDialog";

interface Category {
  id: string;
  name: string;
  budgeted_amount: number;
  spent_amount: number;
  icon?: string;
}

interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageSpent: number;
}

const Budget = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview>({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    percentageSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("budgets");
  const navigate = useNavigate();
  const { toast } = useToast();

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
      fetchBudgetData(user);
    } catch (error) {
      console.error("Error getting user:", error);
      navigate("/login");
    }
  };

  const fetchBudgetData = async (currentUser?: User) => {
    try {
      const userToUse = currentUser || user;
      if (!userToUse) return;

      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch categories with their spent amounts
      const { data: categoriesData } = await supabase
        .from('budget_categories')
        .select(`
          id,
          name,
          budgeted_amount,
          transactions!transactions_category_id_fkey(amount, transaction_date)
        `)
        .eq('user_id', userToUse.id)
        .order('name');

      const categoriesWithSpent = categoriesData?.map(category => {
        const currentMonthTransactions = category.transactions?.filter((txn: any) => {
          const txnDate = new Date(txn.transaction_date);
          return txnDate >= startOfMonth && txnDate <= endOfMonth;
        }) || [];

        const spent_amount = Math.abs(
          currentMonthTransactions.reduce((sum: number, txn: any) => sum + Number(txn.amount), 0)
        );

        return {
          id: category.id,
          name: category.name,
          budgeted_amount: Number(category.budgeted_amount),
          spent_amount,
          icon: getCategoryIcon(category.name)
        };
      }) || [];

      // Calculate overview
      const totalBudget = categoriesWithSpent.reduce((sum, cat) => sum + cat.budgeted_amount, 0);
      const totalSpent = categoriesWithSpent.reduce((sum, cat) => sum + cat.spent_amount, 0);
      const remaining = totalBudget - totalSpent;
      const percentageSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      setCategories(categoriesWithSpent);
      setBudgetOverview({
        totalBudget,
        totalSpent,
        remaining,
        percentageSpent: Math.min(percentageSpent, 100)
      });
    } catch (error) {
      console.error('Error fetching budget data:', error);
      toast({
        title: "Error",
        description: "Failed to load budget data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: { [key: string]: string } = {
      rent: "🏠",
      groceries: "🛒",
      food: "🍽️",
      transportation: "🚗",
      entertainment: "🎬",
      shopping: "🛍️",
      utilities: "⚡",
      healthcare: "🏥",
      education: "📚",
      fitness: "💪",
      travel: "✈️",
      savings: "💰",
    };
    
    const key = categoryName.toLowerCase();
    return iconMap[key] || "📊";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // TODO: Get from user settings
    }).format(amount);
  };

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 90) return "bg-orange-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-secondary";
  };

  const getDaysLeft = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const navItems = [
    { id: "insights", icon: TrendingUp, label: "Insights" },
    { id: "track", icon: Calendar, label: "Track" },
    { id: "budgets", icon: Plus, label: "Budgets" },
    { id: "categories", icon: TrendingDown, label: "Categories" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-h4 text-primary font-gilroy">Budgets</h1>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
            className="rounded-full w-10 h-10 p-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Overall Budget Gauge */}
      <div className="px-6 mb-8">
        <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block">
              {/* Semi-circular progress gauge */}
              <div className="relative w-48 h-24 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 50">
                  {/* Background arc */}
                  <path
                    d="M 10 45 A 35 35 0 0 1 90 45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 10 45 A 35 35 0 0 1 90 45"
                    fill="none"
                    stroke={budgetOverview.percentageSpent >= 90 ? "hsl(var(--destructive))" : 
                           budgetOverview.percentageSpent >= 75 ? "#f59e0b" : 
                           "hsl(var(--primary))"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${budgetOverview.percentageSpent * 1.25} 125`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <span className="text-3xl font-bold text-primary">
                    {Math.round(budgetOverview.percentageSpent)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-h5 font-semibold text-foreground">
                  {formatCurrency(budgetOverview.remaining)} left this month
                </p>
                <p className="text-body2 text-muted-foreground">
                  {getDaysLeft()} days remaining
                </p>
                <div className="flex justify-center gap-4 text-caption text-muted-foreground">
                  <span>Min: {formatCurrency(0)}</span>
                  <span>Max: {formatCurrency(budgetOverview.totalBudget)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category List */}
      <div className="px-6 space-y-4 pb-24">
        {categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No budget categories yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
              Create your first category
            </Button>
          </Card>
        ) : (
          categories.map((category) => {
            const percentageSpent = category.budgeted_amount > 0 
              ? (category.spent_amount / category.budgeted_amount) * 100 
              : 0;
            const isOverBudget = category.spent_amount > category.budgeted_amount;
            
            return (
              <Card 
                key={category.id} 
                className={`transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer
                  ${isOverBudget ? 'border-destructive/30 bg-destructive/5' : ''}
                `}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-caption text-muted-foreground">
                          {getDaysLeft()}d left
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={isOverBudget ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {Math.round(percentageSpent)}% spent
                        </Badge>
                      </div>
                      <p className={`text-body2 font-medium ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                        {formatCurrency(category.budgeted_amount - category.spent_amount)} left
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress 
                      value={Math.min(percentageSpent, 100)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center py-3 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavItem(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => fetchBudgetData()}
      />
    </DashboardLayout>
  );
};

export default Budget;