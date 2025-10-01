import { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import servicesData from '../data/services.json';
export default function TestServices() {
    var _a = useState('es'), language = _a[0], setLanguage = _a[1];
    var handleServiceSelect = function (slug) {
        console.log('Serviço selecionado:', slug);
        alert("Servi\u00E7o selecionado: ".concat(slug));
    };
    var handleGenerateImage = function (slug) {
        console.log('Gerar imagem para:', slug);
        alert("Gerar imagem para: ".concat(slug));
    };
    var handleLanguageToggle = function () {
        setLanguage(function (current) { return current === 'es' ? 'pt' : 'es'; });
    };
    return (<div style={{ minHeight: '100vh', backgroundColor: '#000', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '10px' }}>
            Milos'Shop - Serviços
          </h1>
          <button onClick={handleLanguageToggle} style={{
            background: '#E10600',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
        }}>
            {language === 'es' ? 'Português' : 'Español'}
          </button>
        </div>

        {/* Services Grid */}
        <div style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
        }}>
          {servicesData.map(function (service) { return (<ServiceCard key={service.slug} service={service} language={language} onReserve={handleServiceSelect} onGenerateImage={handleGenerateImage}/>); })}
        </div>
      </div>
    </div>);
}
