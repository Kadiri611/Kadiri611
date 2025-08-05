import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import ClearCentsNavigation from "@/components/ClearCentsNavigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Moon, 
  Sun, 
  Bell, 
  DollarSign, 
  Keyboard, 
  Shield, 
  Globe, 
  Database,
  Upload,
  Download,
  RotateCcw,
  Palette
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [authentication, setAuthentication] = useState(true);
  const [incomeTracking, setIncomeTracking] = useState(true);
  const [displayCents, setDisplayCents] = useState(true);
  const [upcomingLogs, setUpcomingLogs] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserRole(user);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <ClearCentsNavigation user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1 font-body">
              Manage your preferences and app configuration
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>General</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appearance */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Appearance</Label>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  <Moon className="w-4 h-4" />
                </div>
              </div>

              <Separator />

              {/* App Icon */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">App Icon</Label>
                  <div className="text-sm text-muted-foreground">
                    Choose your preferred app icon theme
                  </div>
                </div>
                <Select defaultValue="default">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive spending alerts and reminders
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </div>

              <Separator />

              {/* Currency */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Currency</Label>
                  <div className="text-sm text-muted-foreground">
                    Select your preferred currency
                  </div>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="cad">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Number Entry Type */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Number Entry Type</Label>
                  <div className="text-sm text-muted-foreground">
                    Choose how you prefer to enter amounts
                  </div>
                </div>
                <Select defaultValue="decimal">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decimal">Decimal (12.50)</SelectItem>
                    <SelectItem value="whole">Whole Numbers (1250)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Financial Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Financial</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authentication */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Authentication</Label>
                  <div className="text-sm text-muted-foreground">
                    Require authentication to access the app
                  </div>
                </div>
                <Switch checked={authentication} onCheckedChange={setAuthentication} />
              </div>

              <Separator />

              {/* Income Tracking */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Income Tracking</Label>
                  <div className="text-sm text-muted-foreground">
                    Track income alongside expenses
                  </div>
                </div>
                <Switch checked={incomeTracking} onCheckedChange={setIncomeTracking} />
              </div>

              <Separator />

              {/* Display Cents */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Display Cents</Label>
                  <div className="text-sm text-muted-foreground">
                    Show cents in amounts (e.g., $12.50 vs $13)
                  </div>
                </div>
                <Switch checked={displayCents} onCheckedChange={setDisplayCents} />
              </div>

              <Separator />

              {/* Upcoming Logs */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Upcoming Logs Visibility</Label>
                  <div className="text-sm text-muted-foreground">
                    Show future scheduled transactions
                  </div>
                </div>
                <Switch checked={upcomingLogs} onCheckedChange={setUpcomingLogs} />
              </div>

              <Separator />

              {/* Month Start */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Start of Month</Label>
                  <div className="text-sm text-muted-foreground">
                    Choose when your budget month begins
                  </div>
                </div>
                <Select defaultValue="1">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Manage Categories */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Manage Categories</Label>
                  <div className="text-sm text-muted-foreground">
                    Add, edit, or remove budget categories
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Manage
                </Button>
              </div>

              <Separator />

              {/* Cloud Sync */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Cloud Sync</Label>
                  <div className="text-sm text-muted-foreground">
                    Sync your data across devices
                  </div>
                </div>
                <Switch checked={cloudSync} onCheckedChange={setCloudSync} />
              </div>

              <Separator />

              {/* Import/Export */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Import/Export Data</Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    Backup or restore your financial data
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin - Branding Management */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Website Administration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Branding */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Brand Management</Label>
                    <div className="text-sm text-muted-foreground">
                      Manage business logo, name, and brand colors
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/admin/branding")}>
                    Manage
                  </Button>
                </div>

                <Separator />

                {/* Pages */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Page Management</Label>
                    <div className="text-sm text-muted-foreground">
                      Create and manage dynamic pages
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/admin/pages")}>
                    Manage
                  </Button>
                </div>

                <Separator />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Footer Management</Label>
                    <div className="text-sm text-muted-foreground">
                      Manage footer links and social media
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/admin/footer")}>
                    Manage
                  </Button>
                </div>

                <Separator />

                {/* FAQ */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">FAQ Management</Label>
                    <div className="text-sm text-muted-foreground">
                      Add and manage frequently asked questions
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/admin/faq")}>
                    Manage
                  </Button>
                </div>

                <Separator />

                {/* Packages */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pricing Management</Label>
                    <div className="text-sm text-muted-foreground">
                      Manage pricing packages and content
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/admin/packages")}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reset Section */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="font-heading flex items-center space-x-2 text-destructive">
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Reset All Data</Label>
                  <div className="text-sm text-muted-foreground">
                    Permanently delete all transactions and budgets
                  </div>
                </div>
                <Button variant="destructive">
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;