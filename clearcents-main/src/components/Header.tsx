import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useBrandingSettings } from "@/contexts/BrandingContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { settings: brandingSettings, loading: brandingLoading } = useBrandingSettings();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {brandingSettings?.logo_url ? (
              <img 
                src={brandingSettings.logo_url} 
                alt={brandingSettings.business_name || "Logo"} 
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="font-heading font-bold text-xl text-navy">
              {brandingSettings?.business_name || 'ClearCents'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-body font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-navy border-b-2 border-navy pb-1"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : user ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="default" className="text-black hover:text-black">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="default">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-navy hover:text-navy-light"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-body font-medium px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-navy bg-mint-light"
                      : "text-muted-foreground hover:text-navy hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {loading ? (
                <div className="px-4 text-sm text-muted-foreground">Loading...</div>
              ) : user ? (
                <div className="px-4 border-t pt-4">
                  <UserProfileDropdown />
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4">
                    <Button variant="ghost" size="default" className="w-full text-black hover:text-black">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="px-4">
                    <Button variant="hero" size="default" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;