import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  language: 'es' | 'pt';
  onSelect: (slug: string) => void;
}

export default function ServiceCard({ 
  service,
  language,
  onSelect
}: ServiceCardProps) {
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

  const vehicleNames = {
    es: { auto: "Auto", suv: "SUV", camioneta: "Camioneta" },
    pt: { auto: "Auto", suv: "SUV", camioneta: "Caminhonete" }
  };

  const t = vehicleNames[language];
  const buttonText = language === 'es' ? 'Seleccionar' : 'Selecionar';

  return (
    <Card className="w-full hover-elevate" data-testid={`card-service-${service.slug}`}>
      {service.imageUrl && (
        <div className="p-3 pb-0">
          <img 
            src={service.imageUrl} 
            alt={title} 
            className="w-full h-40 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
          {service.durationMin && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {service.durationMin} min
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {subtitle}
        </CardDescription>
        <p className="text-sm text-muted-foreground">{copy}</p>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-2">
        <div className="space-y-1">
          {service.prices.auto != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{t.auto}</span>
              <span className="font-bold">{formatPrice(service.prices.auto)}</span>
            </div>
          )}
          {service.prices.suv != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{t.suv}</span>
              <span className="font-bold">{formatPrice(service.prices.suv)}</span>
            </div>
          )}
          {service.prices.camioneta != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{t.camioneta}</span>
              <span className="font-bold">{formatPrice(service.prices.camioneta)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(service.slug)}
          variant="destructive"
          size="sm"
          className="mx-auto"
          data-testid={`button-select-${service.slug}`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}