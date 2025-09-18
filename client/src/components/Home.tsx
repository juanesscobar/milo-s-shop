import { useLocation } from "wouter";
import "../styles/home.css";
import LogoSilhouette from "./LogoSilhouette";

interface HomeProps {
  language?: 'es' | 'pt';
}

export default function Home({ language = 'es' }: HomeProps) {
  const [, navigate] = useLocation();

  const content = {
    es: {
      title: "Milos'Shop",
      subtitle: "Seleccione cómo desea acceder",
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
    <main className="home">
      <div className="brand">
        <div className="logo-ring">
          <LogoSilhouette />
        </div>
        <h1 className="title">{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>
      
      <section className="panel">
        <button 
          className="btn-card primary" 
          onClick={() => handleNavigation('/cliente')}
          aria-label={t.clienteDesc}
          data-testid="button-cliente"
        >
          <div className="btn-title">{t.cliente}</div>
          <div className="btn-sub">{t.clienteDesc}</div>
        </button>
        
        <button 
          className="btn-card secondary" 
          onClick={() => handleNavigation('/admin')}
          aria-label={t.adminDesc}
          data-testid="button-admin"
        >
          <div className="btn-title">{t.admin}</div>
          <div className="btn-sub">{t.adminDesc}</div>
        </button>
      </section>
      
      <p className="footer-hint">Home — fondo negro, tarjetas con acento rojo, tipografía Inter/Montserrat</p>
    </main>
  );
}