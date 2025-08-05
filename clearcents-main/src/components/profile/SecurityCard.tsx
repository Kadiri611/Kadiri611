import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Key, Shield, Link, Unlink } from "lucide-react";

interface SecurityCardProps {
  user: User;
}

const SecurityCard = ({ user }: SecurityCardProps) => {
  // Check if user signed up with OAuth providers
  const isGoogleConnected = user.app_metadata?.providers?.includes('google');
  const isAppleConnected = user.app_metadata?.providers?.includes('apple');
  const isEmailAuth = !isGoogleConnected && !isAppleConnected;

  const handleChangePassword = () => {
    // In a real app, this would open a change password modal or redirect
    console.log("Opening change password dialog...");
  };

  const handleDisconnectProvider = (provider: string) => {
    // In a real app, this would disconnect the OAuth provider
    console.log(`Disconnecting ${provider}...`);
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    // In a real app, this would enable/disable 2FA
    console.log(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Section */}
        {isEmailAuth && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-foreground">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: Never
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        )}

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="two-factor" 
              disabled 
              onCheckedChange={handleTwoFactorToggle}
            />
            <Label htmlFor="two-factor" className="sr-only">
              Enable two-factor authentication
            </Label>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Connected Accounts</h3>
          
          {/* Google Account */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">G</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Google</h4>
                <p className="text-sm text-muted-foreground">
                  {isGoogleConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isGoogleConnected ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDisconnectProvider('google')}
                className="text-destructive hover:text-destructive"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>

          {/* Apple Account */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm">🍎</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Apple</h4>
                <p className="text-sm text-muted-foreground">
                  {isAppleConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isAppleConnected ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDisconnectProvider('apple')}
                className="text-destructive hover:text-destructive"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;