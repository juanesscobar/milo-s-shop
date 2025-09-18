import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';
import Header from "./Header";
import AdminDashboard from "./AdminDashboard";

interface AdminAppProps {
  language?: 'es' | 'pt';
}

export default function AdminApp({ language = 'es' }: AdminAppProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>(language);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { joinAdminRoom, disconnect } = useWebSocket();

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    console.log('AdminApp mounted - connecting to WebSocket...');
    joinAdminRoom();
    
    return () => {
      console.log('AdminApp unmounting - disconnecting WebSocket...');
      disconnect();
    };
  }, [joinAdminRoom, disconnect]);

  // Fetch today's bookings from backend
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['/api/bookings/today'],
    select: (data: any[]) => data.map((booking: any) => ({
      ...booking,
      // Use the flat fields returned by API (from joins)
      serviceName: booking.serviceName || 'Servicio desconocido',
      vehiclePlate: booking.vehiclePlate || 'Placa desconocida'
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
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error updating status');
      }
      
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/today'] });
      const statusText = variables.newStatus === 'washing' ? 'en lavado' : 
                        variables.newStatus === 'done' ? 'finalizado' : 
                        variables.newStatus === 'cancelled' ? 'cancelado' : variables.newStatus;
      
      toast({
        title: "✅ Acción realizada con éxito",
        description: `Estado actualizado a: ${statusText}`,
      });
    },
    onError: (error: any) => {
      if (error.message.includes('Price mismatch') || error.message.includes('price')) {
        toast({
          title: "⚠️ Error de precio",
          description: "El precio no coincide con la base de datos. Actualiza la tarifa del servicio y vuelve a intentar.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Ocurrió un error. Intenta nuevamente.",
          description: error.message || "No se pudo actualizar el estado de la reserva",
          variant: "destructive",
        });
      }
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