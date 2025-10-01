import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
export function useWebSocket() {
    var socketRef = useRef(null);
    var toast = useToast().toast;
    var _a = useState(false), isConnected = _a[0], setIsConnected = _a[1];
    useEffect(function () {
        // Initialize socket connection
        var socket = io({
            autoConnect: false
        });
        socketRef.current = socket;
        // Handle connection events
        socket.on('connect', function () {
            console.log('WebSocket connected:', socket.id);
            setIsConnected(true);
        });
        socket.on('disconnect', function () {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        });
        // Handle new booking notifications
        socket.on('new-booking', function (data) {
            console.log('New booking received:', data.booking);
            // Show notification toast
            toast({
                title: "🆕 Nueva Reserva",
                description: data.message || "Nueva reserva recibida a las ".concat(data.booking.timeSlot),
                duration: 8000,
            });
            // Optional: Play notification sound
            if (typeof Audio !== 'undefined') {
                try {
                    var audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYfCjiS2/PKeSQFLIHN8tiJOQcZaLvt559NEAxQp+PwtmMcBjiS2+/MeiQFLYDN8tiJOQgZaLvs55pOEAxQpOPxtmQcBjiS2/LNeSMFLYDN8tiJOQcZZ7vs55pNEAxQpOPxtmQcBjiS2/LNeSMFLYDN8tiJOQcZZ7vs55pOEAwP');
                    audio.volume = 0.1;
                    audio.play().catch(function () {
                        // Ignore audio errors (user interaction required)
                    });
                }
                catch (error) {
                    // Ignore audio errors
                }
            }
        });
        // Handle booking status updates
        socket.on('booking-updated', function (data) {
            console.log('Booking updated:', data.booking);
        });
        return function () {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [toast]);
    var joinAdminRoom = useCallback(function () {
        if (socketRef.current) {
            socketRef.current.connect();
            // Send admin token for authentication
            var adminToken = import.meta.env.VITE_ADMIN_WS_TOKEN || 'admin-secret-key';
            socketRef.current.emit('join-admin', adminToken);
            // Handle auth errors
            socketRef.current.on('auth-error', function (message) {
                console.error('Admin WebSocket auth error:', message);
                toast({
                    title: "⚠️ Error de Autenticación",
                    description: "No autorizado para recibir actualizaciones de admin",
                    variant: "destructive",
                });
            });
        }
    }, [toast]);
    var disconnect = useCallback(function () {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    }, []);
    return {
        socket: socketRef.current,
        joinAdminRoom: joinAdminRoom,
        disconnect: disconnect,
        isConnected: isConnected
    };
}
