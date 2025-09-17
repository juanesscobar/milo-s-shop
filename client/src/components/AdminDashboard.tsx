import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "./BookingCard";
import StatusBadge from "./StatusBadge";
import { CalendarDays, Car, DollarSign, Clock, TrendingUp } from "lucide-react";

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
}

export default function AdminDashboard({ 
  stats, 
  todayBookings, 
  onStatusUpdate, 
  onViewDetails 
}: AdminDashboardProps) {
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
      color: "text-blue-600"
    },
    {
      title: "En lavado",
      value: stats.activeWashing,
      icon: Car,
      description: "Actualmente lavando",
      color: "text-orange-600"
    },
    {
      title: "Finalizados hoy",
      value: stats.completedToday,
      icon: Clock,
      description: "Servicios completados",
      color: "text-green-600"
    },
    {
      title: "Ingresos del día",
      value: formatCurrency(stats.todayRevenue),
      icon: DollarSign,
      description: "Facturación diaria",
      color: "text-primary"
    }
  ];

  const filterBookings = (status: string) => {
    return todayBookings.filter(booking => booking.status === status);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen del día - {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
        <Button variant="outline" data-testid="button-refresh-dashboard">
          <TrendingUp className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} data-testid={`card-stat-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

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