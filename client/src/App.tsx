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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cliente" component={ClienteApp} />
      <Route path="/admin" component={AdminApp} />
      <Route component={Home} /> {/* Fallback to home */}
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