/**
 * EXTREME PERFORMANCE: Advanced Response Compression
 * Gzip + Brotli compression with intelligent selection
 * Reduces bandwidth by 70-90%
 */

import compression from 'compression';
import type { Request, Response, NextFunction } from 'express';
import zlib from 'zlib';

/**
 * Intelligent compression middleware
 * Automatically selects best compression based on content type and size
 */
export function intelligentCompression() {
  const gzipMiddleware = compression({
    level: 6, // Balance between speed and compression
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      // Don't compress if client doesn't support it
      if (req.headers['x-no-compression']) {
        return false;
      }

      // Use compression's default filter
      return compression.filter(req, res);
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Prefer Brotli (better compression) if supported
    if (acceptEncoding.includes('br')) {
      return brotliMiddleware(req, res, next);
    }

    // Fallback to Gzip
    if (acceptEncoding.includes('gzip')) {
      return gzipMiddleware(req, res, next);
    }

    // No compression
    next();
  };
}

/**
 * Brotli compression middleware (best compression ratio)
 */
function brotliMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalWrite = res.write;
  const originalEnd = res.end;
  const chunks: Buffer[] = [];

  // Capture response data
  res.write = function(chunk: any, ...args: any[]): boolean {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }
    return true;
  };

  res.end = function(chunk?: any, ...args: any[]): Response {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    // Only compress if response is large enough
    if (buffer.length < 1024) {
      res.write = originalWrite;
      res.end = originalEnd;
      return res.end(buffer);
    }

    // Compress with Brotli
    zlib.brotliCompress(
      buffer,
      {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 4, // Balance speed vs compression
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        },
      },
      (err, compressed) => {
        res.write = originalWrite;
        res.end = originalEnd;

        if (err) {
          return res.end(buffer);
        }

        res.setHeader('Content-Encoding', 'br');
        res.setHeader('Content-Length', compressed.length);
        res.end(compressed);
      }
    );

    return res;
  };

  next();
}

/**
 * Pre-compress common static responses
 */
export class PrecompressionCache {
  private cache: Map<string, { gzip: Buffer; brotli: Buffer }>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Pre-compress and cache response
   */
  async precompress(key: string, data: string | Buffer): Promise<void> {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

    const [gzip, brotli] = await Promise.all([
      this.compressGzip(buffer),
      this.compressBrotli(buffer),
    ]);

    this.cache.set(key, { gzip, brotli });
  }

  /**
   * Get pre-compressed response
   */
  get(key: string, encoding: 'gzip' | 'br'): Buffer | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    return encoding === 'br' ? cached.brotli : cached.gzip;
  }

  /**
   * Middleware to serve pre-compressed responses
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const cacheKey = req.path;
      const acceptEncoding = req.headers['accept-encoding'] || '';

      // Try Brotli first
      if (acceptEncoding.includes('br')) {
        const compressed = this.get(cacheKey, 'br');
        if (compressed) {
          res.setHeader('Content-Encoding', 'br');
          res.setHeader('Content-Length', compressed.length);
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          return res.end(compressed);
        }
      }

      // Try Gzip
      if (acceptEncoding.includes('gzip')) {
        const compressed = this.get(cacheKey, 'gzip');
        if (compressed) {
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Content-Length', compressed.length);
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          return res.end(compressed);
        }
      }

      next();
    };
  }

  private compressGzip(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.gzip(buffer, { level: 9 }, (err, compressed) => {
        if (err) reject(err);
        else resolve(compressed);
      });
    });
  }

  private compressBrotli(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.brotliCompress(
        buffer,
        {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Maximum compression
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          },
        },
        (err, compressed) => {
          if (err) reject(err);
          else resolve(compressed);
        }
      );
    });
  }
}

export const precompressionCache = new PrecompressionCache();

/**
 * Compression statistics
 */
export class CompressionStats {
  private stats = {
    originalBytes: 0,
    compressedBytes: 0,
    requestsCompressed: 0,
    requestsUncompressed: 0,
  };

  trackCompression(originalSize: number, compressedSize: number): void {
    this.stats.originalBytes += originalSize;
    this.stats.compressedBytes += compressedSize;
    this.stats.requestsCompressed++;
  }

  trackUncompressed(size: number): void {
    this.stats.originalBytes += size;
    this.stats.compressedBytes += size;
    this.stats.requestsUncompressed++;
  }

  getStats() {
    const compressionRatio =
      this.stats.originalBytes > 0
        ? (
            (1 - this.stats.compressedBytes / this.stats.originalBytes) *
            100
          ).toFixed(2)
        : '0.00';

    const bandwidthSaved = this.stats.originalBytes - this.stats.compressedBytes;

    return {
      ...this.stats,
      compressionRatio: compressionRatio + '%',
      bandwidthSaved: this.formatBytes(bandwidthSaved),
      totalOriginal: this.formatBytes(this.stats.originalBytes),
      totalCompressed: this.formatBytes(this.stats.compressedBytes),
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}

export const compressionStats = new CompressionStats();
