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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, X, CheckCircle, AlertCircle } from "lucide-react";
export default function ServiceManagement(_a) {
    var _this = this;
    var onBack = _a.onBack;
    var _b = useState(null), selectedService = _b[0], setSelectedService = _b[1];
    var _c = useState(null), uploadingService = _c[0], setUploadingService = _c[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    // Fetch services
    var _d = useQuery({
        queryKey: ['services'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/services')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch services');
                        return [2 /*return*/, response.json()];
                }
            });
        }); }
    }), _e = _d.data, services = _e === void 0 ? [] : _e, isLoading = _d.isLoading, error = _d.error;
    // Upload image mutation
    var uploadImageMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var formData, response, error_1;
            var serviceSlug = _b.serviceSlug, file = _b.file;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('image', file);
                        formData.append('serviceSlug', serviceSlug);
                        return [4 /*yield*/, fetch('/api/services/upload-image', {
                                method: 'POST',
                                body: formData,
                                credentials: 'include',
                            })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error_1 = _c.sent();
                        throw new Error(error_1.error || 'Failed to upload image');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function (data, variables) {
            toast({
                title: "✅ Imagen subida exitosamente",
                description: "Imagen para ".concat(variables.serviceSlug, " subida correctamente"),
            });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setUploadingService(null);
        },
        onError: function (error) {
            toast({
                title: "❌ Error al subir imagen",
                description: error.message || "Error desconocido",
                variant: "destructive",
            });
            setUploadingService(null);
        }
    });
    var handleImageUpload = function (service, file) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setUploadingService(service.slug);
            uploadImageMutation.mutate({ serviceSlug: service.slug, file: file });
            return [2 /*return*/];
        });
    }); };
    var handleFileChange = function (service) { return function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    title: "❌ Archivo demasiado grande",
                    description: "El archivo debe ser menor a 5MB",
                    variant: "destructive",
                });
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "❌ Tipo de archivo inválido",
                    description: "Solo se permiten archivos de imagen",
                    variant: "destructive",
                });
                return;
            }
            handleImageUpload(service, file);
        }
    }; };
    if (isLoading) {
        return (<div className="space-y-6 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>);
    }
    if (error) {
        return (<div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold mb-2">Error al cargar servicios</h3>
            <p className="text-muted-foreground">No se pudieron cargar los servicios. Intente nuevamente.</p>
            <Button onClick={function () { return queryClient.invalidateQueries({ queryKey: ['services'] }); }} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>);
    }
    return (<div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back-to-dashboard">
              <X className="h-4 w-4"/>
            </Button>
            <CardTitle>Gestión de Servicios</CardTitle>
          </div>
          <CardDescription>
            Administra las imágenes y configuraciones de los servicios disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(function (service) { return (<Card key={service.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  <div className="relative">
                    {service.imageUrl ? (<div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover"/>
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full"/>
                        </div>
                      </div>) : (<div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                        <div className="text-center">
                          <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2"/>
                          <p className="text-xs text-muted-foreground">Sin imagen</p>
                        </div>
                      </div>)}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <Input type="file" accept="image/*" onChange={handleFileChange(service)} className="hidden" id={"file-".concat(service.slug)} disabled={uploadingService === service.slug}/>
                    <Label htmlFor={"file-".concat(service.slug)}>
                      <Button variant="outline" size="sm" className="w-full" disabled={uploadingService === service.slug} asChild>
                        <span>
                          {uploadingService === service.slug ? (<>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                              Subiendo...
                            </>) : (<>
                              <Upload className="h-4 w-4 mr-2"/>
                              {service.imageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                            </>)}
                        </span>
                      </Button>
                    </Label>
                  </div>

                  {/* Service Details */}
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="font-mono text-xs">{service.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-xs">{service.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>); })}
          </div>

          {services.length === 0 && (<div className="text-center py-8">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">No hay servicios disponibles</h3>
              <p className="text-muted-foreground">No se encontraron servicios en la base de datos.</p>
            </div>)}
        </CardContent>
      </Card>
    </div>);
}
