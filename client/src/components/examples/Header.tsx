import { useState } from 'react';
import Header from '../Header';

export default function HeaderExample() {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>('es');

  const handleLanguageChange = (language: 'es' | 'pt') => {
    setCurrentLanguage(language);
    console.log('Language changed to:', language);
  };

  return (
    <div>
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <div className="p-4 text-sm text-muted-foreground">
        Current language: {currentLanguage}
      </div>
    </div>
  );
}