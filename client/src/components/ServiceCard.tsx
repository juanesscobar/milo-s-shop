import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Truck, Caravan } from "lucide-react";

interface ServiceCardProps {
  id: string;
  nameKey: string;
  title: string;
  description: string;
  prices: {
    auto?: number;
    suv?: number;
    camioneta?: number;
  };
  duration?: number;
  onSelect: (serviceId: string) => void;
}

const vehicleIcons = {
  auto: Car,
  suv: Caravan,
  camioneta: Truck,
};

export default function ServiceCard({ 
  id, 
  title, 
  description, 
  prices, 
  duration,
  onSelect 
}: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full max-w-sm hover-elevate" data-testid={`card-service-${id}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
        {duration && (
          <Badge variant="secondary" className="w-fit">
            {duration} min
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-2">
          {Object.entries(prices).map(([vehicleType, price]) => {
            const IconComponent = vehicleIcons[vehicleType as keyof typeof vehicleIcons];
            return (
              <div 
                key={vehicleType} 
                className="flex items-center justify-between py-1"
                data-testid={`price-${vehicleType}-${id}`}
              >
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium capitalize">
                    {vehicleType}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(price)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(id)}
          className="w-full"
          data-testid={`button-select-${id}`}
        >
          Seleccionar
        </Button>
      </CardFooter>
    </Card>
  );
}