import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
var languages = {
    es: { name: 'Español', flag: '🇪🇸' },
    pt: { name: 'Português', flag: '🇧🇷' }
};
export default function LanguageToggle(_a) {
    var currentLanguage = _a.currentLanguage, onLanguageChange = _a.onLanguageChange;
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-language-toggle">
          <Globe className="h-4 w-4"/>
          <span className="hidden sm:inline">
            {languages[currentLanguage].flag} {languages[currentLanguage].name}
          </span>
          <span className="sm:hidden">
            {languages[currentLanguage].flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(function (_a) {
            var code = _a[0], lang = _a[1];
            return (<DropdownMenuItem key={code} onClick={function () { return onLanguageChange(code); }} className={"gap-2 ".concat(currentLanguage === code ? 'bg-accent' : '')} data-testid={"menu-item-language-".concat(code)}>
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>);
        })}
      </DropdownMenuContent>
    </DropdownMenu>);
}
