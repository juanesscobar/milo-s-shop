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
      welcome: "Bienvenido, tu auto merece lo mejor 🚗💨",
      cliente: "Cliente",
      admin: "Administrador",
      clienteDesc: "Acceso para clientes",
      adminDesc: "Panel de administración",
      contact: "📞 +595 981278517"
    },
    pt: {
      title: "Milos'Shop", 
      welcome: "Bem-vindo, seu carro merece o melhor 🚗💨",
      cliente: "Cliente",
      admin: "Administrador", 
      clienteDesc: "Acesso para clientes",
      adminDesc: "Painel de administração",
      contact: "📞 +595 981278517"
    }
  };

  const t = content[language];

  const handleNavigation = (path: string) => {
    navigate(path);
    console.log(`Navigating to: ${path}`);
  };

  return (
    <main className="home">
      <div className="panel">
        <div className="brand">
          <img src="/logo.png" alt="Milos'Shop Logo" />
          <h1>Milos'Shop</h1>
          <p className="welcome emoji">Bienvenido, tu auto merece lo mejor 🚗💨</p>
        </div>
        <button 
          className="btn-card primary" 
          onClick={() => handleNavigation('/cliente')}
          aria-label={t.clienteDesc}
          data-testid="button-cliente"
        >
          <h2>Cliente</h2>
          <p className="btn-sub">Acceso para clientes</p>
        </button>
        <button 
          className="btn-card" 
          onClick={() => handleNavigation('/admin')}
          aria-label={t.adminDesc}
          data-testid="button-admin"
        >
          <h2>Administrador</h2>
          <p className="btn-sub">Panel de administración</p>
        </button>
        <div className="contact-inline">
          <a href="tel:+595981278517">📞 +595 981278517</a>
        </div>
      </div>
    </main>
  );
}