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
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "./Header";
import NewServiceCard from "./NewServiceCard";
import BookingCard from "./BookingCard";
import BookingFlow from "./BookingFlow";
import VehicleSelector from "./VehicleSelector";
import ClientAuth from "./ClientAuth";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, User, History, Car, AlertTriangle, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
export default function ClienteApp(_a) {
    var _this = this;
    var _b = _a.language, language = _b === void 0 ? 'es' : _b;
    console.log('🔐 ClienteApp: Componente renderizado');
    var _c = useState(language), currentLanguage = _c[0], setCurrentLanguage = _c[1];
    var _d = useState(null), selectedVehicleType = _d[0], setSelectedVehicleType = _d[1];
    var _e = useState(null), bookingService = _e[0], setBookingService = _e[1];
    var _f = useState(0), forceAuthUpdate = _f[0], setForceAuthUpdate = _f[1];
    // Authentication
    var _g = useAuth(), user = _g.user, authLoading = _g.isLoading, isAuthenticated = _g.isAuthenticated, logout = _g.logout;
    console.log('🔐 ClienteApp: Estado de auth - isAuthenticated:', isAuthenticated, 'user:', user, 'authLoading:', authLoading);
    // Authentication callback
    var handleAuthSuccess = function (authenticatedUser) {
        console.log('🔐 ClienteApp: handleAuthSuccess llamado con usuario:', authenticatedUser);
        console.log('🔐 ClienteApp: Usuario autenticado:', authenticatedUser.name);
        // Force re-render to update authentication state
        setForceAuthUpdate(function (prev) { return prev + 1; });
    };
    var content = {
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
            camioneta: "Camioneta",
            welcome: "Bienvenido",
            logout: "Cerrar sesión",
            accountInfo: "Información de cuenta"
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
            camioneta: "Caminhonete",
            welcome: "Bem-vindo",
            logout: "Sair",
            accountInfo: "Informações da conta"
        }
    };
    var t = content[currentLanguage];
    // Fetch services from API
    var _h = useQuery({
        queryKey: ['services', selectedVehicleType],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = selectedVehicleType ? "/api/services?vehicleType=".concat(selectedVehicleType) : '/api/services';
                        return [4 /*yield*/, fetch(url, { credentials: 'include' })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Failed to fetch services');
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
    }), _j = _h.data, services = _j === void 0 ? [] : _j, servicesLoading = _h.isLoading, servicesError = _h.error;
    // Fetch user bookings from API
    var _k = useQuery({
        queryKey: ['bookings'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 DEBUG: ClienteApp - Fetching bookings from /api/bookings');
                        return [4 /*yield*/, fetch('/api/bookings', { credentials: 'include' })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Failed to fetch bookings');
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        console.log('🔍 DEBUG: ClienteApp - Bookings fetched:', data.length, 'bookings');
                        return [2 /*return*/, data];
                }
            });
        }); },
        staleTime: 1 * 60 * 1000, // 1 minute
    }), _l = _k.data, userBookings = _l === void 0 ? [] : _l, bookingsLoading = _k.isLoading, bookingsError = _k.error, refetchBookings = _k.refetch;
    var handleServiceReserve = function (serviceSlug) {
        var service = services.find(function (s) { return s.slug === serviceSlug; });
        if (service) {
            setBookingService(service);
        }
    };
    var handleBackToServices = function () {
        setBookingService(null);
    };
    var handleUploadImage = function (serviceSlug, file) { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Upload de imagem para serviço:', serviceSlug, file.name);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    formData = new FormData();
                    formData.append('image', file);
                    formData.append('serviceSlug', serviceSlug);
                    return [4 /*yield*/, fetch('/api/services/upload-image', {
                            method: 'POST',
                            body: formData,
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    console.log('Imagem carregada com sucesso:', result);
                    return [3 /*break*/, 5];
                case 4:
                    console.error('Erro ao carregar imagem');
                    alert('Erro ao carregar imagem. Tente novamente.');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Erro ao fazer upload:', error_1);
                    alert('Erro ao carregar imagem. Verifique sua conexão.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleOrderDetails = function (orderId) {
        console.log('View order details:', orderId);
    };
    // Show loading while checking authentication
    if (authLoading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>);
    }
    // Show authentication screen if not authenticated
    if (!isAuthenticated) {
        return <ClientAuth onAuthSuccess={handleAuthSuccess} currentLanguage={currentLanguage}/>;
    }
    // Show booking flow if service is selected
    if (bookingService) {
        return (<div className="min-h-screen bg-background">
        <Header currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage}/>
        
        <div className="container mx-auto px-4 py-6">
          <BookingFlow service={bookingService} selectedVehicleType={selectedVehicleType || 'auto'} onBack={handleBackToServices} language={currentLanguage} authenticatedUser={user}/>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage}/>
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <Tabs defaultValue="services" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services" data-testid="tab-services">
              <ShoppingCart className="h-4 w-4 mr-2"/>
              {t.services}
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">
              <History className="h-4 w-4 mr-2"/>
              {t.bookings}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2"/>
              {t.profile}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {/* Vehicle Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5"/>
                  {currentLanguage === 'es' ? 'Paso 1: Selecciona tu vehículo' : 'Passo 1: Selecione seu veículo'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage === 'es'
            ? 'Elige el tipo de vehículo para ver los precios correspondientes'
            : 'Escolha o tipo de veículo para ver os preços correspondentes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleSelector selectedType={selectedVehicleType} onSelect={setSelectedVehicleType} language={currentLanguage}/>
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
            : 'Escolha o serviço que melhor se adapta às suas necessidades'}
                </p>
              </div>
              
              {!selectedVehicleType && (<Alert className="bg-background border-border">
                  <AlertTriangle className="h-4 w-4"/>
                  <AlertDescription className="text-muted-foreground">
                    {currentLanguage === 'es'
                ? 'Por favor selecciona tu tipo de vehículo primero para ver los precios'
                : 'Por favor selecione o tipo de veículo primeiro para ver os preços'}
                  </AlertDescription>
                </Alert>)}
              
              {servicesLoading && (<div className="text-center py-8 text-muted-foreground">
                  {currentLanguage === 'es' ? 'Cargando servicios...' : 'Carregando serviços...'}
                </div>)}
              
              {servicesError && (<div className="text-center py-8 text-red-500">
                  {currentLanguage === 'es' ? 'Error al cargar servicios' : 'Erro ao carregar serviços'}
                </div>)}

              {!servicesLoading && !servicesError && services.length === 0 && selectedVehicleType && (<div className="text-center py-8 text-muted-foreground">
                  {currentLanguage === 'es' ? 'No hay servicios para este tipo de vehículo' : 'Não há serviços para este tipo de veículo'}
                </div>)}

              {!servicesLoading && !servicesError && services.length > 0 && (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map(function (service) { return (<NewServiceCard key={service.slug} service={service} selectedVehicleType={selectedVehicleType} language={currentLanguage} onReserve={handleServiceReserve}/>); })}
                </div>)}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookingsLoading && (<div className="text-center py-8 text-muted-foreground">
                {currentLanguage === 'es' ? 'Cargando reservas...' : 'Carregando reservas...'}
              </div>)}
            
            {bookingsError && (<div className="text-center py-8 text-red-500">
                {currentLanguage === 'es' ? 'Error al cargar reservas' : 'Erro ao carregar reservas'}
              </div>)}
            
            {!bookingsLoading && !bookingsError && userBookings.length === 0 && (<div className="text-center py-8 text-muted-foreground">
                {currentLanguage === 'es' ? 'No tienes reservas aún' : 'Você não tem reservas ainda'}
              </div>)}
            
            {!bookingsLoading && !bookingsError && userBookings.length > 0 && (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userBookings.map(function (booking) {
                // Convert booking data to format expected by BookingCard
                var service = services.find(function (s) { return s.id === booking.serviceId; });
                var serviceName = service ? service.title : 'Servicio';
                return (<BookingCard key={booking.id} id={booking.id} serviceName={serviceName} vehiclePlate={"Booking-".concat(booking.id.slice(-4))} date={booking.date} timeSlot={booking.timeSlot} status={booking.status} price={booking.price} paymentMethod={'cash'} paymentStatus={'pending'} onViewDetails={handleOrderDetails}/>);
            })}
              </div>)}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5"/>
                  {t.accountInfo}
                </CardTitle>
                <CardDescription>
                  {t.welcome}, {(user === null || user === void 0 ? void 0 : user.name) || 'Cliente'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground"/>
                    <div>
                      <label className="text-sm font-medium">
                        {currentLanguage === 'es' ? 'Nombre' : 'Nome'}
                      </label>
                      <p className="text-muted-foreground">{user === null || user === void 0 ? void 0 : user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground"/>
                    <div>
                      <label className="text-sm font-medium">
                        {currentLanguage === 'es' ? 'Teléfono' : 'Telefone'}
                      </label>
                      <p className="text-muted-foreground">{user === null || user === void 0 ? void 0 : user.phone}</p>
                    </div>
                  </div>
                  {(user === null || user === void 0 ? void 0 : user.email) && (<div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground"/>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-muted-foreground">{user === null || user === void 0 ? void 0 : user.email}</p>
                      </div>
                    </div>)}
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="ml-1">
                      {currentLanguage === 'es' ? 'Cliente Activo' : 'Cliente Ativo'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);
}
