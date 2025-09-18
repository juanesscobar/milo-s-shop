import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from "./Header";
import AdminDashboard from "./AdminDashboard";

interface AdminAppProps {
  language?: 'es' | 'pt';
}

export default function AdminApp({ language = 'es' }: AdminAppProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>(language);
  const queryClient = useQueryClient();

  // Fetch today's bookings from backend
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['/api/bookings/today'],
    select: (data: any[]) => data.map((booking: any) => ({
      ...booking,
      serviceName: booking.service?.titleEs || 'Servicio desconocido',
      vehiclePlate: booking.vehicle?.licensePlate || 'Placa desconocida'
    }))
  });

  // Calculate stats based on real data
  const stats = {
    todayBookings: bookings.length,
    activeWashing: bookings.filter((b: any) => b.status === 'washing').length,
    completedToday: bookings.filter((b: any) => b.status === 'done').length,
    todayRevenue: bookings
      .filter((b: any) => b.status === 'done')
      .reduce((sum: number, b: any) => sum + (b.price || 0), 0),
    avgServiceTime: 28 // TODO: Calculate based on actual service times
  };

  // Mutation to update booking status
  const statusUpdateMutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }) => {
      return fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/today'] });
    }
  });

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    statusUpdateMutation.mutate({ bookingId, newStatus });
  };

  const handleViewDetails = (bookingId: string) => {
    const booking = bookings.find((b: any) => b.id === bookingId);
    if (booking) {
      // Show booking details in alert for now - can be replaced with modal later
      const details = [
        `ID: ${booking.id}`,
        `Servicio: ${booking.serviceName}`,
        `Vehículo: ${booking.vehiclePlate}`,
        `Fecha: ${booking.date}`,
        `Hora: ${booking.timeSlot}`,
        `Precio: ${new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(booking.price)}`,
        `Método de pago: ${booking.paymentMethod || 'No definido'}`,
        `Estado del pago: ${booking.paymentStatus || 'No definido'}`
      ].join('\n');
      alert(details);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/bookings/today'] });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground">No se pudieron cargar las reservas del día</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      
      <AdminDashboard
        stats={stats}
        todayBookings={bookings}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={handleViewDetails}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
    </div>
  );
}