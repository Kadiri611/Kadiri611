import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddCategoryDialog from "./AddCategoryDialog";

interface Category {
  id: string;
  name: string;
  budgeted_amount: number;
  spent_amount: number;
}

const BudgetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
        .eq('user_id', user.id)
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
          spent_amount
        };
      }) || [];

      setCategories(categoriesWithSpent);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load budget categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('budget_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Category deleted",
        description: "Budget category has been removed successfully",
      });

      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgressPercentage = (spent: number, budgeted: number) => {
    if (budgeted === 0) return 0;
    return Math.min((spent / budgeted) * 100, 100);
  };

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = getProgressPercentage(spent, budgeted);
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-2 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Budget Categories</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No budget categories yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
                Create your first category
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Budgeted: {formatCurrency(category.budgeted_amount)}</span>
                        <span>Spent: {formatCurrency(category.spent_amount)}</span>
                        <span>Remaining: {formatCurrency(category.budgeted_amount - category.spent_amount)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getProgressPercentage(category.spent_amount, category.budgeted_amount).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(category.spent_amount, category.budgeted_amount)} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddCategoryDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchCategories}
      />
    </>
  );
};

export default BudgetCategories;