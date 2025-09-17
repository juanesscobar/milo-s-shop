import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { Car, Calendar, Clock, CreditCard } from "lucide-react";

interface BookingCardProps {
  id: string;
  serviceName: string;
  vehiclePlate: string;
  date: string;
  timeSlot: string;
  status: 'waiting' | 'washing' | 'done' | 'cancelled';
  price: number;
  paymentMethod?: 'card' | 'pix' | 'cash';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  onStatusUpdate?: (bookingId: string, newStatus: string) => void;
  onViewDetails?: (bookingId: string) => void;
  isAdmin?: boolean;
}

export default function BookingCard({ 
  id,
  serviceName,
  vehiclePlate,
  date,
  timeSlot,
  status,
  price,
  paymentMethod,
  paymentStatus,
  onStatusUpdate,
  onViewDetails,
  isAdmin = false
}: BookingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case 'card': return 'Tarjeta';
      case 'pix': return 'PIX';
      case 'cash': return 'Efectivo';
      default: return 'No definido';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <Card className="w-full hover-elevate" data-testid={`card-booking-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {serviceName}
          </CardTitle>
          <StatusBadge status={status} />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            <span className="font-medium">{vehiclePlate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeSlot}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {getPaymentMethodText(paymentMethod)}
            </span>
            {paymentStatus && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getPaymentStatusColor(paymentStatus)}`}
              >
                {paymentStatus === 'paid' ? 'Pagado' : 
                 paymentStatus === 'failed' ? 'Falló' : 'Pendiente'}
              </Badge>
            )}
          </div>
          <span className="text-lg font-bold text-primary">
            {formatPrice(price)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {isAdmin && onStatusUpdate && status !== 'done' && status !== 'cancelled' && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const nextStatus = status === 'waiting' ? 'washing' : 'done';
              onStatusUpdate(id, nextStatus);
            }}
            data-testid={`button-update-status-${id}`}
          >
            {status === 'waiting' ? 'Iniciar lavado' : 'Finalizar'}
          </Button>
        )}
        
        {onViewDetails && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(id)}
            data-testid={`button-view-details-${id}`}
          >
            Ver detalles
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}