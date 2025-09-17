import CustomerPortal from '../CustomerPortal';

export default function CustomerPortalExample() {
  // Mock services data from specifications
  const mockServices = [
    {
      id: "wash-vacuum",
      nameKey: "service.washVacuum",
      title: "Ducha y aspirado",
      description: "Shampoo V-Floc",
      prices: { auto: 50000, suv: 70000, camioneta: 100000 },
      duration: 30
    },
    {
      id: "wash-wax",
      nameKey: "service.washWax", 
      title: "Lavado + encerado",
      description: "Shampoo V-Floc + Cera líquida carnauba Plus + Cera en pasta Native carnauba",
      prices: { auto: 70000, suv: 90000, camioneta: 120000 },
      duration: 45
    },
    {
      id: "polish-commercial",
      nameKey: "service.polishCommercial",
      title: "Pulida Comercial", 
      description: "Lavado interior/exterior + Pulida 2 pasos (V-Cut + V80) + protección 1 año",
      prices: { auto: 300000, suv: 350000, camioneta: 450000 },
      duration: 120
    }
  ];

  const mockBookings = [
    {
      id: "booking-1",
      serviceName: "Ducha y aspirado",
      vehiclePlate: "ABC-1234",
      date: "2024-03-15",
      timeSlot: "14:00 - 14:30",
      status: 'washing' as const,
      price: 50000,
      paymentMethod: 'card' as const,
      paymentStatus: 'paid' as const
    },
    {
      id: "booking-2",
      serviceName: "Lavado + encerado",
      vehiclePlate: "ABC-1234",
      date: "2024-03-10",
      timeSlot: "10:00 - 10:45",
      status: 'done' as const,
      price: 70000,
      paymentMethod: 'cash' as const,
      paymentStatus: 'paid' as const
    }
  ];

  const handleBookService = (serviceId: string, vehicleType: string) => {
    console.log('Book service:', serviceId, 'for vehicle type:', vehicleType);
    // In real app, this would navigate to booking flow
  };

  const handleViewBookingDetails = (bookingId: string) => {
    console.log('View booking details:', bookingId);
  };

  return (
    <CustomerPortal
      services={mockServices}
      userBookings={mockBookings}
      onBookService={handleBookService}
      onViewBookingDetails={handleViewBookingDetails}
    />
  );
}