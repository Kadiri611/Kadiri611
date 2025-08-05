import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "./DateFilter";
import { format } from "date-fns";
interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  budget_categories: {
    name: string;
  } | null;
}
interface EnhancedTransactionsTableProps {
  dateRange: DateRange;
}
const EnhancedTransactionsTable = ({
  dateRange
}: EnhancedTransactionsTableProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [amountRange, setAmountRange] = useState([0, 1000]);
  const [categories, setCategories] = useState<{
    name: string;
  }[]>([]);
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [dateRange]);
  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, selectedCategory, selectedType, amountRange]);
  const fetchCategories = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data
      } = await supabase.from('budget_categories').select('name').eq('user_id', user.id);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data
      } = await supabase.from('transactions').select(`
          id,
          description,
          amount,
          transaction_date,
          budget_categories(name)
        `).eq('user_id', user.id).gte('transaction_date', dateRange.from.toISOString().split('T')[0]).lte('transaction_date', dateRange.to.toISOString().split('T')[0]).order('transaction_date', {
        ascending: false
      });
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.budget_categories?.name === selectedCategory);
    }

    // Type filter (Income/Expense)
    if (selectedType !== "all") {
      if (selectedType === "income") {
        filtered = filtered.filter(t => t.amount > 0);
      } else if (selectedType === "expense") {
        filtered = filtered.filter(t => t.amount < 0);
      }
    }

    // Amount range filter
    filtered = filtered.filter(t => {
      const absAmount = Math.abs(t.amount);
      return absAmount >= amountRange[0] && absAmount <= amountRange[1];
    });
    setFilteredTransactions(filtered);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>;
  }
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span>Recent Transactions</span>
            <span className="text-2xl">
          </span>
          </span>
          <Button size="sm" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount Range</label>
            <Slider value={amountRange} onValueChange={setAmountRange} max={1000} step={10} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${amountRange[0]}</span>
              <span>${amountRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                  <th className="text-center p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => <tr key={transaction.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm">
                      {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4 font-medium">
                      {transaction.description}
                    </td>
                    <td className="p-4">
                      {transaction.budget_categories?.name ? <Badge variant="secondary">
                          {transaction.budget_categories.name}
                        </Badge> : <span className="text-muted-foreground text-sm">Uncategorized</span>}
                    </td>
                    <td className={`p-4 text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your filters
            </div>}
        </div>
      </CardContent>
    </Card>;
};
export default EnhancedTransactionsTable;