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
      id: "product-1",
      nameKey: "product.item1",
      title: "Produto Premium",
      description: "Produto de alta qualidade",
      prices: { auto: 50000 },
      duration: 30
    },
    {
      id: "product-2", 
      nameKey: "product.item2",
      title: "Produto Especial",
      description: "Edição limitada",
      prices: { auto: 75000 },
      duration: 45
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