import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Image } from "lucide-react";
import { useRef, useState } from 'react';
export default function ServiceCard(_a) {
    var _b, _c, _d;
    var service = _a.service, language = _a.language, onReserve = _a.onReserve, onUploadImage = _a.onUploadImage, onSelect = _a.onSelect, onGenerateImage = _a.onGenerateImage;
    var fileInputRef = useRef(null);
    var _e = useState(null), previewImage = _e[0], setPreviewImage = _e[1];
    var title = service.title;
    var subtitle = service.description;
    var copy = null; // No additional copy for now
    var formatPrice = function (price) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(price);
    };
    var vehicleNames = {
        es: { auto: "Auto", suv: "SUV", camioneta: "Camioneta" },
        pt: { auto: "Auto", suv: "SUV", camioneta: "Caminhonete" }
    };
    var t = vehicleNames[language];
    var buttonText = language === 'es' ? 'Seleccionar' : 'Selecionar';
    var handleImageUpload = function () {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    var handleFileChange = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            // Create preview
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                setPreviewImage((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
            };
            reader.readAsDataURL(file);
            // Call upload function
            onUploadImage === null || onUploadImage === void 0 ? void 0 : onUploadImage(service.slug, file);
        }
    };
    return (<Card className="w-full hover-elevate" data-testid={"card-service-".concat(service.slug)}>
      {/* Área para agregar imagem da galeria */}
      <div className="p-3 pb-0">
        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25 relative overflow-hidden">
          {previewImage ? (<div className="relative w-full h-full">
              <img src={previewImage} alt={"Preview ".concat(title)} className="w-full h-full object-cover rounded-md"/>
              <Button variant="secondary" size="sm" onClick={handleImageUpload} className="absolute bottom-2 right-2 h-8 w-8 p-1" data-testid={"button-change-image-".concat(service.slug)}>
                <Image className="h-4 w-4"/>
              </Button>
            </div>) : (<Button variant="ghost" size="sm" onClick={handleImageUpload} className="flex items-center gap-2 text-muted-foreground hover:text-foreground" data-testid={"button-upload-image-".concat(service.slug)}>
              <ImagePlus className="h-4 w-4"/>
              {language === 'es' ? 'Agregar Imagen' : 'Adicionar Imagem'}
            </Button>)}
        </div>
        
        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-testid={"input-file-".concat(service.slug)}/>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {subtitle}
        </CardDescription>
        <p className="text-sm text-muted-foreground">{copy}</p>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-2">
        <div className="space-y-1">
          {((_b = service.prices) === null || _b === void 0 ? void 0 : _b.auto) != null && (<div className="flex justify-between items-center">
              <span className="text-sm">{t.auto}</span>
              <span className="font-bold">{formatPrice(service.prices.auto)}</span>
            </div>)}
          {((_c = service.prices) === null || _c === void 0 ? void 0 : _c.suv) != null && (<div className="flex justify-between items-center">
              <span className="text-sm">{t.suv}</span>
              <span className="font-bold">{formatPrice(service.prices.suv)}</span>
            </div>)}
          {((_d = service.prices) === null || _d === void 0 ? void 0 : _d.camioneta) != null && (<div className="flex justify-between items-center">
              <span className="text-sm">{t.camioneta}</span>
              <span className="font-bold">{formatPrice(service.prices.camioneta)}</span>
            </div>)}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={function () { return onReserve(service.slug); }} variant="outline" size="sm" className="mx-auto" data-testid={"button-select-".concat(service.slug)}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>);
}
