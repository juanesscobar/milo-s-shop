import { useState } from 'react';
import VehicleSelector from '../VehicleSelector';

export default function VehicleSelectorExample() {
  const [selectedType, setSelectedType] = useState<'auto' | 'suv' | 'camioneta' | null>(null);

  const handleSelect = (type: 'auto' | 'suv' | 'camioneta') => {
    setSelectedType(type);
    console.log('Vehicle type selected:', type);
  };

  return (
    <div className="p-4 space-y-4">
      <VehicleSelector 
        selectedType={selectedType}
        onSelect={handleSelect}
      />
      
      {selectedType && (
        <div className="text-sm text-muted-foreground">
          Tipo seleccionado: <span className="font-medium">{selectedType}</span>
        </div>
      )}
    </div>
  );
}