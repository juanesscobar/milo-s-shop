import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

interface HeaderProps {
  currentLanguage: 'es' | 'pt';
  onLanguageChange: (language: 'es' | 'pt') => void;
}

export default function Header({ currentLanguage, onLanguageChange }: HeaderProps) {
  const { isAuthenticated, logout, isLoggingOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <img
            src="/milos-logo.png"
            alt="Milos'Shop logo"
            className="h-8 w-8"
            onError={(e) => {
              // Hide broken image if logo not found
              e.currentTarget.style.display = 'none';
            }}
          />
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Milos'Shop
          </Link>
        </div>

        <nav className="flex items-center space-x-3">
          {isAuthenticated && user && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Bienvenido, {user.name}</span>
            </div>
          )}
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              Home
            </Button>
          </Link>
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? 'Saliendo...' : 'Salir'}
            </Button>
          )}
          <LanguageToggle
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        </nav>
      </div>
    </header>
  );
}