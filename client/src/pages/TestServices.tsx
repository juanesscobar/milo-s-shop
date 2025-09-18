import { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import servicesData from '../data/services.json';
import type { Service } from '@shared/schema';

export default function TestServices() {
  const [language, setLanguage] = useState<'es' | 'pt'>('es');

  const handleServiceSelect = (slug: string) => {
    console.log('Serviço selecionado:', slug);
    alert(`Serviço selecionado: ${slug}`);
  };

  const handleGenerateImage = (slug: string) => {
    console.log('Gerar imagem para:', slug);
    alert(`Gerar imagem para: ${slug}`);
  };

  const handleLanguageToggle = () => {
    setLanguage(current => current === 'es' ? 'pt' : 'es');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '10px' }}>
            Milos'Shop - Serviços
          </h1>
          <button 
            onClick={handleLanguageToggle}
            style={{
              background: '#E10600',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {language === 'es' ? 'Português' : 'Español'}
          </button>
        </div>

        {/* Services Grid */}
        <div style={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
        }}>
          {servicesData.map(service => (
            <ServiceCard
              key={service.slug}
              service={service as unknown as Service}
              language={language}
              onReserve={handleServiceSelect}
              onGenerateImage={handleGenerateImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}