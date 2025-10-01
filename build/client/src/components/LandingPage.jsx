var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";
import { Droplets, Clock, Shield, MapPin, Phone, MessageCircle, Car, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
export default function LandingPage(_a) {
    var _this = this;
    var currentLanguage = _a.currentLanguage, onLanguageChange = _a.onLanguageChange, onBookNow = _a.onBookNow, onLogin = _a.onLogin;
    // Fetch services from API
    var _b = useQuery({
        queryKey: ['services'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/services')];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Failed to fetch services');
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
    }), _c = _b.data, services = _c === void 0 ? [] : _c, servicesLoading = _b.isLoading;
    var content = {
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
    var t = content[currentLanguage];
    // Transform services from API to landing page format
    var landingServices = services.slice(0, 3).map(function (service) {
        var _a;
        return ({
            name: service.title,
            price: ((_a = service.prices) === null || _a === void 0 ? void 0 : _a.auto) ? "".concat(service.prices.auto.toLocaleString(), " Gs") : "Consultar",
            features: service.description.split('. ').slice(0, 2), // Split description into features
            imageUrl: service.imageUrl
        });
    });
    // Fallback services if API fails
    var fallbackServices = [
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
    var displayServices = servicesLoading || services.length === 0 ? fallbackServices : landingServices;
    return (<div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary"/>
            <span className="text-xl font-bold text-foreground">{t.title}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle currentLanguage={currentLanguage} onLanguageChange={onLanguageChange}/>
            <Button variant="ghost" onClick={onLogin} data-testid="button-login">
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
          <Button size="lg" onClick={onBookNow} className="text-lg px-8 py-6" data-testid="button-book-now">
            <Car className="h-5 w-5 mr-2"/>
            {t.cta}
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {t.features.map(function (feature, index) {
            var IconComponent = feature.icon;
            return (<Card key={index} className="text-center">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>);
        })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t.services}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {displayServices.map(function (service, index) { return (<Card key={index} className="hover-elevate">
                {/* Service Image */}
                {service.imageUrl && (<div className="w-full h-32 bg-muted rounded-t-lg overflow-hidden">
                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" loading="lazy"/>
                  </div>)}
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{service.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map(function (feature, featureIndex) { return (<li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600"/>
                        <span className="text-sm">{feature}</span>
                      </li>); })}
                  </ul>
                </CardContent>
              </Card>); })}
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
                  <MapPin className="h-5 w-5 text-primary"/>
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
                  <MessageCircle className="h-5 w-5 text-primary"/>
                  {t.whatsapp}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2"/>
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
    </div>);
}
