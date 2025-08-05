import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "./DateFilter";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
interface TrendData {
  date: string;
  spent: number;
  budgeted: number;
}
interface TrendChartProps {
  dateRange: DateRange;
}
const TrendChart = ({
  dateRange
}: TrendChartProps) => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTrendData();
  }, [dateRange]);
  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get daily budget allocation
      const {
        data: categories
      } = await supabase.from('budget_categories').select('budgeted_amount').eq('user_id', user.id);
      const totalBudget = categories?.reduce((sum, cat) => sum + Number(cat.budgeted_amount), 0) || 0;

      // Get all days in the range
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to
      });
      const daysInMonth = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth() + 1, 0).getDate();
      const dailyBudget = totalBudget / daysInMonth;

      // Fetch transactions for the period
      const {
        data: transactions
      } = await supabase.from('transactions').select('amount, transaction_date').eq('user_id', user.id).gte('transaction_date', dateRange.from.toISOString().split('T')[0]).lte('transaction_date', dateRange.to.toISOString().split('T')[0]);

      // Create data points for each day
      const trendData: TrendData[] = days.map(day => {
        const dayTransactions = transactions?.filter(t => isSameDay(new Date(t.transaction_date), day)) || [];
        const dailySpent = Math.abs(dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0));
        return {
          date: format(day, 'MMM dd'),
          spent: dailySpent,
          budgeted: dailyBudget
        };
      });
      setData(trendData);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => <p key={index} className="text-sm" style={{
          color: entry.color
        }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>)}
        </div>;
    }
    return null;
  };
  if (loading) {
    return <Card className="h-96">
        <CardHeader>
          <CardTitle>Spending Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>;
  }
  return <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Spending Trend Over Time</span>
          <span className="text-2xl">
        </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E76F51" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#E76F51" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tick={{
            fontSize: 12
          }} tickLine={false} />
            <YAxis tick={{
            fontSize: 12
          }} tickLine={false} tickFormatter={value => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="spent" stroke="#E76F51" strokeWidth={2} fill="url(#spentGradient)" name="Daily Spent" />
            <Line type="monotone" dataKey="budgeted" stroke="#1D3557" strokeWidth={2} strokeDasharray="5 5" name="Daily Budget" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export default TrendChart;