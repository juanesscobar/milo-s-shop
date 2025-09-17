import { useState } from 'react';
import LanguageToggle from '../LanguageToggle';

export default function LanguageToggleExample() {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>('es');

  const handleLanguageChange = (language: 'es' | 'pt') => {
    setCurrentLanguage(language);
    console.log('Language changed to:', language);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Seleccionar idioma</h3>
        <LanguageToggle 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Idioma actual: <span className="font-medium">{currentLanguage === 'es' ? 'Español' : 'Português'}</span>
      </div>
    </div>
  );
}