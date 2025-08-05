import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Settings, 
  Plus,
  User,
  LogOut
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface ClearCentsNavigationProps {
  user?: SupabaseUser | null;
  onLogout?: () => void;
}

const ClearCentsNavigation = ({ user, onLogout }: ClearCentsNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleAddTransaction = () => {
    // This will be handled by the floating action button or quick add
    navigate("/settings");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-navy rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">C</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary">ClearCents</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Profile Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center space-x-2 pb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-navy rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-heading font-bold text-sm">C</span>
                      </div>
                      <span className="font-heading font-bold text-xl text-primary">ClearCents</span>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex-1 space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Mobile User Profile */}
                    {user && (
                      <div className="border-t pt-6 space-y-2">
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {user.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/profile");
                            setIsMenuOpen(false);
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            onLogout?.();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
          
          {/* Add Transaction Button */}
          <button
            onClick={handleAddTransaction}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-md transition-colors text-primary"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xs mt-1">Add</span>
          </button>

          {navigationItems.slice(2).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ClearCentsNavigation;