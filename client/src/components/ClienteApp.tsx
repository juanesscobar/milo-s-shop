import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "./Header";
import ServiceCard from "./ServiceCard";
import BookingCard from "./BookingCard";
import BookingFlow from "./BookingFlow";
import { ShoppingCart, User, History, Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Service } from "@shared/schema";

interface ClienteAppProps {
  language?: 'es' | 'pt';
}

export default function ClienteApp({ language = 'es' }: ClienteAppProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>(language);
  const [selectedVehicleType, setSelectedVehicleType] = useState<'auto' | 'suv' | 'camioneta'>('auto');
  const [bookingService, setBookingService] = useState<Service | null>(null);

  const content = {
    es: {
      title: "Milos'Shop Cliente",
      subtitle: "Reserva tu servicio de lavado",
      services: "Servicios",
      bookings: "Mis Reservas",
      profile: "Perfil",
      vehicleType: "Tipo de vehículo",
      selectVehicle: "Selecciona tu vehículo",
      auto: "Auto",
      suv: "SUV",
      camioneta: "Camioneta"
    },
    pt: {
      title: "Milos'Shop Cliente",
      subtitle: "Reserve seu serviço de lavagem", 
      services: "Serviços",
      bookings: "Minhas Reservas",
      profile: "Perfil",
      vehicleType: "Tipo de veículo",
      selectVehicle: "Selecione seu veículo",
      auto: "Auto",
      suv: "SUV",
      camioneta: "Caminhonete"
    }
  };

  const t = content[currentLanguage];

  // Fetch services from API
  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const mockOrders = [
    {
      id: "order-1",
      serviceName: "Produto Premium",
      vehiclePlate: "Pedido #001",
      date: "2024-03-15",
      timeSlot: "14:00",
      status: 'washing' as const,
      price: 50000,
      paymentMethod: 'card' as const,
      paymentStatus: 'paid' as const
    }
  ];

  const handleServiceReserve = (service: Service) => {
    setBookingService(service);
  };
  
  const handleBackToServices = () => {
    setBookingService(null);
  };

  const handleUploadImage = async (serviceSlug: string, file: File) => {
    console.log('Upload de imagem para serviço:', serviceSlug, file.name);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('serviceSlug', serviceSlug);
      
      const response = await fetch('/api/services/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Imagem carregada com sucesso:', result);
        // Refresh services to get updated data
        // queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      } else {
        console.error('Erro ao carregar imagem');
        alert('Erro ao carregar imagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao carregar imagem. Verifique sua conexão.');
    }
  };

  const handleOrderDetails = (orderId: string) => {
    console.log('View order details:', orderId);
  };

  // Show booking flow if service is selected
  if (bookingService) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
        
        <div className="container mx-auto px-4 py-6">
          <BookingFlow 
            service={bookingService}
            selectedVehicleType={selectedVehicleType}
            onBack={handleBackToServices}
            language={currentLanguage}
          />
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
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <Tabs defaultValue="services" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services" data-testid="tab-services">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t.services}
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">
              <History className="h-4 w-4 mr-2" />
              {t.bookings}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              {t.profile}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {/* Vehicle Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {t.vehicleType}
                </CardTitle>
                <CardDescription>{t.selectVehicle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedVehicleType} onValueChange={(value: 'auto' | 'suv' | 'camioneta') => setSelectedVehicleType(value)}>
                  <SelectTrigger data-testid="select-vehicle-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">{t.auto}</SelectItem>
                    <SelectItem value="suv">{t.suv}</SelectItem>
                    <SelectItem value="camioneta">{t.camioneta}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-center pt-2">
                  <Button 
                    variant="secondary"
                    size="sm"
                    data-testid="button-click-here-vehicle"
                  >
                    {currentLanguage === 'es' ? 'Click aquí' : 'Clique aqui'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Services Grid */}
            <Card>
              <CardHeader>
                <CardTitle>{t.services}</CardTitle>
                <CardDescription>
                  {currentLanguage === 'es' 
                    ? 'Selecciona el servicio que deseas reservar'
                    : 'Selecione o serviço que deseja reservar'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {currentLanguage === 'es' ? 'Cargando servicios...' : 'Carregando serviços...'}
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    {currentLanguage === 'es' ? 'Error al cargar servicios' : 'Erro ao carregar serviços'}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onReserve={(slug) => handleServiceReserve(service)}
                        onUploadImage={handleUploadImage}
                        language={currentLanguage}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockOrders.map((order) => (
                <BookingCard
                  key={order.id}
                  {...order}
                  onViewDetails={handleOrderDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.profile}</CardTitle>
                <CardDescription>
                  {currentLanguage === 'es' 
                    ? 'Información de tu cuenta'
                    : 'Informações da sua conta'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      {currentLanguage === 'es' ? 'Nombre' : 'Nome'}
                    </label>
                    <p className="text-muted-foreground">Cliente Milos'Shop</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">cliente@milosshop.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {currentLanguage === 'es' ? 'Estado' : 'Status'}
                    </label>
                    <Badge variant="outline" className="ml-2">
                      {currentLanguage === 'es' ? 'Activo' : 'Ativo'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}