import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
export default function MiniAnalytics(_a) {
    var _b;
    var bookings = _a.bookings;
    // Calculate most requested services (today)
    var todayBookings = bookings.filter(function (b) { return b.status !== 'cancelled'; });
    var serviceStats = todayBookings.reduce(function (acc, booking) {
        var serviceName = booking.serviceName;
        if (!acc[serviceName]) {
            acc[serviceName] = 0;
        }
        acc[serviceName]++;
        return acc;
    }, {});
    var sortedServices = Object.entries(serviceStats)
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    })
        .slice(0, 5); // Top 5 services
    var maxCount = ((_b = sortedServices[0]) === null || _b === void 0 ? void 0 : _b[1]) || 1;
    // Calculate revenue by payment method (today)
    var completedBookings = bookings.filter(function (b) { return b.status === 'done'; });
    var paymentStats = completedBookings.reduce(function (acc, booking) {
        var method = booking.paymentMethod || 'cash';
        if (!acc[method]) {
            acc[method] = { count: 0, total: 0 };
        }
        acc[method].count++;
        acc[method].total += booking.price;
        return acc;
    }, {});
    var totalRevenue = Object.values(paymentStats).reduce(function (sum, stat) { return sum + stat.total; }, 0);
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    var getPaymentMethodText = function (method) {
        switch (method) {
            case 'card': return 'Tarjeta';
            case 'pix': return 'PIX';
            case 'cash': return 'Efectivo';
            default: return method;
        }
    };
    var getPaymentMethodColor = function (method) {
        switch (method) {
            case 'card': return 'bg-blue-100 text-blue-700';
            case 'pix': return 'bg-green-100 text-green-700';
            case 'cash': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Most Requested Services - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Servicios Más Solicitados
          </CardTitle>
          <CardDescription>
            Ranking de servicios más pedidos hoy ({todayBookings.length} reservas)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedServices.length === 0 ? (<p className="text-center text-muted-foreground py-4">
              No hay datos de servicios para mostrar
            </p>) : (sortedServices.map(function (_a, index) {
            var service = _a[0], count = _a[1];
            var percentage = (count / maxCount) * 100;
            return (<div key={service} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-[200px]" title={service}>
                        {service}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {count} vez{count !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2"/>
                </div>);
        }))}
        </CardContent>
      </Card>

      {/* Revenue by Payment Method - Pie Chart Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💳</span>
            Ingresos por Método de Pago
          </CardTitle>
          <CardDescription>
            Distribución de ingresos de hoy ({completedBookings.length} pagos)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(paymentStats).length === 0 ? (<p className="text-center text-muted-foreground py-4">
              No hay pagos completados para mostrar
            </p>) : (<>
              {/* Payment Method Stats */}
              <div className="space-y-3">
                {Object.entries(paymentStats).map(function (_a) {
                var method = _a[0], data = _a[1];
                var percentage = totalRevenue > 0 ? (data.total / totalRevenue) * 100 : 0;
                return (<div key={method} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge className={getPaymentMethodColor(method)}>
                            {getPaymentMethodText(method)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({data.count} pago{data.count !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {formatCurrency(data.total)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2"/>
                    </div>);
            })}
              </div>

              {/* Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Recaudado:</span>
                  <span className="text-primary text-lg">
                    {formatCurrency(totalRevenue)}
                  </span>
                </div>
              </div>
            </>)}
        </CardContent>
      </Card>
    </div>);
}
