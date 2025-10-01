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
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import BookingCard from "./BookingCard";
import BookingsTable from "./BookingsTable";
import MiniAnalytics from "./MiniAnalytics";
import { CalendarDays, Car, DollarSign, Clock, TrendingUp, List, Eye, History, FileText, Upload, Image as ImageIcon, Settings } from "lucide-react";
export default function AdminDashboard(_a) {
    var _this = this;
    var stats = _a.stats, todayBookings = _a.todayBookings, onStatusUpdate = _a.onStatusUpdate, onViewDetails = _a.onViewDetails, onRefresh = _a.onRefresh, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.isRefreshing, isRefreshing = _c === void 0 ? false : _c;
    console.log('🔄 DEBUG: AdminDashboard render - isRefreshing:', isRefreshing);
    var _d = useState('dashboard'), currentView = _d[0], setCurrentView = _d[1];
    var fileInputRef = useRef(null);
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _e = useState(null), selectedFile = _e[0], setSelectedFile = _e[1];
    var _f = useState(null), previewUrl = _f[0], setPreviewUrl = _f[1];
    var _g = useState(null), selectedService = _g[0], setSelectedService = _g[1];
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    // Fetch services
    var _h = useQuery({
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
        staleTime: 5 * 60 * 1000,
    }), _j = _h.data, services = _j === void 0 ? [] : _j, servicesLoading = _h.isLoading;
    // Image upload mutation
    var uploadImageMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var formData, response, error;
            var serviceSlug = _b.serviceSlug, file = _b.file;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('image', file);
                        formData.append('serviceSlug', serviceSlug);
                        return [4 /*yield*/, fetch('/api/services/upload-image', {
                                method: 'POST',
                                body: formData,
                            })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _c.sent();
                        throw new Error(error.error || 'Upload failed');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast({
                title: "✅ Imagen subida correctamente",
                description: "La imagen del servicio ha sido actualizada.",
            });
        },
        onError: function (error) {
            toast({
                title: "❌ Error al subir imagen",
                description: error.message || "No se pudo subir la imagen",
                variant: "destructive",
            });
        }
    });
    var handleImageUpload = function (serviceSlug, file) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            uploadImageMutation.mutate({ serviceSlug: serviceSlug, file: file });
            return [2 /*return*/];
        });
    }); };
    var handleFileSelect = function (service) {
        setSelectedService(service);
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function (e) {
            var _a;
            var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    toast({
                        title: "Archivo demasiado grande",
                        description: "El archivo debe ser menor a 5MB",
                        variant: "destructive",
                    });
                    return;
                }
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast({
                        title: "Tipo de archivo no válido",
                        description: "Solo se permiten archivos de imagen",
                        variant: "destructive",
                    });
                    return;
                }
                setSelectedFile(file);
                var url = URL.createObjectURL(file);
                setPreviewUrl(url);
            }
        };
        input.click();
    };
    var handleSaveImage = function () {
        if (selectedService && selectedFile) {
            handleImageUpload(selectedService.slug, selectedFile);
            setSelectedFile(null);
            setPreviewUrl(null);
            setSelectedService(null);
        }
    };
    var handleCancelUpload = function () {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setSelectedService(null);
    };
    var statCards = [
        {
            title: "Agendamientos de hoy",
            value: stats.todayBookings,
            icon: CalendarDays,
            description: "Total programados",
            color: "text-blue-600",
            actionButton: {
                text: "Ver lista",
                icon: List,
                onClick: function () { return setCurrentView('bookings-list'); }
            }
        },
        {
            title: "En lavado",
            value: stats.activeWashing,
            icon: Car,
            description: "Actualmente lavando",
            color: "text-orange-600",
            actionButton: {
                text: "Ver detalle",
                icon: Eye,
                onClick: function () { return setCurrentView('washing-detail'); }
            }
        },
        {
            title: "Finalizados hoy",
            value: stats.completedToday,
            icon: Clock,
            description: "Servicios completados",
            color: "text-green-600",
            actionButton: {
                text: "Historial del día",
                icon: History,
                onClick: function () { return setCurrentView('completed-history'); }
            }
        },
        {
            title: "Ingresos del día",
            value: formatCurrency(stats.todayRevenue),
            icon: DollarSign,
            description: "Facturación diaria",
            color: "text-primary",
            actionButton: {
                text: "Ver detalles",
                icon: FileText,
                onClick: function () { return setCurrentView('revenue-detail'); }
            }
        }
    ];
    var filterBookings = function (status) {
        return todayBookings.filter(function (booking) { return booking.status === status; });
    };
    // Show specific views based on currentView state
    if (currentView === 'bookings-list') {
        return (<div className="space-y-6 p-6">
        <BookingsTable bookings={todayBookings} title="Lista de Agendamientos de Hoy" onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} onBack={function () { return setCurrentView('dashboard'); }}/>
      </div>);
    }
    if (currentView === 'washing-detail') {
        return (<div className="space-y-6 p-6">
        <BookingsTable bookings={todayBookings} title="Vehículos en Lavado" onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} onBack={function () { return setCurrentView('dashboard'); }} filterStatus="washing"/>
      </div>);
    }
    if (currentView === 'completed-history') {
        return (<div className="space-y-6 p-6">
        <BookingsTable bookings={todayBookings} title="Historial del Día - Servicios Completados" onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} onBack={function () { return setCurrentView('dashboard'); }} filterStatus="done"/>
      </div>);
    }
    if (currentView === 'revenue-detail') {
        var completedBookings = filterBookings('done');
        var revenueByService = completedBookings.reduce(function (acc, booking) {
            var serviceName = booking.serviceName;
            if (!acc[serviceName]) {
                acc[serviceName] = { count: 0, total: 0 };
            }
            acc[serviceName].count++;
            acc[serviceName].total += booking.price;
            return acc;
        }, {});
        var revenueByPaymentMethod = completedBookings.reduce(function (acc, booking) {
            var method = booking.paymentMethod || 'cash';
            if (!acc[method]) {
                acc[method] = 0;
            }
            acc[method] += booking.price;
            return acc;
        }, {});
        return (<div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={function () { return setCurrentView('dashboard'); }} data-testid="button-back-to-dashboard">
                <List className="h-4 w-4"/>
              </Button>
              <CardTitle>Detalles de Ingresos del Día</CardTitle>
            </div>
            <CardDescription>
              Desglose completo por servicio y método de pago
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Revenue by Service */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingresos por Servicio</h3>
              <div className="space-y-2">
                {Object.entries(revenueByService).map(function (_a) {
                var service = _a[0], data = _a[1];
                return (<div key={service} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">{service}</span>
                      <span className="text-sm text-muted-foreground ml-2">({data.count} servicios)</span>
                    </div>
                    <span className="font-bold text-green-600">{formatCurrency(data.total)}</span>
                  </div>);
            })}
              </div>
            </div>

            {/* Revenue by Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingresos por Método de Pago</h3>
              <div className="space-y-2">
                {Object.entries(revenueByPaymentMethod).map(function (_a) {
                var method = _a[0], total = _a[1];
                return (<div key={method} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">
                      {method === 'card' ? 'Tarjeta' : method === 'pix' ? 'PIX' : 'Efectivo'}
                    </span>
                    <span className="font-bold text-primary">{formatCurrency(total)}</span>
                  </div>);
            })}
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total del Día:</span>
                <span className="text-primary">{formatCurrency(stats.todayRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>);
    }
    if (currentView === 'services-management') {
        return (<div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={function () { return setCurrentView('dashboard'); }} data-testid="button-back-to-dashboard">
                <List className="h-4 w-4"/>
              </Button>
              <CardTitle>Gestión de Servicios</CardTitle>
            </div>
            <CardDescription>
              Administra las imágenes y configuraciones de los servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (<div className="text-center py-8">Cargando servicios...</div>) : (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map(function (service) { return (<Card key={service.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {service.imageUrl ? (<img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" loading="lazy"/>) : (<div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12"/>
                        </div>)}
                      <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={function () { return handleFileSelect(service); }} disabled={uploadImageMutation.isPending}>
                        <Upload className="h-4 w-4"/>
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.description}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Slug: {service.slug}
                      </div>
                    </CardContent>
                  </Card>); })}
              </div>)}
          </CardContent>
        </Card>

        {/* Image Upload Dialog */}
        <Dialog open={!!selectedService} onOpenChange={function (open) { return !open && handleCancelUpload(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedService ? "Subir imagen para ".concat(selectedService.title) : 'Subir imagen'}
              </DialogTitle>
              <DialogDescription>
                Selecciona una imagen para este servicio. Tamaño máximo: 5MB.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Current Image Preview */}
              {(selectedService === null || selectedService === void 0 ? void 0 : selectedService.imageUrl) && !previewUrl && (<div>
                  <Label className="text-sm font-medium">Imagen actual:</Label>
                  <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden">
                    <img src={selectedService.imageUrl} alt="Imagen actual" className="w-full h-full object-cover"/>
                  </div>
                </div>)}

              {/* New Image Preview */}
              {previewUrl && (<div>
                  <Label className="text-sm font-medium">Vista previa:</Label>
                  <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden">
                    <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover"/>
                  </div>
                  {selectedFile && (<p className="text-xs text-muted-foreground mt-1">
                      Archivo: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>)}
                </div>)}

              {!selectedFile && (<div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2"/>
                  <p className="text-sm text-muted-foreground">
                    No se ha seleccionado ninguna imagen
                  </p>
                </div>)}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelUpload} disabled={uploadImageMutation.isPending}>
                Cancelar
              </Button>
              <Button onClick={handleSaveImage} disabled={!selectedFile || uploadImageMutation.isPending}>
                {uploadImageMutation.isPending ? 'Subiendo...' : 'Guardar imagen'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>);
    }
    return (<div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Gestión rápida de tus reservas y servicios de hoy
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
        <Button variant="outline" data-testid="button-refresh-dashboard" onClick={onRefresh} disabled={isLoading || isRefreshing}>
          <TrendingUp className="h-4 w-4 mr-2"/>
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(function (stat, index) {
            var IconComponent = stat.icon;
            var ActionIcon = stat.actionButton.icon;
            return (<Card key={index} data-testid={"card-stat-".concat(index)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={"h-4 w-4 ".concat(stat.color)}/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-3">{stat.description}</p>
                <Button size="sm" variant="outline" onClick={stat.actionButton.onClick} className="w-full" data-testid={"button-".concat(stat.actionButton.text.toLowerCase().replace(/\s+/g, '-'))}>
                  <ActionIcon className="h-3 w-3 mr-1"/>
                  {stat.actionButton.text}
                </Button>
              </CardContent>
            </Card>);
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas de administración adicionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" onClick={function () { return setCurrentView('services-management'); }} className="flex items-center gap-2">
              <Settings className="h-4 w-4"/>
              Gestionar Servicios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mini Analytics */}
      <MiniAnalytics bookings={todayBookings}/>

      {/* Bookings Management */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-bookings">
            Todos ({todayBookings.length})
          </TabsTrigger>
          <TabsTrigger value="waiting" data-testid="tab-waiting-bookings">
            En espera ({filterBookings('waiting').length})
          </TabsTrigger>
          <TabsTrigger value="washing" data-testid="tab-washing-bookings">
            Lavando ({filterBookings('washing').length})
          </TabsTrigger>
          <TabsTrigger value="done" data-testid="tab-done-bookings">
            Finalizados ({filterBookings('done').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayBookings.map(function (booking) { return (<BookingCard key={booking.id} {...booking} onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} isAdmin={true}/>); })}
          </div>
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterBookings('waiting').map(function (booking) { return (<BookingCard key={booking.id} {...booking} onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} isAdmin={true}/>); })}
          </div>
        </TabsContent>

        <TabsContent value="washing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterBookings('washing').map(function (booking) { return (<BookingCard key={booking.id} {...booking} onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} isAdmin={true}/>); })}
          </div>
        </TabsContent>

        <TabsContent value="done" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterBookings('done').map(function (booking) { return (<BookingCard key={booking.id} {...booking} onStatusUpdate={onStatusUpdate} onViewDetails={onViewDetails} isAdmin={true}/>); })}
          </div>
        </TabsContent>
      </Tabs>
    </div>);
}
