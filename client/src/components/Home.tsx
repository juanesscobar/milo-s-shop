import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck } from "lucide-react";
import logoImage from "@assets/EC79CEF7-2BBB-454F-B38A-FC51A39A2769_1758151290656.png";

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
            src={logoImage} 
            alt="Milos'Shop" 
            className="h-32 w-32 mx-auto rounded-full object-cover"
            data-testid="img-logo"
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