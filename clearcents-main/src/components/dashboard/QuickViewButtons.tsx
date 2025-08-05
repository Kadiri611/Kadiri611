import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, PieChart } from "lucide-react";

interface QuickViewButtonsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const QuickViewButtons = ({ activeView, onViewChange }: QuickViewButtonsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={activeView === "budget" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("budget")}
        className="flex items-center space-x-2"
      >
        <DollarSign className="h-4 w-4" />
        <span>Budget Overview</span>
      </Button>
      
      <Button
        variant={activeView === "trends" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("trends")}
        className="flex items-center space-x-2"
      >
        <TrendingUp className="h-4 w-4" />
        <span>Spending Trends</span>
      </Button>
      
      <Button
        variant={activeView === "categories" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("categories")}
        className="flex items-center space-x-2"
      >
        <PieChart className="h-4 w-4" />
        <span>Category Breakdown</span>
      </Button>
    </div>
  );
};

export default QuickViewButtons;