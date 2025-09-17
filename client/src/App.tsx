import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import all components
import LandingPage from "@/components/LandingPage";
import CustomerPortal from "@/components/CustomerPortal";
import AdminDashboard from "@/components/AdminDashboard";
import PaymentSelector from "@/components/PaymentSelector";

// Import individual component examples
import ServiceCard from "@/components/examples/ServiceCard";
import StatusBadge from "@/components/examples/StatusBadge";
import BookingCard from "@/components/examples/BookingCard";
import VehicleSelector from "@/components/examples/VehicleSelector";
import LanguageToggle from "@/components/examples/LanguageToggle";

function ComponentShowcase() {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Lavadero Moderno - Prototype</h1>
        <p className="text-muted-foreground">
          Complete car wash management system components
        </p>
      </div>

      <Tabs defaultValue="components" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="landing">Landing</TabsTrigger>
          <TabsTrigger value="customer">Cliente</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-8">
          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Service Card</h2>
              <ServiceCard />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Status Badges</h2>
              <StatusBadge />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking Card</h2>
              <BookingCard />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Vehicle Selector</h2>
              <VehicleSelector />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Language Toggle</h2>
              <LanguageToggle />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Selector</h2>
              <PaymentSelectorDemo />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="landing">
          <LandingPageDemo />
        </TabsContent>

        <TabsContent value="customer">
          <CustomerPortalDemo />
        </TabsContent>

        <TabsContent value="admin">
          <AdminDashboardDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PaymentSelectorDemo() {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'pix' | 'cash' | null>(null);
  const [language, setLanguage] = useState<'es' | 'pt'>('es');

  const handleSelect = (method: 'card' | 'pix' | 'cash') => {
    setSelectedMethod(method);
    console.log('Payment method selected:', method);
  };

  const handleConfirmPayment = () => {
    console.log('Payment confirmed with method:', selectedMethod);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-2 mb-4 justify-center">
        <Button 
          variant={language === 'es' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('es')}
        >
          ES
        </Button>
        <Button 
          variant={language === 'pt' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('pt')}
        >
          PT
        </Button>
      </div>
      
      <PaymentSelector
        selectedMethod={selectedMethod}
        amount={75000}
        onSelect={handleSelect}
        onConfirmPayment={handleConfirmPayment}
        language={language}
      />
    </div>
  );
}

function LandingPageDemo() {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>('es');

  const handleLanguageChange = (language: 'es' | 'pt') => {
    setCurrentLanguage(language);
    console.log('Language changed to:', language);
  };

  const handleBookNow = () => {
    console.log('Book now clicked - would navigate to booking flow');
  };

  const handleLogin = () => {
    console.log('Login clicked - would open login modal/page');
  };

  return (
    <LandingPage
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
      onBookNow={handleBookNow}
      onLogin={handleLogin}
    />
  );
}

function CustomerPortalDemo() {
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
    },
    {
      id: "headlight-crystal",
      nameKey: "service.headlightCrystal",
      title: "Cristalización de Faro",
      description: "Par + faro trasero",
      prices: { auto: 100000, suv: 100000, camioneta: 100000 },
      duration: 60
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

function AdminDashboardDemo() {
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
    },
    {
      id: "booking-4",
      serviceName: "Cristalización de Faro",
      vehiclePlate: "GHI-3456",
      date: "2024-03-15",
      timeSlot: "11:00 - 12:00",
      status: 'waiting' as const,
      price: 100000,
      paymentMethod: 'card' as const,
      paymentStatus: 'pending' as const
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={ComponentShowcase} />
      <Route component={ComponentShowcase} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;