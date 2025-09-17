import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  currentLanguage: 'es' | 'pt';
  onLanguageChange: (language: 'es' | 'pt') => void;
}

const languages = {
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇧🇷' }
};

export default function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          data-testid="button-language-toggle"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages[currentLanguage].flag} {languages[currentLanguage].name}
          </span>
          <span className="sm:hidden">
            {languages[currentLanguage].flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => onLanguageChange(code as 'es' | 'pt')}
            className={`gap-2 ${currentLanguage === code ? 'bg-accent' : ''}`}
            data-testid={`menu-item-language-${code}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}