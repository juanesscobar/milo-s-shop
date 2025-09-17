import { useState } from 'react';
import PaymentSelector from '../PaymentSelector';

export default function PaymentSelectorExample() {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'pix' | 'cash' | null>(null);
  const [language, setLanguage] = useState<'es' | 'pt'>('es');

  const handleSelect = (method: 'card' | 'pix' | 'cash') => {
    setSelectedMethod(method);
    console.log('Payment method selected:', method);
  };

  const handleConfirmPayment = () => {
    console.log('Payment confirmed with method:', selectedMethod);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Payment Selector</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setLanguage('es')}
            className={`px-3 py-1 rounded text-sm ${language === 'es' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            ES
          </button>
          <button 
            onClick={() => setLanguage('pt')}
            className={`px-3 py-1 rounded text-sm ${language === 'pt' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            PT
          </button>
        </div>
      </div>
      
      <PaymentSelector
        selectedMethod={selectedMethod}
        amount={75000}
        onSelect={handleSelect}
        onConfirmPayment={handleConfirmPayment}
        language={language}
      />
    </div>
  );
}