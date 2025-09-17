import { useState } from 'react';
import Header from "./Header";
import AdminDashboard from "./AdminDashboard";

interface AdminAppProps {
  language?: 'es' | 'pt';
}

export default function AdminApp({ language = 'es' }: AdminAppProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>(language);

  // Mock admin data
  const mockStats = {
    todayBookings: 8,
    activeWashing: 2,
    completedToday: 6,
    todayRevenue: 320000,
    avgServiceTime: 28
  };

  const mockBookings = [
    {
      id: "admin-order-1",
      serviceName: "Produto Premium", 
      vehiclePlate: "Pedido #001",
      date: "2024-03-15",
      timeSlot: "09:00",
      status: 'waiting' as const,
      price: 50000,
      paymentMethod: 'card' as const,
      paymentStatus: 'pending' as const
    },
    {
      id: "admin-order-2",
      serviceName: "Produto Especial",
      vehiclePlate: "Pedido #002", 
      date: "2024-03-15",
      timeSlot: "10:30",
      status: 'washing' as const,
      price: 75000,
      paymentMethod: 'pix' as const,
      paymentStatus: 'paid' as const
    },
    {
      id: "admin-order-3",
      serviceName: "Produto Premium",
      vehiclePlate: "Pedido #003",
      date: "2024-03-15", 
      timeSlot: "08:00",
      status: 'done' as const,
      price: 50000,
      paymentMethod: 'cash' as const,
      paymentStatus: 'paid' as const
    }
  ];

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log('Admin status update:', orderId, newStatus);
  };

  const handleViewDetails = (orderId: string) => {
    console.log('Admin view details:', orderId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      
      <AdminDashboard
        stats={mockStats}
        todayBookings={mockBookings}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}