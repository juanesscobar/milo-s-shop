import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Truck, Caravan } from "lucide-react";

interface VehicleSelectorProps {
  selectedType: 'auto' | 'suv' | 'camioneta' | null;
  onSelect: (type: 'auto' | 'suv' | 'camioneta') => void;
  disabled?: boolean;
  language?: 'es' | 'pt';
}

const getVehicleTypes = (language: 'es' | 'pt') => [
  {
    id: 'auto' as const,
    name: language === 'es' ? 'Auto' : 'Auto',
    icon: Car,
    description: language === 'es' ? 'Vehículo estándar' : 'Veículo padrão'
  },
  {
    id: 'suv' as const,
    name: 'SUV',
    icon: Caravan,
    description: language === 'es' ? 'Vehículo utilitario deportivo' : 'Veículo utilitário esportivo'
  },
  {
    id: 'camioneta' as const,
    name: language === 'es' ? 'Camioneta' : 'Caminhonete',
    icon: Truck,
    description: language === 'es' ? 'Camioneta pickup' : 'Caminhonete pickup'
  }
];

const getTranslations = (language: 'es' | 'pt') => ({
  vehicleType: language === 'es' ? 'Tipo de vehículo' : 'Tipo de veículo'
});

export default function VehicleSelector({ selectedType, onSelect, disabled = false, language = 'es' }: VehicleSelectorProps) {
  const vehicleTypes = getVehicleTypes(language);
  const t = getTranslations(language);
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">{t.vehicleType}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {vehicleTypes.map((vehicle) => {
          const IconComponent = vehicle.icon;
          const isSelected = selectedType === vehicle.id;
          
          return (
            <Card 
              key={vehicle.id}
              className={`cursor-pointer transition-all hover-elevate ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'border-border'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onSelect(vehicle.id)}
              data-testid={`card-vehicle-${vehicle.id}`}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent 
                    className={`h-8 w-8 ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`} 
                  />
                  <div>
                    <h4 className={`font-medium ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {vehicle.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}