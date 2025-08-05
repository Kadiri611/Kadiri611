import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, ChevronDown, Shield, Globe, FileText, Package, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function UserProfileDropdown() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error logging out');
        console.error('Logout error:', error);
      } else {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  const userInitials = user.email?.charAt(0).toUpperCase() || 'U';
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-white text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block font-medium text-foreground">{displayName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-background border border-border shadow-lg z-50" 
        align="end"
      >
        <div className="px-3 py-2 border-b border-border">
          <p className="text-sm font-medium text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        

        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Shield className="w-4 h-4 mr-2" />
                Website Administration
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background border border-border shadow-lg">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin/footer" className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Manage Footer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin/pages" className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Pages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin/faq" className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Manage FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin/packages" className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Package Configurator
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}