import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "./Header";
import NewServiceCard from "./NewServiceCard";
import BookingCard from "./BookingCard";
import BookingFlow from "./BookingFlow";
import VehicleSelector from "./VehicleSelector";
import { ShoppingCart, User, History, Car, AlertTriangle } from "lucide-react";
import servicesData from '../data/services.json';

interface ClienteAppProps {
  language?: 'es' | 'pt';
}

export default function ClienteApp({ language = 'es' }: ClienteAppProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>(language);
  const [selectedVehicleType, setSelectedVehicleType] = useState<'auto' | 'suv' | 'camioneta' | null>(null);
  const [bookingService, setBookingService] = useState<any | null>(null);

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

  // Use local services data
  const services = servicesData;

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

  const handleServiceReserve = (serviceSlug: string) => {
    const service = services.find(s => s.slug === serviceSlug);
    if (service) {
      // Convert service data to match expected format
      const convertedService = {
        id: service.slug,
        slug: service.slug,
        nameKey: service.slug,
        title: currentLanguage === 'es' ? service.titleEs : service.titlePt,
        description: currentLanguage === 'es' ? service.subtitleEs : service.subtitlePt,
        titleEs: service.titleEs,
        titlePt: service.titlePt,
        subtitleEs: service.subtitleEs,
        subtitlePt: service.subtitlePt,
        copyEs: service.copyEs,
        copyPt: service.copyPt,
        prices: service.prices,
        durationMin: service.durationMin,
        imageUrl: service.imageUrl,
        active: true,
        createdAt: new Date().toISOString()
      };
      setBookingService(convertedService);
    }
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
            selectedVehicleType={selectedVehicleType || 'auto'}
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
                  {currentLanguage === 'es' ? 'Paso 1: Selecciona tu vehículo' : 'Passo 1: Selecione seu veículo'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage === 'es' 
                    ? 'Elige el tipo de vehículo para ver los precios correspondientes' 
                    : 'Escolha o tipo de veículo para ver os preços correspondentes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleSelector
                  selectedType={selectedVehicleType}
                  onSelect={setSelectedVehicleType}
                  language={currentLanguage}
                />
              </CardContent>
            </Card>

            {/* Services Grid */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {currentLanguage === 'es' ? 'Paso 2: Selecciona tu servicio' : 'Passo 2: Selecione seu serviço'}
                </h2>
                <p className="text-gray-400">
                  {currentLanguage === 'es' 
                    ? 'Elige el servicio que mejor se adapte a tus necesidades'
                    : 'Escolha o serviço que melhor se adapta às suas necessidades'
                  }
                </p>
              </div>
              
              {!selectedVehicleType && (
                <Alert className="bg-background border-border">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-muted-foreground">
                    {currentLanguage === 'es' 
                      ? 'Por favor selecciona tu tipo de vehículo primero para ver los precios'
                      : 'Por favor selecione o tipo de veículo primeiro para ver os preços'
                    }
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <NewServiceCard
                    key={service.slug}
                    service={service}
                    selectedVehicleType={selectedVehicleType}
                    language={currentLanguage}
                    onReserve={handleServiceReserve}
                  />
                ))}
              </div>
            </div>
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