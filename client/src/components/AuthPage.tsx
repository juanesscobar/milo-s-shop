import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  language?: 'es' | 'pt';
  userType: 'client' | 'admin';
}

export default function AuthPage({ language = 'es', userType }: AuthPageProps) {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    location.includes('/register') ? 'register' : 'login'
  );
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    companyName: userType === 'admin' ? 'Mi Empresa' : '',
    phone: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const content: Record<string, any> = {
    es: {
      title: userType === 'admin' ? 'Panel de Administración' : 'Panel de Cliente',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      name: 'Nombre completo',
      companyName: 'Nombre de la empresa',
      phone: 'Teléfono',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Registrarse',
      backToHome: 'Volver al inicio',
      loginSuccess: 'Inicio de sesión exitoso',
      registerSuccess: 'Registro exitoso',
      loginError: 'Error al iniciar sesión',
      registerError: 'Error al registrarse',
      requiredField: 'Este campo es obligatorio',
      invalidEmail: 'Correo electrónico inválido',
      passwordMin: 'La contraseña debe tener al menos 6 caracteres'
    }
  };

  const t = content[language];

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Login failed');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: '✅ ' + t.loginSuccess,
        description: 'Bienvenido de vuelta',
      });
      navigate(userType === 'admin' ? '/admin' : '/cliente');
    },
    onError: (error: any) => {
      toast({
        title: '❌ ' + t.loginError,
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: typeof registerData) => {
      const endpoint = userType === 'admin' ? '/api/auth/register/admin' : '/api/auth/register/client';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: '✅ ' + t.registerSuccess,
        description: 'Tu cuenta ha sido creada exitosamente',
      });
      setActiveTab('login');
    },
    onError: (error: any) => {
      toast({
        title: '❌ ' + t.registerError,
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: '❌ Datos incompletos',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.passwordConfirm) {
      toast({
        title: '❌ Datos incompletos',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }
    if (registerData.password.length < 6) {
      toast({
        title: '❌ Contraseña muy corta',
        description: t.passwordMin,
        variant: 'destructive',
      });
      return;
    }
    if (registerData.password !== registerData.passwordConfirm) {
      toast({
        title: '❌ Contraseñas no coinciden',
        description: 'La contraseña y su confirmación deben ser iguales',
        variant: 'destructive',
      });
      return;
    }
    registerMutation.mutate(registerData);
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Button>
        </div>

        <Card className="auth-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">{t.title}</CardTitle>
            <CardDescription className="text-gray-600">
              {userType === 'admin'
                ? 'Accede al panel de administración'
                : 'Accede a tu panel de cliente'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => {
              const newTab = value as 'login' | 'register';
              setActiveTab(newTab);
              const basePath = userType === 'admin' ? '/admin' : '/cliente';
              navigate(`${basePath}/${newTab}`);
            }} className="auth-tabs">
              <TabsList className="grid w-full grid-cols-2 tabs-list">
                <TabsTrigger value="login" className="tabs-trigger">{t.login}</TabsTrigger>
                <TabsTrigger value="register" className="tabs-trigger">{t.register}</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="auth-form space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t.email}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t.password}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t.loginButton}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="auth-form space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t.name}</Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  {userType === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="register-company">{t.companyName}</Label>
                      <Input
                        id="register-company"
                        type="text"
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Nombre de tu empresa"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">{t.phone}</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+595 9XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t.email}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t.password}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password-confirm">Confirmar {t.password.toLowerCase()}</Label>
                    <Input
                      id="register-password-confirm"
                      type="password"
                      value={registerData.passwordConfirm}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t.registerButton}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}