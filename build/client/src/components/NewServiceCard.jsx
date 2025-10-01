import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function NewServiceCard(_a) {
    var service = _a.service, selectedVehicleType = _a.selectedVehicleType, language = _a.language, onReserve = _a.onReserve;
    var title = service.title;
    var subtitle = service.description;
    var copy = null; // No additional copy for now
    var formatPrice = function (price) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(price);
    };
    var getPrice = function () {
        if (!selectedVehicleType || !service.prices)
            return null;
        return service.prices[selectedVehicleType];
    };
    var vehicleNames = {
        es: { auto: "Auto", suv: "SUV", camioneta: "Camioneta" },
        pt: { auto: "Auto", suv: "SUV", camioneta: "Caminhonete" }
    };
    var buttonText = language === 'es' ? 'Reservar' : 'Reservar';
    var selectVehicleText = language === 'es'
        ? 'Selecciona tu vehículo para ver precio'
        : 'Selecione seu veículo para ver preço';
    var price = getPrice();
    var vehicleName = selectedVehicleType ? vehicleNames[language][selectedVehicleType] : '';
    return (<Card className="w-full hover-elevate" data-testid={"card-service-".concat(service.slug)}>
      {/* Service Image */}
      {service.imageUrl && (<div className="w-full h-40 bg-muted rounded-t-lg overflow-hidden">
          <img src={service.imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy"/>
        </div>)}

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-foreground leading-tight">
          {title}
        </CardTitle>
        
        {/* Descrição em cinza claro */}
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          {subtitle}
        </p>
      </CardHeader>

      <CardContent className="py-4">
        {/* Preço destacado em vermelho */}
        <div className="mb-4">
          {price ? (<div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {formatPrice(price)}
              </div>
              <div className="text-sm text-muted-foreground">
                para {vehicleName}
              </div>
            </div>) : (<div className="text-center text-sm text-muted-foreground py-2">
              {selectVehicleText}
            </div>)}
        </div>

        {/* Copy adicional */}
        {copy && (<p className="text-xs text-muted-foreground text-center italic">
            {copy}
          </p>)}
      </CardContent>

      <CardFooter className="pt-2">
        <Button onClick={function () { return onReserve(service.slug); }} disabled={!selectedVehicleType} variant="destructive" className="w-full font-medium py-2.5" data-testid={"button-reserve-".concat(service.slug)}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>);
}
