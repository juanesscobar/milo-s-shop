import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "./Header";
import ServiceCard from "./ServiceCard";
import BookingCard from "./BookingCard";
import { ShoppingCart, User, History } from "lucide-react";

interface ClienteAppProps {
  language?: 'es' | 'pt';
}

export default function ClienteApp({ language = 'es' }: ClienteAppProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'pt'>(language);

  const content = {
    es: {
      title: "Panel del Cliente",
      subtitle: "Gestiona tus compras y pedidos",
      products: "Productos",
      orders: "Mis Pedidos",
      profile: "Perfil"
    },
    pt: {
      title: "Painel do Cliente",
      subtitle: "Gerencie suas compras e pedidos", 
      products: "Produtos",
      orders: "Meus Pedidos",
      profile: "Perfil"
    }
  };

  const t = content[currentLanguage];

  // Mock data for demonstration
  const mockProducts = [
    {
      id: "washVacuum",
      nameKey: "service.washVacuum",
      title: "Ducha y aspirado",
      description: "Incluye shampoo V-Floc",
      prices: { auto: 50000, suv: 70000, camioneta: 100000 },
      duration: 30,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "washWax", 
      nameKey: "service.washWax",
      title: "Lavado + encerado",
      description: "Carro polido refletindo luz forte",
      prices: { auto: 70000, suv: 90000, camioneta: 120000 },
      duration: 45,
      imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "polishCommercial",
      nameKey: "service.polishCommercial", 
      title: "Pulida Comercial",
      description: "Máquina de polimento em ação",
      prices: { auto: 300000, suv: 350000, camioneta: 450000 },
      duration: 120,
      imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "headlightCrystal",
      nameKey: "service.headlightCrystal",
      title: "Cristalización de Faro", 
      description: "Close-up de farol restaurado",
      prices: { auto: 100000, suv: 100000, camioneta: 100000 },
      duration: 60,
      imageUrl: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "acidRain",
      nameKey: "service.acidRain",
      title: "Eliminación de lluvia ácida",
      description: "Vidrio/pintura limpa, sem manchas",
      prices: { auto: 100000, suv: 150000, camioneta: 150000 },
      duration: 90,
      imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "deepInterior", 
      nameKey: "service.deepInterior",
      title: "Limpieza interior",
      description: "Banco de couro/tecido limpo e higienizado",
      prices: { auto: 350000, suv: 400000, camioneta: 500000 },
      duration: 150,
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "nanoCeramic",
      nameKey: "service.nanoCeramic",
      title: "Nano cerámica",
      description: "Close-up de água escorrendo com efeito repelente",
      prices: { auto: 600000, suv: 800000, camioneta: 1000000 },
      duration: 240,
      imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "nanoMaintenance",
      nameKey: "service.nanoMaintenance", 
      title: "Mantenimiento nano cerámica",
      description: "Carro sendo encerado com pano de microfibra",
      prices: { auto: 150000, suv: 200000, camioneta: 250000 },
      duration: 60,
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop&crop=center"
    }
  ];

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

  const handleProductSelect = (productId: string) => {
    console.log('Product selected:', productId);
  };

  const handleOrderDetails = (orderId: string) => {
    console.log('View order details:', orderId);
  };

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

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" data-testid="tab-products">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t.products}
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">
              <History className="h-4 w-4 mr-2" />
              {t.orders}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              {t.profile}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.products}</CardTitle>
                <CardDescription>
                  {currentLanguage === 'es' 
                    ? 'Selecciona los productos que deseas comprar'
                    : 'Selecione os produtos que deseja comprar'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mockProducts.map((product) => (
                    <ServiceCard
                      key={product.id}
                      {...product}
                      onSelect={handleProductSelect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
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
                    <p className="text-muted-foreground">Cliente Demo</p>
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