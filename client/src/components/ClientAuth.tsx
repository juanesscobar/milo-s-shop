import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Phone, Mail, LogIn, UserPlus } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface ClientAuthProps {
  onAuthSuccess: (user: UserType) => void;
  currentLanguage: "es" | "pt";
}

export default function ClientAuth({ onAuthSuccess, currentLanguage }: ClientAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const content = {
    es: {
      title: "Acceso de Cliente",
      subtitle: "Inicia sesión o regístrate para gestionar tus reservas",
      login: "Iniciar Sesión",
      register: "Registrarse",
      name: "Nombre completo",
      phone: "Teléfono (WhatsApp)",
      email: "Email (opcional)",
      password: "Contraseña",
      loginWithPhone: "Ingresar con teléfono",
      loginWithEmail: "Ingresar con email",
      createAccount: "Crear cuenta",
      haveAccount: "¿Ya tienes cuenta? Inicia sesión",
      noAccount: "¿No tienes cuenta? Regístrate",
      loginSuccess: "¡Bienvenido!",
      registerSuccess: "¡Cuenta creada exitosamente!",
      loginButton: "Entrar",
      registerButton: "Crear cuenta",
      phoneRequired: "Ingresa tu teléfono",
      nameRequired: "Ingresa tu nombre",
      passwordRequired: "Ingresa tu contraseña",
      phoneFormat: "Formato: +595981234567",
      passwordFormat: "Mínimo 8 caracteres, 1 número y 1 carácter especial"
    },
    pt: {
      title: "Acesso do Cliente",
      subtitle: "Faça login ou registre-se para gerenciar suas reservas",
      login: "Fazer Login",
      register: "Registrar-se",
      name: "Nome completo",
      phone: "Telefone (WhatsApp)",
      email: "Email (opcional)",
      password: "Senha",
      loginWithPhone: "Entrar com telefone",
      loginWithEmail: "Entrar com email",
      createAccount: "Criar conta",
      haveAccount: "Já tem conta? Faça login",
      noAccount: "Não tem conta? Registre-se",
      loginSuccess: "Bem-vindo!",
      registerSuccess: "Conta criada com sucesso!",
      loginButton: "Entrar",
      registerButton: "Criar conta",
      phoneRequired: "Digite seu telefone",
      nameRequired: "Digite seu nome",
      passwordRequired: "Digite sua senha",
      phoneFormat: "Formato: +595981234567",
      passwordFormat: "Mínimo 8 caracteres, 1 número e 1 caractere especial"
    }
  };

  const t = content[currentLanguage];

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error en el login");
        }
        return await res.json();
      } catch (err) {
        console.error("Login error:", err);
        throw err;
      }
    },
    onSuccess: (response) => {
      console.log('🔐 ClientAuth: Login exitoso, respuesta:', response);
      console.log('🔐 ClientAuth: Usuario:', response.user);
      toast({
        title: "✅ " + t.loginSuccess,
        description: `Hola ${response.user.name}`,
      });
      console.log('🔐 ClientAuth: Invalidando queries...');
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      console.log('🔐 ClientAuth: Llamando onAuthSuccess...');
      onAuthSuccess(response.user);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; email?: string; password: string }) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/register/client", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error en el registro");
        }
        return await res.json();
      } catch (err) {
        console.error("Register error:", err);
        throw err;
      }
    },
    onSuccess: (response) => {
      console.log('🔐 ClientAuth: Registro exitoso, respuesta:', response);
      console.log('🔐 ClientAuth: Usuario:', response.user);
      toast({
        title: "✅ " + t.registerSuccess,
        description: `Bienvenido ${response.user.name}`,
      });
      console.log('🔐 ClientAuth: Invalidando queries...');
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      console.log('🔐 ClientAuth: Llamando onAuthSuccess...');
      onAuthSuccess(response.user);
      // Force page reload to ensure authentication state is updated
      console.log('🔐 ClientAuth: Recargando página...');
      window.location.reload();
      // Force page reload to ensure authentication state is updated
      console.log('🔐 ClientAuth: Recargando página...');
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error",
        description: error.message || "Error al crear cuenta",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast({
        title: "❌ Error",
        description: !email ? "Email es requerido" : t.passwordRequired,
        variant: "destructive",
      });
      return;
    }

    console.log('🔐 ClientAuth: Intentando login con:', { email });

    setIsLoading(true);
    loginMutation.mutate({ email, password });
    setIsLoading(false);
  };

  const handleRegister = (formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !phone || !password) {
      toast({
        title: "❌ Error",
        description: !name ? t.nameRequired : !phone ? t.phoneRequired : t.passwordRequired,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    registerMutation.mutate({
      name,
      phone,
      email: email || undefined,
      password
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">
                <LogIn className="w-4 h-4 mr-2" />
                {t.login}
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">
                <UserPlus className="w-4 h-4 mr-2" />
                {t.register}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    className="w-full bg-white text-black"
                    data-testid="input-login-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    {t.password} *
                  </Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-white text-black"
                    data-testid="input-login-password"
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial</p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || loginMutation.isPending}
                  data-testid="button-login"
                >
                  {isLoading || loginMutation.isPending ? "..." : t.loginButton}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t.name} *
                  </Label>
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    required
                    className="w-full bg-white text-black"
                    data-testid="input-register-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {t.phone} *
                  </Label>
                  <Input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    placeholder="+595981234567"
                    required
                    className="w-full bg-white text-black"
                    data-testid="input-register-phone"
                  />
                  <p className="text-xs text-muted-foreground">{t.phoneFormat}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t.email}
                  </Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full bg-white text-black"
                    data-testid="input-register-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    {t.password} *
                  </Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-white text-black"
                    data-testid="input-register-password"
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial</p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || registerMutation.isPending}
                  data-testid="button-register"
                >
                  {isLoading || registerMutation.isPending ? "..." : t.registerButton}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}