import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceCard from "./ServiceCard";
import BookingCard from "./BookingCard";
import VehicleSelector from "./VehicleSelector";
import { CalendarDays, Car, Plus, History } from "lucide-react";

interface Service {
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
}

interface CustomerPortalProps {
  services: Service[];
  userBookings: any[];
  onBookService: (serviceId: string, vehicleType: string) => void;
  onViewBookingDetails: (bookingId: string) => void;
}

export default function CustomerPortal({ 
  services, 
  userBookings, 
  onBookService, 
  onViewBookingDetails 
}: CustomerPortalProps) {
  const [selectedVehicleType, setSelectedVehicleType] = useState<'auto' | 'suv' | 'camioneta' | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    if (!selectedVehicleType) {
      alert('Por favor selecciona el tipo de vehículo primero');
      return;
    }
    onBookService(serviceId, selectedVehicleType);
  };

  const activeBookings = userBookings.filter(booking => 
    booking.status === 'waiting' || booking.status === 'washing'
  );

  const completedBookings = userBookings.filter(booking => 
    booking.status === 'done'
  );

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Lavadero Moderno</h1>
        <p className="text-muted-foreground">
          Agenda tu servicio y rastrea el estado en tiempo real
        </p>
      </div>

      {/* Active Bookings Alert */}
      {activeBookings.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Car className="h-5 w-5" />
              Servicios activos
            </CardTitle>
            <CardDescription>
              Tienes {activeBookings.length} servicio(s) en progreso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={onViewBookingDetails}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="book" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book" data-testid="tab-book-service">
            <Plus className="h-4 w-4 mr-2" />
            Agendar servicio
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-booking-history">
            <History className="h-4 w-4 mr-2" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Paso 1: Selecciona tu vehículo</CardTitle>
              <CardDescription>
                Elige el tipo de vehículo para ver los precios correspondientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleSelector
                selectedType={selectedVehicleType}
                onSelect={setSelectedVehicleType}
              />
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Paso 2: Elige tu servicio</CardTitle>
              <CardDescription>
                Selecciona el servicio que deseas para tu vehículo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    {...service}
                    onSelect={handleServiceSelect}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  {...booking}
                  onViewDetails={onViewBookingDetails}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sin historial</h3>
                  <p className="text-muted-foreground">
                    Aún no has completado ningún servicio
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}