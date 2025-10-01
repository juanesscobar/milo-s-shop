var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, LogIn, UserPlus } from "lucide-react";
export default function ClientAuth(_a) {
    var _this = this;
    var onAuthSuccess = _a.onAuthSuccess, currentLanguage = _a.currentLanguage;
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var content = {
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
    var t = content[currentLanguage];
    // Login mutation
    var loginMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var res, errorData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fetch("http://localhost:5000/api/auth/login", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data),
                                credentials: "include",
                            })];
                    case 1:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        errorData = _a.sent();
                        throw new Error(errorData.error || "Error en el login");
                    case 3: return [4 /*yield*/, res.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        err_1 = _a.sent();
                        console.error("Login error:", err_1);
                        throw err_1;
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function (response) {
            console.log('🔐 ClientAuth: Login exitoso, respuesta:', response);
            console.log('🔐 ClientAuth: Usuario:', response.user);
            toast({
                title: "✅ " + t.loginSuccess,
                description: "Hola ".concat(response.user.name),
            });
            console.log('🔐 ClientAuth: Invalidando queries...');
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
            console.log('🔐 ClientAuth: Llamando onAuthSuccess...');
            onAuthSuccess(response.user);
        },
        onError: function (error) {
            toast({
                title: "❌ Error",
                description: error.message || "Error al iniciar sesión",
                variant: "destructive",
            });
        },
    });
    // Register mutation
    var registerMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var res, errorData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fetch("http://localhost:5000/api/auth/register/client", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data),
                                credentials: "include",
                            })];
                    case 1:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        errorData = _a.sent();
                        throw new Error(errorData.error || "Error en el registro");
                    case 3: return [4 /*yield*/, res.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        err_2 = _a.sent();
                        console.error("Register error:", err_2);
                        throw err_2;
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function (response) {
            console.log('🔐 ClientAuth: Registro exitoso, respuesta:', response);
            console.log('🔐 ClientAuth: Usuario:', response.user);
            toast({
                title: "✅ " + t.registerSuccess,
                description: "Bienvenido ".concat(response.user.name),
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
        onError: function (error) {
            toast({
                title: "❌ Error",
                description: error.message || "Error al crear cuenta",
                variant: "destructive",
            });
        },
    });
    var handleLogin = function (formData) {
        var email = formData.get("email");
        var password = formData.get("password");
        if (!email || !password) {
            toast({
                title: "❌ Error",
                description: !email ? "Email es requerido" : t.passwordRequired,
                variant: "destructive",
            });
            return;
        }
        console.log('🔐 ClientAuth: Intentando login con:', { email: email });
        setIsLoading(true);
        loginMutation.mutate({ email: email, password: password });
        setIsLoading(false);
    };
    var handleRegister = function (formData) {
        var name = formData.get("name");
        var phone = formData.get("phone");
        var email = formData.get("email");
        var password = formData.get("password");
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
            name: name,
            phone: phone,
            email: email || undefined,
            password: password
        });
        setIsLoading(false);
    };
    return (<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground"/>
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">
                <LogIn className="w-4 h-4 mr-2"/>
                {t.login}
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">
                <UserPlus className="w-4 h-4 mr-2"/>
                {t.register}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={function (e) { e.preventDefault(); handleLogin(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4"/>
                    Email *
                  </Label>
                  <Input id="login-email" name="email" type="email" placeholder="tu@email.com" required className="w-full bg-white text-black" data-testid="input-login-email"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4"/>
                    {t.password} *
                  </Label>
                  <Input id="login-password" name="password" type="password" placeholder="••••••••" required className="w-full bg-white text-black" data-testid="input-login-password"/>
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || loginMutation.isPending} data-testid="button-login">
                  {isLoading || loginMutation.isPending ? "..." : t.loginButton}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={function (e) { e.preventDefault(); handleRegister(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="flex items-center gap-2">
                    <User className="w-4 h-4"/>
                    {t.name} *
                  </Label>
                  <Input id="register-name" name="name" type="text" placeholder="Juan Pérez" required className="w-full bg-white text-black" data-testid="input-register-name"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4"/>
                    {t.phone} *
                  </Label>
                  <Input id="register-phone" name="phone" type="tel" placeholder="+595981234567" required className="w-full bg-white text-black" data-testid="input-register-phone"/>
                  <p className="text-xs text-muted-foreground">{t.phoneFormat}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4"/>
                    {t.email}
                  </Label>
                  <Input id="register-email" name="email" type="email" placeholder="tu@email.com" className="w-full bg-white text-black" data-testid="input-register-email"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4"/>
                    {t.password} *
                  </Label>
                  <Input id="register-password" name="password" type="password" placeholder="••••••••" required className="w-full bg-white text-black" data-testid="input-register-password"/>
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || registerMutation.isPending} data-testid="button-register">
                  {isLoading || registerMutation.isPending ? "..." : t.registerButton}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);
}
