import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Plus, Target, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const QuickAddSidebar = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category_id: "",
    transaction_date: new Date()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingsProgress, setSavingsProgress] = useState(68); // Mock data
  const { toast } = useToast();

  const budgetTips = [
    "💡 Track every expense, no matter how small",
    "🎯 Use the 50/30/20 budgeting rule",
    "💰 Automate your savings transfers",
    "📊 Review your budget weekly",
    "🛍️ Wait 24 hours before major purchases"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    fetchCategories();
    
    // Rotate tips every 10 seconds
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % budgetTips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('budget_categories')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('transactions')
        .insert({
          description: formData.description,
          amount: -Math.abs(Number(formData.amount)), // Negative for expenses
          category_id: formData.category_id,
          transaction_date: format(formData.transaction_date, 'yyyy-MM-dd'),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully"
      });

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category_id: "",
        transaction_date: new Date()
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Transaction */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Plus className="h-5 w-5 text-primary" />
            <span>Quick Add</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Coffee shop"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.transaction_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.transaction_date ? format(formData.transaction_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.transaction_date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, transaction_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Monthly Savings Progress */}
      <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Target className="h-5 w-5 text-green-600" />
            <span>Savings Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Monthly Target</span>
              <span>{savingsProgress}%</span>
            </div>
            <Progress value={savingsProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              $680 of $1,000 saved this month
            </p>
          </div>
          <div className="bg-green-100/50 rounded-lg p-3">
            <p className="text-sm font-medium text-green-800">Great progress!</p>
            <p className="text-xs text-green-600">You're on track to meet your goal</p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Tips */}
      <Card className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 border-amber-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            <span>Tip of the Day</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-100/50 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-medium">
              {budgetTips[currentTip]}
            </p>
          </div>
          <div className="flex justify-center mt-3 space-x-1">
            {budgetTips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTip ? 'bg-amber-600' : 'bg-amber-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAddSidebar;