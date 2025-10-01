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
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
export default function Header(_a) {
    var _this = this;
    var currentLanguage = _a.currentLanguage, onLanguageChange = _a.onLanguageChange;
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, logout = _b.logout, isLoggingOut = _b.isLoggingOut, user = _b.user;
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    window.location.href = '/';
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error during logout:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <img src="/milos-logo.png" alt="Milos'Shop logo" className="h-8 w-8" onError={function (e) {
            // Hide broken image if logo not found
            e.currentTarget.style.display = 'none';
        }}/>
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Milos'Shop
          </Link>
        </div>

        <nav className="flex items-center space-x-3">
          {isAuthenticated && user && (<div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Bienvenido, {user.name}</span>
            </div>)}
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              Home
            </Button>
          </Link>
          {isAuthenticated && (<Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2"/>
              {isLoggingOut ? 'Saliendo...' : 'Salir'}
            </Button>)}
          <LanguageToggle currentLanguage={currentLanguage} onLanguageChange={onLanguageChange}/>
        </nav>
      </div>
    </header>);
}
