import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Car, CreditCard, Phone, User, ArrowLeft, Upload, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Service, Vehicle, InsertBooking, InsertUser, InsertVehicle } from "@shared/schema";

interface BookingFlowProps {
  service: Service;
  selectedVehicleType: 'auto' | 'suv' | 'camioneta';
  onBack: () => void;
  language: 'es' | 'pt';
  authenticatedUser?: any;
}

export default function BookingFlow({ service, selectedVehicleType, onBack, language, authenticatedUser }: BookingFlowProps) {
  const [step, setStep] = useState<'user' | 'vehicle' | 'booking' | 'payment'>(authenticatedUser ? 'vehicle' : 'user');
  const [userId, setUserId] = useState<string>(authenticatedUser?.id || '');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    notes: ''
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'cash' as 'cash' | 'transfer' | 'pix',
    paymentCaptureUrl: ''
  });
  const [paymentCaptureFile, setPaymentCaptureFile] = useState<File | null>(null);
  const [paymentCapturePreview, setPaymentCapturePreview] = useState<string>('');
  const [userForm, setUserForm] = useState({
    name: authenticatedUser?.name || '',
    phone: authenticatedUser?.phone || '',
    email: authenticatedUser?.email || '',
    language: language
  });
  const [vehicleForm, setVehicleForm] = useState({
    plate: '',
    type: selectedVehicleType
  });
  
  const { toast } = useToast();

  const content = {
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

  const t = content[language];
  const servicePrice = service.prices?.[selectedVehicleType] || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Create or get user
  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, message: error.error };
      }
      return response.json();
    },
    onSuccess: (user) => {
      setUserId(user.id);
      setStep('vehicle');
    },
    onError: (error: any) => {
      if (error.status === 409) {
        // User exists, could implement login flow here
        toast({
          title: t.bookingError,
          description: "Usuario ya existe. Funcionalidad de login próximamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: t.bookingError,
          description: error.message || "Error desconocido",
          variant: "destructive",
        });
      }
    }
  });

  // Create vehicle
  const createVehicleMutation = useMutation({
    mutationFn: async (vehicleData: InsertVehicle) => {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, message: error.error };
      }
      return response.json();
    },
    onSuccess: (vehicle) => {
      setVehicleId(vehicle.id);
      setStep('booking');
    },
    onError: (error: any) => {
      toast({
        title: t.bookingError,
        description: error.message || "Error al registrar vehículo",
        variant: "destructive",
      });
    }
  });

  // Create booking
  const createBookingMutation = useMutation({
    mutationFn: async (booking: InsertBooking) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, message: error.error };
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.bookingSuccess,
        description: `Reserva para ${service.title} confirmada`,
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onBack(); // Return to services list
    },
    onError: (error: any) => {
      toast({
        title: t.bookingError,
        description: error.message || "Error al crear reserva",
        variant: "destructive",
      });
    }
  });

  const handleUserSubmit = () => {
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

  const handleVehicleSubmit = () => {
    if (!vehicleForm.plate) {
      toast({
        title: "Error", 
        description: "Placa del vehículo es requerida",
        variant: "destructive",
      });
      return;
    }

    createVehicleMutation.mutate({
      userId,
      plate: vehicleForm.plate,
      type: vehicleForm.type as 'auto' | 'suv' | 'camioneta'
    });
  };

  const handleBookingSubmit = () => {
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

  const handlePaymentCaptureUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('serviceSlug', 'payment-capture');

      const response = await fetch('/api/services/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPaymentData(prev => ({ ...prev, paymentCaptureUrl: result.imageUrl }));
        setPaymentCapturePreview(result.imageUrl);
        toast({
          title: "Éxito",
          description: "Captura de pago subida correctamente",
        });
      } else {
        throw new Error('Error al subir la captura');
      }
    } catch (error) {
      console.error('Error uploading payment capture:', error);
      toast({
        title: "Error",
        description: "Error al subir la captura de pago",
        variant: "destructive",
      });
    }
  };

  const handlePaymentCaptureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentCaptureFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentCapturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async () => {
    // Upload payment capture if exists
    if (paymentCaptureFile && !paymentData.paymentCaptureUrl) {
      await handlePaymentCaptureUpload(paymentCaptureFile);
    }

    console.log('🔍 DEBUG: BookingFlow handlePaymentSubmit - userId:', userId, 'vehicleId:', vehicleId, 'serviceId:', service.id);

    createBookingMutation.mutate({
      userId,
      vehicleId,
      serviceId: service.id,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      price: servicePrice,
      paymentMethod: paymentData.paymentMethod,
      paymentCaptureUrl: paymentData.paymentCaptureUrl || undefined,
      notes: bookingData.notes || undefined
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="h-4 w-4" />
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
              {service.durationMin && (
                <div className="text-sm text-muted-foreground">{service.durationMin} min</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t.userInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={userForm.name}
                onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                data-testid="input-name"
                className="bg-white text-black"
              />
            </div>
            <div>
              <Label htmlFor="phone">{t.phone}</Label>
              <Input
                id="phone"
                value={userForm.phone}
                onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                data-testid="input-phone"
                className="bg-white text-black"
              />
            </div>
            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                data-testid="input-email"
                className="bg-white text-black"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUserSubmit} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mx-auto"
              disabled={createUserMutation.isPending}
              data-testid="button-continue-user"
            >
              {createUserMutation.isPending ? "..." : t.continue}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'vehicle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {t.vehicleInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plate">{t.plate}</Label>
              <Input
                id="plate"
                value={vehicleForm.plate}
                onChange={(e) => setVehicleForm({...vehicleForm, plate: e.target.value.toUpperCase()})}
                placeholder="ABC-123"
                data-testid="input-plate"
                className="bg-white text-black"
              />
            </div>
            <div>
              <Label htmlFor="vehicleType">{t.vehicleType}</Label>
              <Select value={vehicleForm.type} onValueChange={(value: 'auto' | 'suv' | 'camioneta') => setVehicleForm({...vehicleForm, type: value})}>
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
            <Button variant="outline" onClick={() => setStep('user')} data-testid="button-back-vehicle">
              {t.back}
            </Button>
            <Button 
              onClick={handleVehicleSubmit} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              disabled={createVehicleMutation.isPending}
              data-testid="button-continue-vehicle"
            >
              {createVehicleMutation.isPending ? "..." : t.continue}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'booking' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t.bookingDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">{t.date}</Label>
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                data-testid="input-date"
                className="bg-white text-black"
              />
            </div>
            <div>
              <Label htmlFor="timeSlot">{t.time}</Label>
              <Select value={bookingData.timeSlot} onValueChange={(value) => setBookingData({...bookingData, timeSlot: value})}>
                <SelectTrigger className="bg-white text-gray-900" data-testid="select-time-slot">
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                value={bookingData.notes}
                onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                placeholder="Instrucciones especiales..."
                data-testid="textarea-notes"
                className="bg-white text-black"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t.total}:</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(servicePrice)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('vehicle')} data-testid="button-back-booking">
              {t.back}
            </Button>
            <Button 
              onClick={handleBookingSubmit} 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              disabled={createBookingMutation.isPending}
              data-testid="button-confirm-booking"
            >
              {createBookingMutation.isPending ? "..." : t.confirm}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'payment' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t.payment}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">{t.paymentMethod}</Label>
              <Select
                value={paymentData.paymentMethod}
                onValueChange={(value: 'cash' | 'transfer' | 'pix') =>
                  setPaymentData(prev => ({ ...prev, paymentMethod: value }))
                }
              >
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
                {paymentCapturePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={paymentCapturePreview}
                      alt="Captura de pago"
                      className="max-w-48 max-h-32 object-contain border rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => {
                        setPaymentCapturePreview('');
                        setPaymentCaptureFile(null);
                        setPaymentData(prev => ({ ...prev, paymentCaptureUrl: '' }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentCaptureChange}
                      className="hidden"
                      id="payment-capture"
                    />
                    <label htmlFor="payment-capture" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">{t.uploadCapture}</p>
                    </label>
                  </div>
                )}
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
            <Button variant="outline" onClick={() => setStep('booking')} data-testid="button-back-payment">
              {t.back}
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              disabled={createBookingMutation.isPending}
              data-testid="button-confirm-payment"
            >
              {createBookingMutation.isPending ? "..." : t.confirm}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}