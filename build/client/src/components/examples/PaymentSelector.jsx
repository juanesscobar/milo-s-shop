import { useState } from 'react';
import PaymentSelector from '../PaymentSelector';
export default function PaymentSelectorExample() {
    var _a = useState(null), selectedMethod = _a[0], setSelectedMethod = _a[1];
    var _b = useState('es'), language = _b[0], setLanguage = _b[1];
    var handleSelect = function (method) {
        setSelectedMethod(method);
        console.log('Payment method selected:', method);
    };
    var handleConfirmPayment = function () {
        console.log('Payment confirmed with method:', selectedMethod);
    };
    return (<div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Payment Selector</h3>
        <div className="flex gap-2">
          <button onClick={function () { return setLanguage('es'); }} className={"px-3 py-1 rounded text-sm ".concat(language === 'es' ? 'bg-primary text-white' : 'bg-gray-200')}>
            ES
          </button>
          <button onClick={function () { return setLanguage('pt'); }} className={"px-3 py-1 rounded text-sm ".concat(language === 'pt' ? 'bg-primary text-white' : 'bg-gray-200')}>
            PT
          </button>
        </div>
      </div>
      
      <PaymentSelector selectedMethod={selectedMethod} amount={75000} onSelect={handleSelect} onConfirmPayment={handleConfirmPayment} language={language}/>
    </div>);
}
