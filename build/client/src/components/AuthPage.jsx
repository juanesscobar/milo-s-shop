var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft } from 'lucide-react';
export default function AuthPage(_a) {
    var _this = this;
    var _b = _a.language, language = _b === void 0 ? 'es' : _b, userType = _a.userType;
    var location = useLocation()[0];
    var _c = useState(location.includes('/register') ? 'register' : 'login'), activeTab = _c[0], setActiveTab = _c[1];
    var _d = useLocation(), navigate = _d[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    // Login form state
    var _e = useState({
        email: '',
        password: ''
    }), loginData = _e[0], setLoginData = _e[1];
    // Register form state
    var _f = useState({
        name: '',
        companyName: userType === 'admin' ? 'Mi Empresa' : '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: ''
    }), registerData = _f[0], setRegisterData = _f[1];
    var content = {
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
    var t = content[language];
    // Login mutation
    var loginMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        if (!response.ok)
                            throw new Error(result.error || 'Login failed');
                        return [2 /*return*/, result];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
            toast({
                title: '✅ ' + t.loginSuccess,
                description: 'Bienvenido de vuelta',
            });
            navigate(userType === 'admin' ? '/admin' : '/cliente');
        },
        onError: function (error) {
            toast({
                title: '❌ ' + t.loginError,
                description: error.message,
                variant: 'destructive',
            });
        }
    });
    // Register mutation
    var registerMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var endpoint, response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = userType === 'admin' ? '/api/auth/register/admin' : '/api/auth/register';
                        console.log('🔍 DEBUG: Attempting registration with endpoint:', endpoint, 'for userType:', userType);
                        console.log('🔍 DEBUG: Registration data:', __assign(__assign({}, data), { password: '[HIDDEN]', passwordConfirm: '[HIDDEN]' }));
                        return [4 /*yield*/, fetch(endpoint, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data),
                                credentials: 'include'
                            })];
                    case 1:
                        response = _a.sent();
                        console.log('🔍 DEBUG: Response status:', response.status, 'ok:', response.ok);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        console.log('🔍 DEBUG: Response result:', result);
                        if (!response.ok)
                            throw new Error(result.error || 'Registration failed');
                        return [2 /*return*/, result];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
            toast({
                title: '✅ ' + t.registerSuccess,
                description: 'Tu cuenta ha sido creada exitosamente',
            });
            setActiveTab('login');
        },
        onError: function (error) {
            toast({
                title: '❌ ' + t.registerError,
                description: error.message,
                variant: 'destructive',
            });
        }
    });
    var handleLogin = function (e) {
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
    var handleRegister = function (e) {
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
    return (<div className="auth-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" onClick={function () { return navigate('/'); }} className="mb-4 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2"/>
            {t.backToHome}
          </Button>
        </div>

        <Card className="auth-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">{t.title}</CardTitle>
            <CardDescription className="text-gray-600">
              {userType === 'admin'
            ? 'Accede al panel de administración'
            : 'Accede a tu panel de cliente'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={function (value) {
            var newTab = value;
            setActiveTab(newTab);
            var basePath = userType === 'admin' ? '/admin' : '/cliente';
            navigate("".concat(basePath, "/").concat(newTab));
        }} className="auth-tabs">
              <TabsList className="grid w-full grid-cols-2 tabs-list">
                <TabsTrigger value="login" className="tabs-trigger">{t.login}</TabsTrigger>
                <TabsTrigger value="register" className="tabs-trigger">{t.register}</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="auth-form space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t.email}</Label>
                    <Input id="login-email" type="email" value={loginData.email} onChange={function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} placeholder="tu@email.com" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t.password}</Label>
                    <Input id="login-password" type="password" value={loginData.password} onChange={function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); }} placeholder="••••••••" required/>
                  </div>
                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                    {t.loginButton}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="auth-form space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t.name}</Label>
                    <Input id="register-name" type="text" value={registerData.name} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} placeholder="Tu nombre completo" required/>
                  </div>

                  {userType === 'admin' && (<div className="space-y-2">
                      <Label htmlFor="register-company">{t.companyName}</Label>
                      <Input id="register-company" type="text" value={registerData.companyName} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { companyName: e.target.value })); }); }} placeholder="Nombre de tu empresa" required/>
                    </div>)}

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">{t.phone}</Label>
                    <Input id="register-phone" type="tel" value={registerData.phone} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); }); }} placeholder="+595 9XX XXX XXX"/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t.email}</Label>
                    <Input id="register-email" type="email" value={registerData.email} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} placeholder="tu@email.com" required/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t.password}</Label>
                    <Input id="register-password" type="password" value={registerData.password} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); }} placeholder="••••••••" required/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password-confirm">Confirmar {t.password.toLowerCase()}</Label>
                    <Input id="register-password-confirm" type="password" value={registerData.passwordConfirm} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { passwordConfirm: e.target.value })); }); }} placeholder="••••••••" required/>
                  </div>

                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                    {t.registerButton}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>);
}
