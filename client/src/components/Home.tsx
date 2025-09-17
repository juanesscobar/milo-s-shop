import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck } from "lucide-react";

interface HomeProps {
  language?: 'es' | 'pt';
}

export default function Home({ language = 'es' }: HomeProps) {
  const [, navigate] = useLocation();

  const content = {
    es: {
      title: "Milos'Shop",
      subtitle: "Seleccione como desea acceder",
      cliente: "Cliente",
      admin: "Administrador",
      clienteDesc: "Acceso para clientes",
      adminDesc: "Panel de administración"
    },
    pt: {
      title: "Milos'Shop", 
      subtitle: "Selecione como deseja acessar",
      cliente: "Cliente",
      admin: "Administrador", 
      clienteDesc: "Acesso para clientes",
      adminDesc: "Painel de administração"
    }
  };

  const t = content[language];

  const handleNavigation = (path: string) => {
    navigate(path);
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <img 
            src="/milos-logo.png" 
            alt="Milos'Shop" 
            className="h-24 w-24 mx-auto"
            onError={(e) => {
              // Replace with placeholder if logo not found  
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='none' stroke='%23E10600' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z'/%3E%3Cpath d='m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9'/%3E%3Cpath d='M12 3v6'/%3E%3C/svg%3E";
            }}
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t.title}
            </h1>
            <p className="text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Access Options */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={() => handleNavigation('/cliente')}
              data-testid="button-cliente"
            >
              <User className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">{t.cliente}</div>
                <div className="text-xs opacity-90">{t.clienteDesc}</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg"
              onClick={() => handleNavigation('/admin')}
              data-testid="button-admin"
            >
              <ShieldCheck className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">{t.admin}</div>
                <div className="text-xs opacity-90">{t.adminDesc}</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}