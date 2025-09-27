import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Main App Components
import Home from "@/components/Home";
import ClienteApp from "@/components/ClienteApp";
import AdminApp from "@/components/AdminApp";
import AuthPage from "@/components/AuthPage";
import TestServices from "@/pages/TestServices";

// Protected Route Component
function ProtectedRoute({ component: Component, requireAdmin = false }: { component: React.ComponentType<any>, requireAdmin?: boolean }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para acceder a esta sección.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Acceso Restringido</h2>
          <p className="text-muted-foreground mb-6">
            Solo los administradores pueden acceder a esta sección.
          </p>
          <button
            onClick={() => window.location.href = '/cliente'}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Ir a Panel de Cliente
          </button>
        </div>
      </div>
    );
  }

  return <Component language="es" />;
}

// Wrapper components for routing
function HomePage() {
  return <Home language="es" />;
}

function ClientePage() {
  console.log('🔐 App: Renderizando ClientePage');
  return <ProtectedRoute component={ClienteApp} requireAdmin={false} />;
}

function AdminPage() {
  return <ProtectedRoute component={AdminApp} requireAdmin={true} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/cliente/login" component={() => <AuthPage userType="client" />} />
      <Route path="/cliente/register" component={() => <AuthPage userType="client" />} />
      <Route path="/cliente" component={ClientePage} />
      <Route path="/admin/login" component={() => <AuthPage userType="admin" />} />
      <Route path="/admin/register" component={() => <AuthPage userType="admin" />} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/test-services" component={TestServices} />
      <Route component={HomePage} /> {/* Fallback to home */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;