import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SummaryData {
  totalBudgeted: number;
  totalSpent: number;
  remaining: number;
  transactionCount: number;
}

const SummaryCards = () => {
  const [data, setData] = useState<SummaryData>({
    totalBudgeted: 0,
    totalSpent: 0,
    remaining: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch budget categories
      const { data: categories } = await supabase
        .from('budget_categories')
        .select('budgeted_amount')
        .eq('user_id', user.id);

      // Fetch transactions for current month
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .gte('transaction_date', startOfMonth.toISOString().split('T')[0])
        .lte('transaction_date', endOfMonth.toISOString().split('T')[0]);

      const totalBudgeted = categories?.reduce((sum, cat) => sum + Number(cat.budgeted_amount), 0) || 0;
      const totalSpent = Math.abs(transactions?.reduce((sum, txn) => sum + Number(txn.amount), 0) || 0);
      const remaining = totalBudgeted - totalSpent;
      const transactionCount = transactions?.length || 0;

      setData({
        totalBudgeted,
        totalSpent,
        remaining,
        transactionCount
      });
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-20 mb-1"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Budgeted
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(data.totalBudgeted)}
          </div>
          <p className="text-xs text-muted-foreground">
            This month's budget
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-destructive">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(data.totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            Expenses this month
          </p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${data.remaining >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Remaining
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.remaining)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.remaining >= 0 ? 'Under budget' : 'Over budget'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Transactions
          </CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {data.transactionCount}
          </div>
          <p className="text-xs text-muted-foreground">
            This month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;