import { useState } from 'react';
import Header from '../Header';
export default function HeaderExample() {
    var _a = useState('es'), currentLanguage = _a[0], setCurrentLanguage = _a[1];
    var handleLanguageChange = function (language) {
        setCurrentLanguage(language);
        console.log('Language changed to:', language);
    };
    return (<div>
      <Header currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange}/>
      <div className="p-4 text-sm text-muted-foreground">
        Current language: {currentLanguage}
      </div>
    </div>);
}
