import { useState } from 'react';
import Home from '../Home';

export default function HomeExample() {
  const [language, setLanguage] = useState<'es' | 'pt'>('es');

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setLanguage('es')}
          className={`px-3 py-1 rounded text-sm ${language === 'es' ? 'bg-primary text-white' : 'bg-card text-card-foreground'}`}
        >
          ES
        </button>
        <button 
          onClick={() => setLanguage('pt')}
          className={`px-3 py-1 rounded text-sm ${language === 'pt' ? 'bg-primary text-white' : 'bg-card text-card-foreground'}`}
        >
          PT
        </button>
      </div>
      
      <Home language={language} />
    </div>
  );
}