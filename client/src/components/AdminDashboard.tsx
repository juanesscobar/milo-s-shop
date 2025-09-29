import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import BookingCard from "./BookingCard";
import BookingsTable from "./BookingsTable";
import MiniAnalytics from "./MiniAnalytics";
import StatusBadge from "./StatusBadge";
import type { Service } from "@shared/schema";
import { CalendarDays, Car, DollarSign, Clock, TrendingUp, List, Eye, History, FileText, Upload, Image as ImageIcon, Settings } from "lucide-react";

interface DashboardStats {
  todayBookings: number;
  activeWashing: number;
  completedToday: number;
  todayRevenue: number;
  avgServiceTime: number;
}

interface AdminDashboardProps {
  stats: DashboardStats;
  todayBookings: any[];
  onStatusUpdate: (bookingId: string, newStatus: string) => void;
  onViewDetails: (bookingId: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
}

export default function AdminDashboard({
  stats,
  todayBookings,
  onStatusUpdate,
  onViewDetails,
  onRefresh,
  isLoading = false,
  isRefreshing = false
}: AdminDashboardProps) {
  console.log('🔄 DEBUG: AdminDashboard render - isRefreshing:', isRefreshing);
  const [currentView, setCurrentView] = useState<'dashboard' | 'bookings-list' | 'washing-detail' | 'completed-history' | 'revenue-detail' | 'services-management'>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ serviceSlug, file }: { serviceSlug: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('serviceSlug', serviceSlug);

      const response = await fetch('/api/services/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "✅ Imagen subida correctamente",
        description: "La imagen del servicio ha sido actualizada.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error al subir imagen",
        description: error.message || "No se pudo subir la imagen",
        variant: "destructive",
      });
    }
  });

  const handleImageUpload = async (serviceSlug: string, file: File) => {
    uploadImageMutation.mutate({ serviceSlug, file });
  };

  const handleFileSelect = (service: Service) => {
    setSelectedService(service);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
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
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    };
    input.click();
  };

  const handleSaveImage = () => {
    if (selectedService && selectedFile) {
      handleImageUpload(selectedService.slug, selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedService(null);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedService(null);
  };

  const statCards = [
    {
      title: "Agendamientos de hoy",
      value: stats.todayBookings,
      icon: CalendarDays,
      description: "Total programados",
      color: "text-blue-600",
      actionButton: {
        text: "Ver lista",
        icon: List,
        onClick: () => setCurrentView('bookings-list')
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
        onClick: () => setCurrentView('washing-detail')
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
        onClick: () => setCurrentView('completed-history')
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
        onClick: () => setCurrentView('revenue-detail')
      }
    }
  ];

  const filterBookings = (status: string) => {
    return todayBookings.filter(booking => booking.status === status);
  };

  // Show specific views based on currentView state
  if (currentView === 'bookings-list') {
    return (
      <div className="space-y-6 p-6">
        <BookingsTable
          bookings={todayBookings}
          title="Lista de Agendamientos de Hoy"
          onStatusUpdate={onStatusUpdate}
          onViewDetails={onViewDetails}
          onBack={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  if (currentView === 'washing-detail') {
    return (
      <div className="space-y-6 p-6">
        <BookingsTable
          bookings={todayBookings}
          title="Vehículos en Lavado"
          onStatusUpdate={onStatusUpdate}
          onViewDetails={onViewDetails}
          onBack={() => setCurrentView('dashboard')}
          filterStatus="washing"
        />
      </div>
    );
  }

  if (currentView === 'completed-history') {
    return (
      <div className="space-y-6 p-6">
        <BookingsTable
          bookings={todayBookings}
          title="Historial del Día - Servicios Completados"
          onStatusUpdate={onStatusUpdate}
          onViewDetails={onViewDetails}
          onBack={() => setCurrentView('dashboard')}
          filterStatus="done"
        />
      </div>
    );
  }

  if (currentView === 'revenue-detail') {
    const completedBookings = filterBookings('done');
    const revenueByService = completedBookings.reduce((acc, booking) => {
      const serviceName = booking.serviceName;
      if (!acc[serviceName]) {
        acc[serviceName] = { count: 0, total: 0 };
      }
      acc[serviceName].count++;
      acc[serviceName].total += booking.price;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const revenueByPaymentMethod = completedBookings.reduce((acc, booking) => {
      const method = booking.paymentMethod || 'cash';
      if (!acc[method]) {
        acc[method] = 0;
      }
      acc[method] += booking.price;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                data-testid="button-back-to-dashboard"
              >
                <List className="h-4 w-4" />
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
                {Object.entries(revenueByService).map(([service, data]: [string, any]) => (
                  <div key={service} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">{service}</span>
                      <span className="text-sm text-muted-foreground ml-2">({data.count} servicios)</span>
                    </div>
                    <span className="font-bold text-green-600">{formatCurrency(data.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingresos por Método de Pago</h3>
              <div className="space-y-2">
                {Object.entries(revenueByPaymentMethod).map(([method, total]: [string, any]) => (
                  <div key={method} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">
                      {method === 'card' ? 'Tarjeta' : method === 'pix' ? 'PIX' : 'Efectivo'}
                    </span>
                    <span className="font-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                ))}
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
      </div>
    );
  }

  if (currentView === 'services-management') {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                data-testid="button-back-to-dashboard"
              >
                <List className="h-4 w-4" />
              </Button>
              <CardTitle>Gestión de Servicios</CardTitle>
            </div>
            <CardDescription>
              Administra las imágenes y configuraciones de los servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="text-center py-8">Cargando servicios...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => handleFileSelect(service)}
                        disabled={uploadImageMutation.isPending}
                      >
                        <Upload className="h-4 w-4" />
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
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Upload Dialog */}
        <Dialog open={!!selectedService} onOpenChange={(open) => !open && handleCancelUpload()}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedService ? `Subir imagen para ${selectedService.title}` : 'Subir imagen'}
              </DialogTitle>
              <DialogDescription>
                Selecciona una imagen para este servicio. Tamaño máximo: 5MB.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Current Image Preview */}
              {selectedService?.imageUrl && !previewUrl && (
                <div>
                  <Label className="text-sm font-medium">Imagen actual:</Label>
                  <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedService.imageUrl}
                      alt="Imagen actual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {previewUrl && (
                <div>
                  <Label className="text-sm font-medium">Vista previa:</Label>
                  <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Archivo: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {!selectedFile && (
                <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No se ha seleccionado ninguna imagen
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancelUpload}
                disabled={uploadImageMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveImage}
                disabled={!selectedFile || uploadImageMutation.isPending}
              >
                {uploadImageMutation.isPending ? 'Subiendo...' : 'Guardar imagen'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
        <Button
          variant="outline"
          data-testid="button-refresh-dashboard"
          onClick={onRefresh}
          disabled={isLoading || isRefreshing}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const ActionIcon = stat.actionButton.icon;
          return (
            <Card key={index} data-testid={`card-stat-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-3">{stat.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stat.actionButton.onClick}
                  className="w-full"
                  data-testid={`button-${stat.actionButton.text.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ActionIcon className="h-3 w-3 mr-1" />
                  {stat.actionButton.text}
                </Button>
              </CardContent>
            </Card>
          );
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
            <Button
              variant="outline"
              onClick={() => setCurrentView('services-management')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Gestionar Servicios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mini Analytics */}
      <MiniAnalytics bookings={todayBookings} />

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
            {todayBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                {...booking}
                onStatusUpdate={onStatusUpdate}
                onViewDetails={onViewDetails}
                isAdmin={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterBookings('waiting').map((booking) => (
              <BookingCard
                key={booking.id}
                {...booking}
                onStatusUpdate={onStatusUpdate}
                onViewDetails={onViewDetails}
                isAdmin={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="washing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterBookings('washing').map((booking) => (
              <BookingCard
                key={booking.id}
                {...booking}
                onStatusUpdate={onStatusUpdate}
                onViewDetails={onViewDetails}
                isAdmin={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="done" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterBookings('done').map((booking) => (
              <BookingCard
                key={booking.id}
                {...booking}
                onStatusUpdate={onStatusUpdate}
                onViewDetails={onViewDetails}
                isAdmin={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}