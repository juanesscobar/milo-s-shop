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

  const handleNavigation = (path: string, action: 'login' | 'register' = 'login') => {
    if (path === '/cliente') {
      navigate(`/cliente/${action}`);
    } else if (path === '/admin') {
      navigate(`/admin/${action}`);
    } else {
      navigate(path);
    }
    console.log(`Navigating to: ${path}/${action}`);
  };

  return (
    <main className="home">
      <div className="brand">
        <div className="logo-ring">
          <LogoSilhouette />
        </div>
        <h1 className="title">{t.title}</h1>
        <p className="welcome">
          {t.welcome.split(' 🚗💨')[0]} <span className="emoji">🚗💨</span>
        </p>
      </div>
      
      <section className="panel">
        <div className="user-type-card">
          <button
            className="btn-card"
            onClick={() => handleNavigation('/cliente', 'login')}
            aria-label={t.clienteDesc}
            data-testid="button-cliente-login"
          >
            <div className="btn-title">{t.cliente}</div>
            <div className="btn-sub">{t.clienteDesc}</div>
          </button>
          <button
            className="btn-secondary"
            onClick={() => handleNavigation('/cliente', 'register')}
            aria-label="Registrarse como cliente"
          >
            Nuevo cliente
          </button>
        </div>

        <div className="user-type-card">
          <button
            className="btn-card"
            onClick={() => handleNavigation('/admin', 'login')}
            aria-label={t.adminDesc}
            data-testid="button-admin-login"
          >
            <div className="btn-title">{t.admin}</div>
            <div className="btn-sub">{t.adminDesc}</div>
          </button>
          <button
            className="btn-secondary"
            onClick={() => handleNavigation('/admin', 'register')}
            aria-label="Registrarse como administrador"
          >
            Nuevo administrador
          </button>
        </div>
      </section>
      
      <footer className="contact">
        <a href="tel:+595981278517">{t.contact}</a>
      </footer>
    </main>
  );
}