import { useState } from 'react';
import LandingPage from '../LandingPage';

export default function LandingPageExample() {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>('es');

  const handleLanguageChange = (language: 'es' | 'pt') => {
    setCurrentLanguage(language);
    console.log('Language changed to:', language);
  };

  const handleBookNow = () => {
    console.log('Book now clicked - would navigate to booking flow');
  };

  const handleLogin = () => {
    console.log('Login clicked - would open login modal/page');
  };

  return (
    <LandingPage
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
      onBookNow={handleBookNow}
      onLogin={handleLogin}
    />
  );
}