import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  vehicleType: language === 'es' ? 'Tipo de vehículo' : 'Tipo de veículo',
  clickHere: language === 'es' ? 'Seleccionar vehículo' : 'Selecionar veículo',
  chooseVehicle: language === 'es' ? 'Elige tu vehículo' : 'Escolha seu veículo',
  cancel: language === 'es' ? 'Cancelar' : 'Cancelar',
  selectVehicle: language === 'es' ? 'Selecciona tu vehículo' : 'Selecione seu veículo',
  selectedVehicle: language === 'es' ? 'Vehículo seleccionado:' : 'Veículo selecionado:'
});

export default function VehicleSelector({ selectedType, onSelect, disabled = false, language = 'es' }: VehicleSelectorProps) {
  const [open, setOpen] = useState(false);
  const vehicleTypes = getVehicleTypes(language);
  const t = getTranslations(language);
  
  const selectedVehicle = vehicleTypes.find(v => v.id === selectedType);
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">{t.vehicleType}</h3>
      <p className="text-xs text-muted-foreground">{t.selectVehicle}</p>
      
      {/* Botão que substitui o select */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-full py-3 px-6 text-base font-medium"
            disabled={disabled}
            data-testid="button-vehicle-selector"
          >
            {t.clickHere}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.chooseVehicle}</DialogTitle>
            <DialogDescription>
              {language === 'es' 
                ? 'Selecciona el tipo de vehículo para continuar' 
                : 'Selecione o tipo de veículo para continuar'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 py-4">
            {vehicleTypes.map((vehicle) => {
              const IconComponent = vehicle.icon;
              return (
                <Button
                  key={vehicle.id}
                  variant="outline"
                  className="justify-start h-auto p-4 hover-elevate"
                  onClick={() => {
                    onSelect(vehicle.id);
                    setOpen(false);
                  }}
                  data-testid={`button-vehicle-${vehicle.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-medium text-foreground">
                        ■ {vehicle.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {vehicle.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            data-testid="button-cancel-vehicle"
          >
            {t.cancel}
          </Button>
        </DialogContent>
      </Dialog>
      
      {/* Mostra o veículo selecionado */}
      {selectedVehicle && (
        <p className="text-sm text-foreground" data-testid="text-selected-vehicle">
          {t.selectedVehicle} <strong>■ {selectedVehicle.name}</strong>
        </p>
      )}
    </div>
  );
}