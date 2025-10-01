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
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
var ImageOptimizer = /** @class */ (function () {
    function ImageOptimizer() {
    }
    /**
     * Optimiza una imagen redimensionándola y comprimiéndola
     */
    ImageOptimizer.optimizeImage = function (inputPath_1, outputPath_1) {
        return __awaiter(this, arguments, void 0, function (inputPath, outputPath, options) {
            var opts, pipeline, inputStats, outputStats, compressionRatio, error_1;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = __assign(__assign({}, this.DEFAULT_OPTIONS), options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        pipeline = sharp(inputPath);
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
                        return [4 /*yield*/, pipeline.toFile(outputPath)];
                    case 2:
                        _a.sent();
                        inputStats = fs.statSync(inputPath);
                        outputStats = fs.statSync(outputPath);
                        compressionRatio = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
                        console.log("\u2705 Imagen optimizada: ".concat(compressionRatio, "% reducci\u00F3n (").concat(inputStats.size, " \u2192 ").concat(outputStats.size, " bytes)"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Error optimizando imagen:', error_1);
                        // Si falla la optimización, copiar el archivo original
                        fs.copyFileSync(inputPath, outputPath);
                        console.log('⚠️  Se copió el archivo original sin optimización');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Optimiza una imagen desde buffer
     */
    ImageOptimizer.optimizeImageFromBuffer = function (buffer_1, outputPath_1) {
        return __awaiter(this, arguments, void 0, function (buffer, outputPath, options) {
            var opts, pipeline, error_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = __assign(__assign({}, this.DEFAULT_OPTIONS), options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        pipeline = sharp(buffer);
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
                        return [4 /*yield*/, pipeline.toFile(outputPath)];
                    case 2:
                        _a.sent();
                        console.log("\u2705 Imagen optimizada desde buffer");
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('❌ Error optimizando imagen desde buffer:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica si un archivo es una imagen válida
     */
    ImageOptimizer.isValidImage = function (filePath) {
        try {
            var ext = path.extname(filePath).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        }
        catch (_a) {
            return false;
        }
    };
    /**
     * Obtiene información de una imagen
     */
    ImageOptimizer.getImageInfo = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, stats, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, sharp(filePath).metadata()];
                    case 1:
                        metadata = _b.sent();
                        stats = fs.statSync(filePath);
                        return [2 /*return*/, {
                                width: metadata.width || 0,
                                height: metadata.height || 0,
                                size: stats.size
                            }];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ImageOptimizer.DEFAULT_OPTIONS = {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 80,
        format: 'jpeg'
    };
    return ImageOptimizer;
}());
export { ImageOptimizer };
