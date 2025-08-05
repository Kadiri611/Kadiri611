import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "./DateFilter";

interface CategoryData {
  name: string;
  amount: number;
  budgeted: number;
  color: string;
}

interface SpendingChartProps {
  dateRange: DateRange;
}

const COLORS = [
  '#1D3557', // Navy Blue
  '#A8DADC', // Mint Green
  '#E9C46A', // Warm Gold
  '#F1FAEE', // Light Mint
  '#457B9D', // Medium Blue
  '#2A9D8F', // Teal
  '#E76F51', // Coral
  '#264653', // Dark Teal
];

const SpendingChart = ({ dateRange }: SpendingChartProps) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [dateRange]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch categories with their transactions
      const { data: categories } = await supabase
        .from('budget_categories')
        .select(`
          id,
          name,
          budgeted_amount,
          transactions!transactions_category_id_fkey(amount, transaction_date)
        `)
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (!categories) return;

      const categoryData: CategoryData[] = categories.map((category, index) => {
        const transactions = category.transactions.filter(
          (t: any) => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
          }
        );
        
        const totalSpent = Math.abs(
          transactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0)
        );

        return {
          name: category.name,
          amount: totalSpent,
          budgeted: Number(category.budgeted_amount),
          color: COLORS[index % COLORS.length]
        };
      }).filter(cat => cat.amount > 0); // Only show categories with spending

      setData(categoryData);
    } catch (error) {
      console.error('Error fetching category data:', error);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Spent: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            Budget: {formatCurrency(data.budgeted)}
          </p>
          <p className="text-sm font-medium">
            {((data.amount / data.budgeted) * 100).toFixed(1)}% of budget
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-muted-foreground">
          No spending data for the selected period
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="budgeted" 
              fill="#A8DADC" 
              name="Budget"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="amount" 
              fill="#1D3557" 
              name="Spent"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;