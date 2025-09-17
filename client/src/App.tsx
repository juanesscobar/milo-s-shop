import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Main App Components
import Home from "@/components/Home";
import ClienteApp from "@/components/ClienteApp";
import AdminApp from "@/components/AdminApp";
import TestServices from "@/pages/TestServices";

// Wrapper components for routing
function HomePage() {
  return <Home language="es" />;
}

function ClientePage() {
  return <ClienteApp language="es" />;
}

function AdminPage() {
  return <AdminApp language="es" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/cliente" component={ClientePage} />
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