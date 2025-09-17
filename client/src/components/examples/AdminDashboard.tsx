import AdminDashboard from '../AdminDashboard';

export default function AdminDashboardExample() {
  // Mock dashboard data
  const mockStats = {
    todayBookings: 12,
    activeWashing: 3,
    completedToday: 8,
    todayRevenue: 450000,
    avgServiceTime: 35
  };

  const mockBookings = [
    {
      id: "booking-1",
      serviceName: "Ducha y aspirado",
      vehiclePlate: "ABC-1234",
      date: "2024-03-15",
      timeSlot: "09:00 - 09:30",
      status: 'waiting' as const,
      price: 50000,
      paymentMethod: 'card' as const,
      paymentStatus: 'pending' as const
    },
    {
      id: "booking-2",
      serviceName: "Lavado + encerado",
      vehiclePlate: "XYZ-5678",
      date: "2024-03-15",
      timeSlot: "10:00 - 10:45",
      status: 'washing' as const,
      price: 70000,
      paymentMethod: 'cash' as const,
      paymentStatus: 'paid' as const
    },
    {
      id: "booking-3",
      serviceName: "Pulida Comercial",
      vehiclePlate: "DEF-9012",
      date: "2024-03-15",
      timeSlot: "08:00 - 10:00",
      status: 'done' as const,
      price: 300000,
      paymentMethod: 'pix' as const,
      paymentStatus: 'paid' as const
    }
  ];

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    console.log('Admin status update:', bookingId, newStatus);
  };

  const handleViewDetails = (bookingId: string) => {
    console.log('Admin view details:', bookingId);
  };

  return (
    <AdminDashboard
      stats={mockStats}
      todayBookings={mockBookings}
      onStatusUpdate={handleStatusUpdate}
      onViewDetails={handleViewDetails}
    />
  );
}