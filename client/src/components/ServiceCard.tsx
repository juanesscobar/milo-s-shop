import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ImagePlus, Image } from "lucide-react";
import { useRef, useState } from 'react';
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  language: 'es' | 'pt';
  onReserve: (slug: string) => void;
  onUploadImage?: (slug: string, file: File) => void;
  onSelect?: (serviceId: string) => void;
  onGenerateImage?: (serviceId: string, file: File) => void;
}

export default function ServiceCard({
  service,
  language,
  onReserve,
  onUploadImage,
  onSelect,
  onGenerateImage
}: ServiceCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const title = service.title;
  const subtitle = service.description;
  const copy = null; // No additional copy for now

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const vehicleNames = {
    es: { auto: "Auto", suv: "SUV", camioneta: "Camioneta" },
    pt: { auto: "Auto", suv: "SUV", camioneta: "Caminhonete" }
  };

  const t = vehicleNames[language];
  const buttonText = language === 'es' ? 'Seleccionar' : 'Selecionar';
  
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Call upload function
      onUploadImage?.(service.slug, file);
    }
  };

  return (
    <Card className="w-full hover-elevate" data-testid={`card-service-${service.slug}`}>
      {/* Área para agregar imagem da galeria */}
      <div className="p-3 pb-0">
        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25 relative overflow-hidden">
          {previewImage ? (
            <div className="relative w-full h-full">
              <img 
                src={previewImage} 
                alt={`Preview ${title}`}
                className="w-full h-full object-cover rounded-md"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleImageUpload}
                className="absolute bottom-2 right-2 h-8 w-8 p-1"
                data-testid={`button-change-image-${service.slug}`}
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleImageUpload}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              data-testid={`button-upload-image-${service.slug}`}
            >
              <ImagePlus className="h-4 w-4" />
              {language === 'es' ? 'Agregar Imagen' : 'Adicionar Imagem'}
            </Button>
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          data-testid={`input-file-${service.slug}`}
        />
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
          {service.prices?.auto != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{t.auto}</span>
              <span className="font-bold">{formatPrice(service.prices.auto)}</span>
            </div>
          )}
          {service.prices?.suv != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{t.suv}</span>
              <span className="font-bold">{formatPrice(service.prices.suv)}</span>
            </div>
          )}
          {service.prices?.camioneta != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{t.camioneta}</span>
              <span className="font-bold">{formatPrice(service.prices.camioneta)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onReserve(service.slug)}
          variant="outline"
          size="sm"
          className="mx-auto"
          data-testid={`button-select-${service.slug}`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}