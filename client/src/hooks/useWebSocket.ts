import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BookingNotification {
  booking: any;
  message?: string;
}

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      autoConnect: false
    });
    
    socketRef.current = socket;

    // Handle connection events
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    // Handle new booking notifications
    socket.on('new-booking', (data: BookingNotification) => {
      console.log('New booking received:', data.booking);

      // Show notification toast
      toast({
        title: "🆕 Nueva Reserva",
        description: data.message || `Nueva reserva recibida a las ${data.booking.timeSlot}`,
        duration: 8000,
      });

      // Optional: Play notification sound
      if (typeof Audio !== 'undefined') {
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYfCjiS2/PKeSQFLIHN8tiJOQcZaLvt559NEAxQp+PwtmMcBjiS2+/MeiQFLYDN8tiJOQgZaLvs55pOEAxQpOPxtmQcBjiS2/LNeSMFLYDN8tiJOQcZZ7vs55pNEAxQpOPxtmQcBjiS2/LNeSMFLYDN8tiJOQcZZ7vs55pOEAwP');
          audio.volume = 0.1;
          audio.play().catch(() => {
            // Ignore audio errors (user interaction required)
          });
        } catch (error) {
          // Ignore audio errors
        }
      }
    });

    // Handle booking status updates
    socket.on('booking-updated', (data: BookingNotification) => {
      console.log('Booking updated:', data.booking);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [toast]);

  const joinAdminRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
      // Send admin token for authentication
      const adminToken = import.meta.env.VITE_ADMIN_WS_TOKEN || 'admin-secret-key';
      socketRef.current.emit('join-admin', adminToken);

      // Handle auth errors
      socketRef.current.on('auth-error', (message) => {
        console.error('Admin WebSocket auth error:', message);
        toast({
          title: "⚠️ Error de Autenticación",
          description: "No autorizado para recibir actualizaciones de admin",
          variant: "destructive",
        });
      });
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    joinAdminRoom,
    disconnect,
    isConnected
  };
}