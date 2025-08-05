import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CreditCard, Banknote, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "./DateFilter";

interface SummaryData {
  totalBudgeted: number;
  totalSpent: number;
  remaining: number;
  transactionCount: number;
}

interface ModernSummaryCardsProps {
  dateRange: DateRange;
}

const ModernSummaryCards = ({ dateRange }: ModernSummaryCardsProps) => {
  const [data, setData] = useState<SummaryData>({
    totalBudgeted: 0,
    totalSpent: 0,
    remaining: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaryData();
  }, [dateRange]);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch budget categories
      const { data: categories } = await supabase
        .from('budget_categories')
        .select('budgeted_amount')
        .eq('user_id', user.id);

      // Fetch transactions for date range
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .gte('transaction_date', dateRange.from.toISOString().split('T')[0])
        .lte('transaction_date', dateRange.to.toISOString().split('T')[0]);

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

  const cards = [
    {
      title: "Total Budgeted",
      value: data.totalBudgeted,
      icon: Briefcase,
      gradient: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/50"
    },
    {
      title: "Total Spent",
      value: data.totalSpent,
      icon: CreditCard,
      gradient: "from-red-500/20 to-red-600/20",
      iconColor: "text-red-600",
      bgColor: "bg-red-50/50"
    },
    {
      title: "Remaining",
      value: data.remaining,
      icon: Banknote,
      gradient: data.remaining >= 0 ? "from-green-500/20 to-green-600/20" : "from-red-500/20 to-red-600/20",
      iconColor: data.remaining >= 0 ? "text-green-600" : "text-red-600",
      bgColor: data.remaining >= 0 ? "bg-green-50/50" : "bg-red-50/50"
    },
    {
      title: "Transactions This Period",
      value: data.transactionCount,
      icon: Receipt,
      gradient: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/50",
      isCount: true
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse h-32">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-24 mb-4"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`relative overflow-hidden backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${card.bgColor}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {card.title}
              </h3>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {card.isCount ? card.value : formatCurrency(card.value)}
              </p>
              {!card.isCount && card.title === "Remaining" && (
                <p className={`text-xs ${data.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.remaining >= 0 ? 'Under budget' : 'Over budget'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModernSummaryCards;