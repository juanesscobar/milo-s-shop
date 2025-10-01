import { useState } from 'react';
import LandingPage from '../LandingPage';
export default function LandingPageExample() {
    var _a = useState('es'), currentLanguage = _a[0], setCurrentLanguage = _a[1];
    var handleLanguageChange = function (language) {
        setCurrentLanguage(language);
        console.log('Language changed to:', language);
    };
    var handleBookNow = function () {
        console.log('Book now clicked - would navigate to booking flow');
    };
    var handleLogin = function () {
        console.log('Login clicked - would open login modal/page');
    };
    return (<LandingPage currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} onBookNow={handleBookNow} onLogin={handleLogin}/>);
}
