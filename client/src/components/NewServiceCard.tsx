import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

import type { Service } from "@shared/schema";

interface NewServiceCardProps {
  service: Service;
  selectedVehicleType: 'auto' | 'suv' | 'camioneta' | null;
  language: 'es' | 'pt';
  onReserve: (serviceSlug: string) => void;
}

export default function NewServiceCard({ 
  service,
  selectedVehicleType,
  language,
  onReserve
}: NewServiceCardProps) {
  const title = language === 'es' ? service.titleEs : service.titlePt;
  const subtitle = language === 'es' ? service.subtitleEs : service.subtitlePt;
  const copy = language === 'es' ? service.copyEs : service.copyPt;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPrice = () => {
    if (!selectedVehicleType) return null;
    return service.prices[selectedVehicleType];
  };

  const vehicleNames = {
    es: { auto: "Auto", suv: "SUV", camioneta: "Camioneta" },
    pt: { auto: "Auto", suv: "SUV", camioneta: "Caminhonete" }
  };

  const buttonText = language === 'es' ? 'Reservar' : 'Reservar';
  const selectVehicleText = language === 'es' 
    ? 'Selecciona tu vehículo para ver precio' 
    : 'Selecione seu veículo para ver preço';
  
  const price = getPrice();
  const vehicleName = selectedVehicleType ? vehicleNames[language][selectedVehicleType] : '';

  return (
    <Card 
      className="w-full hover-elevate"
      data-testid={`card-service-${service.slug}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-foreground leading-tight">
            {title}
          </CardTitle>
          {service.durationMin && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Clock className="h-3 w-3" />
              <span>{service.durationMin} min</span>
            </div>
          )}
        </div>
        
        {/* Descrição em cinza claro */}
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          {subtitle}
        </p>
      </CardHeader>

      <CardContent className="py-4">
        {/* Preço destacado em vermelho */}
        <div className="mb-4">
          {price ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {formatPrice(price)}
              </div>
              <div className="text-sm text-muted-foreground">
                para {vehicleName}
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-2">
              {selectVehicleText}
            </div>
          )}
        </div>

        {/* Copy adicional */}
        {copy && (
          <p className="text-xs text-muted-foreground text-center italic">
            {copy}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onReserve(service.slug)}
          disabled={!selectedVehicleType}
          variant="destructive"
          className="w-full font-medium py-2.5"
          data-testid={`button-reserve-${service.slug}`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}