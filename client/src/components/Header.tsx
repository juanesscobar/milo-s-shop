import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  currentLanguage: 'es' | 'pt';
  onLanguageChange: (language: 'es' | 'pt') => void;
}

export default function Header({ currentLanguage, onLanguageChange }: HeaderProps) {
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
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              Home
            </Button>
          </Link>
          <LanguageToggle 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        </nav>
      </div>
    </header>
  );
}