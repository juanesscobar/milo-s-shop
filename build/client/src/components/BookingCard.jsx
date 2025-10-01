import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { Car, Calendar, Clock, CreditCard, Image } from "lucide-react";
export default function BookingCard(_a) {
    var id = _a.id, serviceName = _a.serviceName, vehiclePlate = _a.vehiclePlate, date = _a.date, timeSlot = _a.timeSlot, status = _a.status, price = _a.price, paymentMethod = _a.paymentMethod, paymentStatus = _a.paymentStatus, paymentCaptureUrl = _a.paymentCaptureUrl, onStatusUpdate = _a.onStatusUpdate, onViewDetails = _a.onViewDetails, _b = _a.isAdmin, isAdmin = _b === void 0 ? false : _b;
    var formatPrice = function (price) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(price);
    };
    var getPaymentMethodText = function (method) {
        switch (method) {
            case 'cash': return 'Efectivo';
            case 'transfer': return 'Transferencia';
            case 'pix': return 'PIX';
            case 'card': return 'Tarjeta';
            default: return 'No definido';
        }
    };
    var getPaymentStatusColor = function (status) {
        switch (status) {
            case 'paid': return 'text-green-600';
            case 'failed': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };
    return (<Card className="w-full hover-elevate" data-testid={"card-booking-".concat(id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {serviceName}
          </CardTitle>
          <StatusBadge status={status}/>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4"/>
            <span className="font-medium">{vehiclePlate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4"/>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4"/>
            <span>{timeSlot}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground"/>
            <span className="text-sm">
              {getPaymentMethodText(paymentMethod)}
            </span>
            {paymentStatus && (<Badge variant="outline" className={"text-xs ".concat(getPaymentStatusColor(paymentStatus))}>
                {paymentStatus === 'paid' ? 'Pagado' :
                paymentStatus === 'failed' ? 'Falló' : 'Pendiente'}
              </Badge>)}
            {paymentCaptureUrl && (<Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                <Image className="h-3 w-3 mr-1"/>
                Captura
              </Badge>)}
          </div>
          <span className="text-lg font-bold text-primary">
            {formatPrice(price)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {isAdmin && onStatusUpdate && status !== 'done' && status !== 'cancelled' && (<Button variant="outline" size="sm" onClick={function () {
                var nextStatus = status === 'waiting' ? 'washing' : 'done';
                onStatusUpdate(id, nextStatus);
            }} data-testid={"button-update-status-".concat(id)}>
            {status === 'waiting' ? 'Iniciar lavado' : 'Finalizar'}
          </Button>)}
        
        {onViewDetails && (<Button variant="ghost" size="sm" onClick={function () { return onViewDetails(id); }} data-testid={"button-view-details-".concat(id)}>
            Ver detalles
          </Button>)}
      </CardFooter>
    </Card>);
}
