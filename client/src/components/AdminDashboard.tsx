import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "./BookingCard";
import BookingsTable from "./BookingsTable";
import MiniAnalytics from "./MiniAnalytics";
import StatusBadge from "./StatusBadge";
import { CalendarDays, Car, DollarSign, Clock, TrendingUp, List, Eye, History, FileText } from "lucide-react";

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
}

export default function AdminDashboard({ 
  stats, 
  todayBookings, 
  onStatusUpdate, 
  onViewDetails,
  onRefresh,
  isLoading = false
}: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'bookings-list' | 'washing-detail' | 'completed-history' | 'revenue-detail'>('dashboard');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(amount);
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
                {Object.entries(revenueByService).map(([service, data]: [string, { count: number; total: number }]) => (
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
                {Object.entries(revenueByPaymentMethod).map(([method, total]: [string, number]) => (
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
          disabled={isLoading}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          {isLoading ? 'Actualizando...' : 'Actualizar'}
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