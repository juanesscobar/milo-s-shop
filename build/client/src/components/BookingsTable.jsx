import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { Search, Play, Check, X, Eye, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
export default function BookingsTable(_a) {
    var bookings = _a.bookings, title = _a.title, onStatusUpdate = _a.onStatusUpdate, onViewDetails = _a.onViewDetails, onBack = _a.onBack, filterStatus = _a.filterStatus;
    var _b = useState(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = useState(1), currentPage = _c[0], setCurrentPage = _c[1];
    var itemsPerPage = 10;
    // Filter bookings based on search and status
    var filteredBookings = bookings.filter(function (booking) {
        var matchesSearch = booking.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesStatus = !filterStatus || booking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    // Pagination
    var totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    var startIndex = (currentPage - 1) * itemsPerPage;
    var paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
    var formatPrice = function (price) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(price);
    };
    var getPaymentMethodText = function (method) {
        switch (method) {
            case 'card': return 'Tarjeta';
            case 'pix': return 'PIX';
            case 'cash': return 'Efectivo';
            default: return 'No definido';
        }
    };
    var getPaymentStatusColor = function (status) {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-600';
            case 'failed': return 'bg-red-100 text-red-600';
            default: return 'bg-yellow-100 text-yellow-600';
        }
    };
    var handleStatusUpdate = function (bookingId, newStatus) {
        onStatusUpdate(bookingId, newStatus);
    };
    var getStatusActions = function (booking) {
        var actions = [];
        if (booking.status === 'waiting') {
            actions.push(<Button key="start" size="sm" variant="outline" className="text-orange-600 hover:bg-orange-50" onClick={function () { return handleStatusUpdate(booking.id, 'washing'); }} data-testid={"button-start-washing-".concat(booking.id)}>
          <Play className="h-3 w-3 mr-1"/>
          Iniciar
        </Button>);
        }
        if (booking.status === 'washing') {
            actions.push(<Button key="finish" size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={function () { return handleStatusUpdate(booking.id, 'done'); }} data-testid={"button-finish-washing-".concat(booking.id)}>
          <Check className="h-3 w-3 mr-1"/>
          Finalizar
        </Button>);
        }
        if (booking.status !== 'done' && booking.status !== 'cancelled') {
            actions.push(<Button key="cancel" size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={function () { return handleStatusUpdate(booking.id, 'cancelled'); }} data-testid={"button-cancel-".concat(booking.id)}>
          <X className="h-3 w-3 mr-1"/>
          Cancelar
        </Button>);
        }
        actions.push(<Button key="view" size="sm" variant="ghost" onClick={function () { return onViewDetails(booking.id); }} data-testid={"button-view-details-".concat(booking.id)}>
        <Eye className="h-3 w-3 mr-1"/>
        Ver
      </Button>);
        return actions;
    };
    return (<Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back-to-dashboard">
                <ArrowLeft className="h-4 w-4"/>
              </Button>
              {title}
            </CardTitle>
            <CardDescription>
              {filteredBookings.length} reserva{filteredBookings.length !== 1 ? 's' : ''} encontrada{filteredBookings.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2"/>
            <Input placeholder="Buscar por placa o nombre..." value={searchTerm} onChange={function (e) {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
        }} className="pl-8" data-testid="input-search-bookings"/>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo/Placa</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.length === 0 ? (<TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No se encontraron reservas con ese criterio de búsqueda' : 'No hay reservas para mostrar'}
                </TableCell>
              </TableRow>) : (paginatedBookings.map(function (booking) { return (<TableRow key={booking.id} data-testid={"row-booking-".concat(booking.id)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.userName || 'Cliente'}</div>
                      <div className="text-sm text-muted-foreground">{booking.userPhone || ''}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{booking.vehiclePlate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{booking.serviceName}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(booking.price)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(booking.date).toLocaleDateString('es-ES')}</div>
                      <div className="text-muted-foreground">{booking.timeSlot}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} size="sm"/>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {getPaymentMethodText(booking.paymentMethod)}
                      </Badge>
                      <div>
                        <Badge variant="outline" className={"text-xs ".concat(getPaymentStatusColor(booking.paymentStatus))}>
                          {booking.paymentStatus || 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {getStatusActions(booking)}
                    </div>
                  </TableCell>
                </TableRow>); }))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (<div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredBookings.length)} de {filteredBookings.length} reservas
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={function () { return setCurrentPage(function (prev) { return Math.max(prev - 1, 1); }); }} disabled={currentPage === 1} data-testid="button-prev-page">
                <ChevronLeft className="h-4 w-4"/>
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={function () { return setCurrentPage(function (prev) { return Math.min(prev + 1, totalPages); }); }} disabled={currentPage === totalPages} data-testid="button-next-page">
                Siguiente
                <ChevronRight className="h-4 w-4"/>
              </Button>
            </div>
          </div>)}
      </CardContent>
    </Card>);
}
