import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink } from "lucide-react";

const SubscriptionCard = () => {
  // Mock subscription data - in a real app, this would come from your subscription service
  const subscription = {
    planName: "ClearCents Monthly",
    status: "active" as const,
    renewalDate: "2024-09-04",
    price: "$9.99/month"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'trial':
        return <Badge variant="secondary">Trial</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdatePayment = () => {
    // In a real app, this would redirect to Stripe billing portal
    console.log("Redirecting to billing portal...");
  };

  const handleManageSubscription = () => {
    // In a real app, this would open subscription management
    console.log("Opening subscription management...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subscription Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">{subscription.planName}</h3>
              <p className="text-sm text-muted-foreground">{subscription.price}</p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>

          {subscription.status === 'active' && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Next Billing Date</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(subscription.renewalDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Management Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button variant="outline" onClick={handleUpdatePayment} className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
          <Button onClick={handleManageSubscription}>
            Manage Subscription
          </Button>
        </div>

        {/* Billing History Link */}
        <div className="pt-2 border-t border-border">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View Billing History
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;