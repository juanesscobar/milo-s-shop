import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageToggle from "./LanguageToggle";
import {
  Droplets,
  Clock,
  Shield,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Car,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Service } from "@shared/schema";

interface LandingPageProps {
  currentLanguage: 'es' | 'pt';
  onLanguageChange: (language: 'es' | 'pt') => void;
  onBookNow: () => void;
  onLogin: () => void;
}

export default function LandingPage({
  currentLanguage,
  onLanguageChange,
  onBookNow,
  onLogin
}: LandingPageProps) {
  // Fetch services from API
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const content = {
    es: {
      title: "Lavadero Moderno",
      subtitle: "Servicio profesional de lavado para tu vehículo",
      cta: "Agendar ahora",
      login: "Iniciar sesión",
      features: [
        {
          icon: Droplets,
          title: "Productos Premium",
          description: "Usamos shampoo V-Floc y ceras carnauba de alta calidad"
        },
        {
          icon: Clock,
          title: "Servicio Rápido", 
          description: "Tiempos optimizados sin comprometer la calidad"
        },
        {
          icon: Shield,
          title: "Protección Garantizada",
          description: "Cuidamos tu vehículo como si fuera nuestro"
        }
      ],
      services: "Nuestros Servicios",
      contact: "Contacto",
      location: "Ubicación",
      whatsapp: "WhatsApp",
      hours: "Horarios de atención"
    },
    pt: {
      title: "Lavadero Moderno",
      subtitle: "Serviço profissional de lavagem para seu veículo",
      cta: "Agendar agora",
      login: "Entrar",
      features: [
        {
          icon: Droplets,
          title: "Produtos Premium",
          description: "Usamos shampoo V-Floc e ceras carnauba de alta qualidade"
        },
        {
          icon: Clock,
          title: "Serviço Rápido",
          description: "Tempos otimizados sem comprometer a qualidade"
        },
        {
          icon: Shield,
          title: "Proteção Garantida",
          description: "Cuidamos do seu veículo como se fosse nosso"
        }
      ],
      services: "Nossos Serviços",
      contact: "Contato",
      location: "Localização",
      whatsapp: "WhatsApp",
      hours: "Horários de atendimento"
    }
  };

  const t = content[currentLanguage];

  // Transform services from API to landing page format
  const landingServices = services.slice(0, 3).map(service => ({
    name: service.title,
    price: service.prices?.auto ? `${service.prices.auto.toLocaleString()} Gs` : "Consultar",
    features: service.description.split('. ').slice(0, 2), // Split description into features
    imageUrl: service.imageUrl
  }));

  // Fallback services if API fails
  const fallbackServices = [
    {
      name: currentLanguage === 'es' ? "Ducha y aspirado" : "Lavagem e aspiração",
      price: "50.000 Gs",
      features: ["Shampoo V-Floc", "Aspirado completo"],
      imageUrl: null
    },
    {
      name: currentLanguage === 'es' ? "Lavado + encerado" : "Lavagem + enceramento",
      price: "70.000 Gs",
      features: ["Shampoo V-Floc", "Cera carnauba Plus", "Cera Native carnauba"],
      imageUrl: null
    },
    {
      name: currentLanguage === 'es' ? "Pulida Comercial" : "Polimento Comercial",
      price: "300.000 Gs",
      features: ["Lavado completo", "Pulida 2 pasos", "Protección 1 año"],
      imageUrl: null
    }
  ];

  const displayServices = servicesLoading || services.length === 0 ? fallbackServices : landingServices;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">{t.title}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle 
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            <Button 
              variant="ghost" 
              onClick={onLogin}
              data-testid="button-login"
            >
              {t.login}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <Button 
            size="lg" 
            onClick={onBookNow}
            className="text-lg px-8 py-6"
            data-testid="button-book-now"
          >
            <Car className="h-5 w-5 mr-2" />
            {t.cta}
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {t.features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t.services}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {displayServices.map((service, index) => (
              <Card key={index} className="hover-elevate">
                {/* Service Image */}
                {service.imageUrl && (
                  <div className="w-full h-32 bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{service.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t.contact}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t.location}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Av. Principal 123<br />
                  Asunción, Paraguay
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {t.whatsapp}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  +595 21 123 456
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center">
        <div className="container">
          <p className="text-muted-foreground">
            © 2024 {t.title}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}