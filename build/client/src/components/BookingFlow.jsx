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
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Car, CreditCard, User, ArrowLeft, Upload, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
export default function BookingFlow(_a) {
    var _this = this;
    var _b;
    var service = _a.service, selectedVehicleType = _a.selectedVehicleType, onBack = _a.onBack, language = _a.language, authenticatedUser = _a.authenticatedUser;
    var _c = useState(authenticatedUser ? 'vehicle' : 'user'), step = _c[0], setStep = _c[1];
    var _d = useState((authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.id) || ''), userId = _d[0], setUserId = _d[1];
    var _e = useState(''), vehicleId = _e[0], setVehicleId = _e[1];
    var _f = useState({
        date: '',
        timeSlot: '',
        notes: ''
    }), bookingData = _f[0], setBookingData = _f[1];
    var _g = useState({
        paymentMethod: 'cash',
        paymentCaptureUrl: ''
    }), paymentData = _g[0], setPaymentData = _g[1];
    var _h = useState(null), paymentCaptureFile = _h[0], setPaymentCaptureFile = _h[1];
    var _j = useState(''), paymentCapturePreview = _j[0], setPaymentCapturePreview = _j[1];
    var _k = useState({
        name: (authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.name) || '',
        phone: (authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.phone) || '',
        email: (authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.email) || '',
        language: language
    }), userForm = _k[0], setUserForm = _k[1];
    var _l = useState({
        plate: '',
        type: selectedVehicleType
    }), vehicleForm = _l[0], setVehicleForm = _l[1];
    var toast = useToast().toast;
    var content = {
        es: {
            title: "Reservar Servicio",
            userInfo: "Información Personal",
            vehicleInfo: "Información del Vehículo",
            bookingDetails: "Detalles de la Reserva",
            payment: "Pago",
            paymentMethod: "Método de pago",
            cash: "Efectivo",
            transfer: "Transferencia",
            pix: "PIX",
            paymentCapture: "Captura de pago (opcional)",
            uploadCapture: "Subir captura",
            name: "Nombre completo",
            phone: "Teléfono",
            email: "Email (opcional)",
            plate: "Placa del vehículo",
            vehicleType: "Tipo de vehículo",
            date: "Fecha",
            time: "Hora",
            notes: "Notas adicionales (opcional)",
            total: "Total",
            back: "Volver",
            continue: "Continuar",
            confirm: "Confirmar Reserva",
            auto: "Auto",
            suv: "SUV",
            camioneta: "Camioneta",
            bookingSuccess: "¡Reserva creada exitosamente!",
            bookingError: "Error al crear la reserva"
        },
        pt: {
            title: "Reservar Serviço",
            userInfo: "Informações Pessoais",
            vehicleInfo: "Informações do Veículo",
            bookingDetails: "Detalhes da Reserva",
            payment: "Pagamento",
            paymentMethod: "Método de pagamento",
            cash: "Dinheiro",
            transfer: "Transferência",
            pix: "PIX",
            paymentCapture: "Captura de pagamento (opcional)",
            uploadCapture: "Enviar captura",
            name: "Nome completo",
            phone: "Telefone",
            email: "Email (opcional)",
            plate: "Placa do veículo",
            vehicleType: "Tipo de veículo",
            date: "Data",
            time: "Hora",
            notes: "Notas adicionais (opcional)",
            total: "Total",
            back: "Voltar",
            continue: "Continuar",
            confirm: "Confirmar Reserva",
            auto: "Auto",
            suv: "SUV",
            camioneta: "Caminhonete",
            bookingSuccess: "Reserva criada com sucesso!",
            bookingError: "Erro ao criar reserva"
        }
    };
    var t = content[language];
    var servicePrice = ((_b = service.prices) === null || _b === void 0 ? void 0 : _b[selectedVehicleType]) || 0;
    var formatPrice = function (price) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(price);
    };
    // Create or get user
    var createUserMutation = useMutation({
        mutationFn: function (userData) { return __awaiter(_this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(userData)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw { status: response.status, message: error.error };
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function (user) {
            setUserId(user.id);
            setStep('vehicle');
        },
        onError: function (error) {
            if (error.status === 409) {
                // User exists, could implement login flow here
                toast({
                    title: t.bookingError,
                    description: "Usuario ya existe. Funcionalidad de login próximamente.",
                    variant: "destructive",
                });
            }
            else {
                toast({
                    title: t.bookingError,
                    description: error.message || "Error desconocido",
                    variant: "destructive",
                });
            }
        }
    });
    // Create vehicle
    var createVehicleMutation = useMutation({
        mutationFn: function (vehicleData) { return __awaiter(_this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/vehicles', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(vehicleData)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw { status: response.status, message: error.error };
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function (vehicle) {
            setVehicleId(vehicle.id);
            setStep('booking');
        },
        onError: function (error) {
            toast({
                title: t.bookingError,
                description: error.message || "Error al registrar vehículo",
                variant: "destructive",
            });
        }
    });
    // Create booking
    var createBookingMutation = useMutation({
        mutationFn: function (booking) { return __awaiter(_this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/bookings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(booking)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw { status: response.status, message: error.error };
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: t.bookingSuccess,
                description: "Reserva para ".concat(service.title, " confirmada"),
            });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            onBack(); // Return to services list
        },
        onError: function (error) {
            toast({
                title: t.bookingError,
                description: error.message || "Error al crear reserva",
                variant: "destructive",
            });
        }
    });
    var handleUserSubmit = function () {
        if (authenticatedUser) {
            // Skip user creation if already authenticated
            setUserId(authenticatedUser.id);
            setStep('vehicle');
            return;
        }
        if (!userForm.name || !userForm.phone) {
            toast({
                title: "Error",
                description: "Nombre y teléfono son requeridos",
                variant: "destructive",
            });
            return;
        }
        createUserMutation.mutate({
            name: userForm.name,
            phone: userForm.phone,
            email: userForm.email || undefined,
            language: language,
            role: 'client'
        });
    };
    var handleVehicleSubmit = function () {
        if (!vehicleForm.plate) {
            toast({
                title: "Error",
                description: "Placa del vehículo es requerida",
                variant: "destructive",
            });
            return;
        }
        createVehicleMutation.mutate({
            userId: userId,
            plate: vehicleForm.plate,
            type: vehicleForm.type
        });
    };
    var handleBookingSubmit = function () {
        if (!bookingData.date || !bookingData.timeSlot) {
            toast({
                title: "Error",
                description: "Fecha y hora son requeridas",
                variant: "destructive",
            });
            return;
        }
        setStep('payment');
    };
    var handlePaymentCaptureUpload = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, result_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    formData = new FormData();
                    formData.append('image', file);
                    formData.append('serviceSlug', 'payment-capture');
                    return [4 /*yield*/, fetch('/api/services/upload-image', {
                            method: 'POST',
                            body: formData,
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    result_1 = _a.sent();
                    setPaymentData(function (prev) { return (__assign(__assign({}, prev), { paymentCaptureUrl: result_1.imageUrl })); });
                    setPaymentCapturePreview(result_1.imageUrl);
                    toast({
                        title: "Éxito",
                        description: "Captura de pago subida correctamente",
                    });
                    return [3 /*break*/, 4];
                case 3: throw new Error('Error al subir la captura');
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error uploading payment capture:', error_1);
                    toast({
                        title: "Error",
                        description: "Error al subir la captura de pago",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handlePaymentCaptureChange = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setPaymentCaptureFile(file);
            // Create preview
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                setPaymentCapturePreview((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
            };
            reader.readAsDataURL(file);
        }
    };
    var handlePaymentSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(paymentCaptureFile && !paymentData.paymentCaptureUrl)) return [3 /*break*/, 2];
                    return [4 /*yield*/, handlePaymentCaptureUpload(paymentCaptureFile)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    console.log('🔍 DEBUG: BookingFlow handlePaymentSubmit - userId:', userId, 'vehicleId:', vehicleId, 'serviceId:', service.id);
                    createBookingMutation.mutate({
                        userId: userId,
                        vehicleId: vehicleId,
                        serviceId: service.id,
                        date: bookingData.date,
                        timeSlot: bookingData.timeSlot,
                        price: servicePrice,
                        paymentMethod: paymentData.paymentMethod,
                        paymentCaptureUrl: paymentData.paymentCaptureUrl || undefined,
                        notes: bookingData.notes || undefined
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var generateTimeSlots = function () {
        var slots = [];
        for (var hour = 8; hour <= 18; hour++) {
            slots.push("".concat(hour.toString().padStart(2, '0'), ":00"));
            if (hour < 18) {
                slots.push("".concat(hour.toString().padStart(2, '0'), ":30"));
            }
        }
        return slots;
    };
    return (<div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="h-4 w-4"/>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{service.title}</p>
        </div>
      </div>

      {/* Service Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-sm text-muted-foreground capitalize">{selectedVehicleType}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{formatPrice(servicePrice)}</div>
              {service.durationMin && (<div className="text-sm text-muted-foreground">{service.durationMin} min</div>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === 'user' && (<Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5"/>
              {t.userInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t.name}</Label>
              <Input id="name" value={userForm.name} onChange={function (e) { return setUserForm(__assign(__assign({}, userForm), { name: e.target.value })); }} data-testid="input-name" className="bg-white text-black"/>
            </div>
            <div>
              <Label htmlFor="phone">{t.phone}</Label>
              <Input id="phone" value={userForm.phone} onChange={function (e) { return setUserForm(__assign(__assign({}, userForm), { phone: e.target.value })); }} data-testid="input-phone" className="bg-white text-black"/>
            </div>
            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" type="email" value={userForm.email} onChange={function (e) { return setUserForm(__assign(__assign({}, userForm), { email: e.target.value })); }} data-testid="input-email" className="bg-white text-black"/>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUserSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mx-auto" disabled={createUserMutation.isPending} data-testid="button-continue-user">
              {createUserMutation.isPending ? "..." : t.continue}
            </Button>
          </CardFooter>
        </Card>)}

      {step === 'vehicle' && (<Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5"/>
              {t.vehicleInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plate">{t.plate}</Label>
              <Input id="plate" value={vehicleForm.plate} onChange={function (e) { return setVehicleForm(__assign(__assign({}, vehicleForm), { plate: e.target.value.toUpperCase() })); }} placeholder="ABC-123" data-testid="input-plate" className="bg-white text-black"/>
            </div>
            <div>
              <Label htmlFor="vehicleType">{t.vehicleType}</Label>
              <Select value={vehicleForm.type} onValueChange={function (value) { return setVehicleForm(__assign(__assign({}, vehicleForm), { type: value })); }}>
                <SelectTrigger className="bg-white text-gray-900" data-testid="select-vehicle-type-booking">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t.auto}</SelectItem>
                  <SelectItem value="suv">{t.suv}</SelectItem>
                  <SelectItem value="camioneta">{t.camioneta}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={function () { return setStep('user'); }} data-testid="button-back-vehicle">
              {t.back}
            </Button>
            <Button onClick={handleVehicleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2" disabled={createVehicleMutation.isPending} data-testid="button-continue-vehicle">
              {createVehicleMutation.isPending ? "..." : t.continue}
            </Button>
          </CardFooter>
        </Card>)}

      {step === 'booking' && (<Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5"/>
              {t.bookingDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">{t.date}</Label>
              <Input id="date" type="date" value={bookingData.date} onChange={function (e) { return setBookingData(__assign(__assign({}, bookingData), { date: e.target.value })); }} min={new Date().toISOString().split('T')[0]} data-testid="input-date" className="bg-white text-black"/>
            </div>
            <div>
              <Label htmlFor="timeSlot">{t.time}</Label>
              <Select value={bookingData.timeSlot} onValueChange={function (value) { return setBookingData(__assign(__assign({}, bookingData), { timeSlot: value })); }}>
                <SelectTrigger className="bg-white text-gray-900" data-testid="select-time-slot">
                  <SelectValue placeholder="Selecciona una hora"/>
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map(function (slot) { return (<SelectItem key={slot} value={slot}>{slot}</SelectItem>); })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea id="notes" value={bookingData.notes} onChange={function (e) { return setBookingData(__assign(__assign({}, bookingData), { notes: e.target.value })); }} placeholder="Instrucciones especiales..." data-testid="textarea-notes" className="bg-white text-black"/>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t.total}:</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(servicePrice)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={function () { return setStep('vehicle'); }} data-testid="button-back-booking">
              {t.back}
            </Button>
            <Button onClick={handleBookingSubmit} size="sm" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2" disabled={createBookingMutation.isPending} data-testid="button-confirm-booking">
              {createBookingMutation.isPending ? "..." : t.confirm}
            </Button>
          </CardFooter>
        </Card>)}

      {step === 'payment' && (<Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5"/>
              {t.payment}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">{t.paymentMethod}</Label>
              <Select value={paymentData.paymentMethod} onValueChange={function (value) {
                return setPaymentData(function (prev) { return (__assign(__assign({}, prev), { paymentMethod: value })); });
            }}>
                <SelectTrigger className="bg-white text-gray-900" data-testid="select-payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t.cash}</SelectItem>
                  <SelectItem value="transfer">{t.transfer}</SelectItem>
                  <SelectItem value="pix">{t.pix}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t.paymentCapture}</Label>
              <div className="mt-2">
                {paymentCapturePreview ? (<div className="relative inline-block">
                    <img src={paymentCapturePreview} alt="Captura de pago" className="max-w-48 max-h-32 object-contain border rounded"/>
                    <Button variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 p-0" onClick={function () {
                    setPaymentCapturePreview('');
                    setPaymentCaptureFile(null);
                    setPaymentData(function (prev) { return (__assign(__assign({}, prev), { paymentCaptureUrl: '' })); });
                }}>
                      <X className="h-3 w-3"/>
                    </Button>
                  </div>) : (<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input type="file" accept="image/*" onChange={handlePaymentCaptureChange} className="hidden" id="payment-capture"/>
                    <label htmlFor="payment-capture" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2"/>
                      <p className="text-sm text-gray-600">{t.uploadCapture}</p>
                    </label>
                  </div>)}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t.total}:</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(servicePrice)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={function () { return setStep('booking'); }} data-testid="button-back-payment">
              {t.back}
            </Button>
            <Button onClick={handlePaymentSubmit} size="sm" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2" disabled={createBookingMutation.isPending} data-testid="button-confirm-payment">
              {createBookingMutation.isPending ? "..." : t.confirm}
            </Button>
          </CardFooter>
        </Card>)}
    </div>);
}
