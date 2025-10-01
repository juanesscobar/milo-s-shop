import { useState } from 'react';
import LanguageToggle from '../LanguageToggle';
export default function LanguageToggleExample() {
    var _a = useState('es'), currentLanguage = _a[0], setCurrentLanguage = _a[1];
    var handleLanguageChange = function (language) {
        setCurrentLanguage(language);
        console.log('Language changed to:', language);
    };
    return (<div className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Seleccionar idioma</h3>
        <LanguageToggle currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange}/>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Idioma actual: <span className="font-medium">{currentLanguage === 'es' ? 'Español' : 'Português'}</span>
      </div>
    </div>);
}
