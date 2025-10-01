import { useState } from 'react';
import Home from '../Home';
export default function HomeExample() {
    var _a = useState('es'), language = _a[0], setLanguage = _a[1];
    return (<div>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={function () { return setLanguage('es'); }} className={"px-3 py-1 rounded text-sm ".concat(language === 'es' ? 'bg-primary text-white' : 'bg-card text-card-foreground')}>
          ES
        </button>
        <button onClick={function () { return setLanguage('pt'); }} className={"px-3 py-1 rounded text-sm ".concat(language === 'pt' ? 'bg-primary text-white' : 'bg-card text-card-foreground')}>
          PT
        </button>
      </div>
      
      <Home language={language}/>
    </div>);
}
