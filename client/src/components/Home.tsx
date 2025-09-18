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
        
        {/* Telefone visível e seguro dentro do card */}
        <div className="contact-inline">
          📞 +595 981278517
        </div>
      </section>
    </main>
  );
}