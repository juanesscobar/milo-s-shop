import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, X, CheckCircle, AlertCircle } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceManagementProps {
  onBack: () => void;
}

export default function ServiceManagement({ onBack }: ServiceManagementProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [uploadingService, setUploadingService] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch services
  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    }
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ serviceSlug, file }: { serviceSlug: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('serviceSlug', serviceSlug);

      const response = await fetch('/api/services/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "✅ Imagen subida exitosamente",
        description: `Imagen para ${variables.serviceSlug} subida correctamente`,
      });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setUploadingService(null);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error al subir imagen",
        description: error.message || "Error desconocido",
        variant: "destructive",
      });
      setUploadingService(null);
    }
  });

  const handleImageUpload = async (service: Service, file: File) => {
    setUploadingService(service.slug);
    uploadImageMutation.mutate({ serviceSlug: service.slug, file });
  };

  const handleFileChange = (service: Service) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar servicios</h3>
            <p className="text-muted-foreground">No se pudieron cargar los servicios. Intente nuevamente.</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['services'] })} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              data-testid="button-back-to-dashboard"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle>Gestión de Servicios</CardTitle>
          </div>
          <CardDescription>
            Administra las imágenes y configuraciones de los servicios disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="relative">
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
                    {service.imageUrl ? (
                      <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                        <div className="text-center">
                          <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Sin imagen</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange(service)}
                      className="hidden"
                      id={`file-${service.slug}`}
                      disabled={uploadingService === service.slug}
                    />
                    <Label htmlFor={`file-${service.slug}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={uploadingService === service.slug}
                        asChild
                      >
                        <span>
                          {uploadingService === service.slug ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {service.imageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                            </>
                          )}
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
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-8">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay servicios disponibles</h3>
              <p className="text-muted-foreground">No se encontraron servicios en la base de datos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}