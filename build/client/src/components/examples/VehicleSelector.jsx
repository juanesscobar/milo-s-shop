import { useState } from 'react';
import VehicleSelector from '../VehicleSelector';
export default function VehicleSelectorExample() {
    var _a = useState(null), selectedType = _a[0], setSelectedType = _a[1];
    var handleSelect = function (type) {
        setSelectedType(type);
        console.log('Vehicle type selected:', type);
    };
    return (<div className="p-4 space-y-4">
      <VehicleSelector selectedType={selectedType} onSelect={handleSelect}/>
      
      {selectedType && (<div className="text-sm text-muted-foreground">
          Tipo seleccionado: <span className="font-medium">{selectedType}</span>
        </div>)}
    </div>);
}
