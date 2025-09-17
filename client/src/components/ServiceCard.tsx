import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Truck, Caravan, Clock } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  selectedVehicleType: 'auto' | 'suv' | 'camioneta';
  onReserve: () => void;
  language: 'es' | 'pt';
}

// Vehicle icons for reference
const vehicleIcons = {
  auto: Car,
  suv: Caravan,
  camioneta: Truck,
};

export default function ServiceCard({ 
  service,
  selectedVehicleType,
  onReserve,
  language
}: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const content = {
    es: {
      reserve: "Reservar",
      minutes: "min"
    },
    pt: {
      reserve: "Reservar",
      minutes: "min"
    }
  };

  const t = content[language];
  const currentPrice = service.prices[selectedVehicleType] || 0;

  return (
    <Card className="w-full hover-elevate" data-testid={`card-service-${service.id}`}>
      {service.imageUrl && (
        <div className="p-3 pb-0">
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="service-img w-full h-40 object-cover rounded-lg"
            onError={(e) => {
              // Hide broken images
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          {service.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {service.description}
        </CardDescription>
        <div className="flex items-center gap-2">
          {service.durationMin && (
            <Badge variant="secondary" className="w-fit">
              <Clock className="h-3 w-3 mr-1" />
              {service.durationMin} {t.minutes}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary" data-testid={`price-${selectedVehicleType}-${service.id}`}>
            {formatPrice(currentPrice)}
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {selectedVehicleType}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onReserve}
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mx-auto"
          data-testid={`button-reserve-${service.id}`}
        >
          {t.reserve}
        </Button>
      </CardFooter>
    </Card>
  );
}