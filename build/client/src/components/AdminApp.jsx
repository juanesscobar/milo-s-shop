var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';
import Header from "./Header";
import AdminDashboard from "./AdminDashboard";
export default function AdminApp(_a) {
    var _this = this;
    var _b = _a.language, language = _b === void 0 ? 'es' : _b;
    var _c = useState(language), currentLanguage = _c[0], setCurrentLanguage = _c[1];
    var _d = useState(false), isRefreshing = _d[0], setIsRefreshing = _d[1];
    var queryClient = useQueryClient();
    var toast = useToast().toast;
    var _e = useWebSocket(), joinAdminRoom = _e.joinAdminRoom, disconnect = _e.disconnect, isConnected = _e.isConnected;
    // Initialize WebSocket connection for real-time updates
    useEffect(function () {
        console.log('AdminApp mounted - connecting to WebSocket...');
        joinAdminRoom();
        return function () {
            console.log('AdminApp unmounting - disconnecting WebSocket...');
            disconnect();
        };
    }, [joinAdminRoom, disconnect]);
    // Fetch today's bookings from backend
    var _f = useQuery({
        queryKey: ['/api/bookings/today'],
        retry: 3,
        retryDelay: 1000,
        enabled: true, // Always enabled, let React Query handle caching
        select: function (data) { return data; }
    }), _g = _f.data, rawBookings = _g === void 0 ? [] : _g, isLoading = _f.isLoading, error = _f.error, isFetching = _f.isFetching;
    // Debug logging for query success
    useEffect(function () {
        if (rawBookings.length > 0) {
            console.log('Today bookings loaded:', rawBookings.length, 'bookings');
        }
    }, [rawBookings]);
    // Transform bookings data
    var bookings = rawBookings.map(function (booking) { return (__assign(__assign({}, booking), { 
        // Use the flat fields returned by API (from joins)
        serviceName: booking.serviceName || 'Servicio desconocido', vehiclePlate: booking.vehiclePlate || 'Placa desconocida' })); });
    // Debug logs
    if (error) {
        console.error('AdminApp query error:', error.message);
    }
    // Calculate stats based on real data
    var stats = {
        todayBookings: bookings.length,
        activeWashing: bookings.filter(function (b) { return b.status === 'washing'; }).length,
        completedToday: bookings.filter(function (b) { return b.status === 'done'; }).length,
        todayRevenue: bookings
            .filter(function (b) { return b.status === 'done'; })
            .reduce(function (sum, b) { return sum + (b.price || 0); }, 0),
        avgServiceTime: 28 // TODO: Calculate based on actual service times
    };
    // Mutation to update booking status
    var statusUpdateMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var response, data;
            var bookingId = _b.bookingId, newStatus = _b.newStatus;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch("/api/bookings/".concat(bookingId, "/status"), {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ status: newStatus })
                        })];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _c.sent();
                        if (!response.ok) {
                            throw new Error(data.error || 'Error updating status');
                        }
                        return [2 /*return*/, data];
                }
            });
        }); },
        onSuccess: function (data, variables) {
            queryClient.invalidateQueries({ queryKey: ['/api/bookings/today'] });
            var statusText = variables.newStatus === 'washing' ? 'en lavado' :
                variables.newStatus === 'done' ? 'finalizado' :
                    variables.newStatus === 'cancelled' ? 'cancelado' : variables.newStatus;
            toast({
                title: "✅ Acción realizada con éxito",
                description: "Estado actualizado a: ".concat(statusText),
            });
        },
        onError: function (error) {
            if (error.message.includes('Price mismatch') || error.message.includes('price')) {
                toast({
                    title: "⚠️ Error de precio",
                    description: "El precio no coincide con la base de datos. Actualiza la tarifa del servicio y vuelve a intentar.",
                    variant: "destructive",
                });
            }
            else {
                toast({
                    title: "❌ Ocurrió un error. Intenta nuevamente.",
                    description: error.message || "No se pudo actualizar el estado de la reserva",
                    variant: "destructive",
                });
            }
        }
    });
    var handleStatusUpdate = function (bookingId, newStatus) {
        statusUpdateMutation.mutate({ bookingId: bookingId, newStatus: newStatus });
    };
    var handleViewDetails = function (bookingId) {
        var booking = bookings.find(function (b) { return b.id === bookingId; });
        if (booking) {
            // If there's a payment capture, open it in a new window
            if (booking.paymentCaptureUrl) {
                window.open(booking.paymentCaptureUrl, '_blank');
                return;
            }
            // Show booking details in alert for now - can be replaced with modal later
            var details = __spreadArray([
                "ID: ".concat(booking.id),
                "Servicio: ".concat(booking.serviceName),
                "Veh\u00EDculo: ".concat(booking.vehiclePlate),
                "Fecha: ".concat(booking.date),
                "Hora: ".concat(booking.timeSlot),
                "Precio: ".concat(new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(booking.price)),
                "M\u00E9todo de pago: ".concat(booking.paymentMethod || 'No definido'),
                "Estado del pago: ".concat(booking.paymentStatus || 'No definido')
            ], (booking.paymentCaptureUrl ? ['Captura de pago: Disponible'] : []), true).join('\n');
            alert(details);
        }
    };
    var handleRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
        var timeoutId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isRefreshing)
                        return [2 /*return*/]; // Prevent multiple clicks
                    setIsRefreshing(true);
                    timeoutId = setTimeout(function () {
                        setIsRefreshing(false);
                    }, 10000);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, queryClient.refetchQueries({ queryKey: ['/api/bookings/today'] })];
                case 2:
                    _a.sent();
                    toast({
                        title: "✅ Datos actualizados",
                        description: "La información del dashboard ha sido refrescada.",
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error during refresh:', error_1);
                    toast({
                        title: "❌ Error al actualizar",
                        description: "No se pudieron refrescar los datos. Intenta nuevamente.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    clearTimeout(timeoutId);
                    setIsRefreshing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (error) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground">No se pudieron cargar las reservas del día</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage}/>
      
      <AdminDashboard stats={stats} todayBookings={bookings} onStatusUpdate={handleStatusUpdate} onViewDetails={handleViewDetails} onRefresh={handleRefresh} isLoading={isLoading} isRefreshing={isRefreshing}/>
    </div>);
}
