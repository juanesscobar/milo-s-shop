import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export class ImageOptimizer {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
    format: 'jpeg'
  };

  /**
   * Optimiza una imagen redimensionándola y comprimiéndola
   */
  static async optimizeImage(
    inputPath: string,
    outputPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      let pipeline = sharp(inputPath);

      // Redimensionar manteniendo aspect ratio
      pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Aplicar compresión según formato
      switch (opts.format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality: opts.quality });
          break;
        case 'png':
          pipeline = pipeline.png({ quality: opts.quality });
          break;
        case 'webp':
          pipeline = pipeline.webp({ quality: opts.quality });
          break;
      }

      await pipeline.toFile(outputPath);

      // Log de optimización
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const compressionRatio = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);

      console.log(`✅ Imagen optimizada: ${compressionRatio}% reducción (${inputStats.size} → ${outputStats.size} bytes)`);

    } catch (error) {
      console.error('❌ Error optimizando imagen:', error);
      // Si falla la optimización, copiar el archivo original
      fs.copyFileSync(inputPath, outputPath);
      console.log('⚠️  Se copió el archivo original sin optimización');
    }
  }

  /**
   * Optimiza una imagen desde buffer
   */
  static async optimizeImageFromBuffer(
    buffer: Buffer,
    outputPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<void> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      let pipeline = sharp(buffer);

      // Redimensionar manteniendo aspect ratio
      pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Aplicar compresión según formato
      switch (opts.format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality: opts.quality });
          break;
        case 'png':
          pipeline = pipeline.png({ quality: opts.quality });
          break;
        case 'webp':
          pipeline = pipeline.webp({ quality: opts.quality });
          break;
      }

      await pipeline.toFile(outputPath);

      console.log(`✅ Imagen optimizada desde buffer`);

    } catch (error) {
      console.error('❌ Error optimizando imagen desde buffer:', error);
      throw error;
    }
  }

  /**
   * Verifica si un archivo es una imagen válida
   */
  static isValidImage(filePath: string): boolean {
    try {
      const ext = path.extname(filePath).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información de una imagen
   */
  static async getImageInfo(filePath: string): Promise<{ width: number; height: number; size: number } | null> {
    try {
      const metadata = await sharp(filePath).metadata();
      const stats = fs.statSync(filePath);

      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: stats.size
      };
    } catch {
      return null;
    }
  }
}
