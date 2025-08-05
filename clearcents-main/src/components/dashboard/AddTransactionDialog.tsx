import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

// Add Transaction Dialog Component

interface Category {
  id: string;
  name: string;
}

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddTransactionDialog = ({ open, onOpenChange, onSuccess }: AddTransactionDialogProps) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category_id: "",
    transaction_date: new Date().toISOString().split('T')[0],
    type: "expense", // expense or income
    paymentMethod: ""
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

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
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = parseFloat(formData.amount);
      const finalAmount = formData.type === "expense" ? -Math.abs(amount) : Math.abs(amount);

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          description: formData.description,
          amount: finalAmount,
          category_id: formData.category_id || null,
          transaction_date: formData.transaction_date
        });

      if (error) throw error;

      toast({
        title: "Transaction added",
        description: "Transaction has been recorded successfully",
      });

      setFormData({
        description: "",
        amount: "",
        category_id: "",
        transaction_date: new Date().toISOString().split('T')[0],
        type: "expense",
        paymentMethod: ""
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white p-0 gap-0">
        <div className="flex items-center justify-between p-6 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add new transaction
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type Radio Buttons */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="expense"
                name="type"
                value="expense"
                checked={formData.type === "expense"}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-4 h-4 text-lime-400 bg-gray-100 border-gray-300 focus:ring-lime-400"
              />
              <Label htmlFor="expense" className="text-gray-900 font-medium">
                Expense
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="income"
                name="type"
                value="income"
                checked={formData.type === "income"}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-4 h-4 text-lime-400 bg-gray-100 border-gray-300 focus:ring-lime-400"
              />
              <Label htmlFor="income" className="text-gray-900 font-medium">
                Income
              </Label>
            </div>
          </div>

          {/* Amount and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 font-medium">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="$100"
                className="bg-gray-50 border-gray-200 focus:border-lime-400 focus:ring-lime-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 font-medium">
                Category
              </Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-lime-400 focus:ring-lime-400">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="hover:bg-gray-50 focus:bg-gray-50"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method and Description Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-gray-700 font-medium">
                Type of payment
              </Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-lime-400 focus:ring-lime-400">
                  <SelectValue placeholder="Choose a type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="pumb" className="hover:bg-gray-50 focus:bg-gray-50">
                    Pumb
                  </SelectItem>
                  <SelectItem value="privatbank" className="hover:bg-gray-50 focus:bg-gray-50">
                    PrivatBank
                  </SelectItem>
                  <SelectItem value="monobank" className="hover:bg-gray-50 focus:bg-gray-50">
                    Monobank
                  </SelectItem>
                  <SelectItem value="oschadbank" className="hover:bg-gray-50 focus:bg-gray-50">
                    OschadBank
                  </SelectItem>
                  <SelectItem value="cash" className="hover:bg-gray-50 focus:bg-gray-50">
                    Cash
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Write a description"
                className="bg-gray-50 border-gray-200 focus:border-lime-400 focus:ring-lime-400 resize-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium"
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;