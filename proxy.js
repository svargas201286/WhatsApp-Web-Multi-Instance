// proxy.js
const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const fs = require('fs');
const express = require('express');
const selfsigned = require('selfsigned');
const zlib = require('zlib');

const TARGET = 'https://web.whatsapp.com';
const PORT = 8443; // puerto HTTPS local

// Crea lista de hostnames permitidos
const MAX = 10;
const hosts = Array.from({length: MAX}, (_,i) => `wa${i+1}.localhost`);

// Función para generar certificados automáticamente
function generateCertificates() {
  console.log('🔐 Generando certificados SSL automáticamente...');
  
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'subjectAltName',
        altNames: [
          { type: 2, value: 'localhost' },
          { type: 7, ip: '127.0.0.1' },
          ...hosts.map(host => ({ type: 2, value: host }))
        ],
      },
    ],
  });

  // Guardar certificados
  fs.writeFileSync('server.key', pems.private);
  fs.writeFileSync('server.crt', pems.cert);
  
  console.log('✅ Certificados generados exitosamente!\n');
  return { key: pems.private, cert: pems.cert };
}

// Lee o genera certificados automáticamente
let options;
if (fs.existsSync('server.key') && fs.existsSync('server.crt')) {
  console.log('📜 Usando certificados existentes...\n');
  options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
  };
} else {
  options = generateCertificates();
  console.log('⚠️  NOTA: Los certificados son autofirmados.');
  console.log('   Chrome mostrará una advertencia de seguridad la primera vez.');
  console.log('   Haz clic en "Avanzado" → "Continuar a waN.localhost (no seguro)"\n');
}

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  changeOrigin: true,
  secure: true,
  xfwd: true,
  selfHandleResponse: true // Necesitamos manejar las respuestas para modificar HTML
});

proxy.on('error', function(err, req, res) {
  console.error('Proxy error', err);
  try {
    res.writeHead(502, {'Content-Type': 'text/plain'});
    res.end('Proxy error.');
  } catch(e){ /* ignore */ }
});

// Interceptar respuestas para modificar el contenido
proxy.on('proxyRes', function(proxyRes, req, res) {
  // Mantener headers CSP y x-frame-options para que el CRM funcione correctamente
  
  // Si es HTML, modificar el contenido
  const contentType = proxyRes.headers['content-type'] || '';
  const contentEncoding = (proxyRes.headers['content-encoding'] || '').toLowerCase();
  
  // Solo procesar HTML
  if (contentType.includes('text/html')) {
    let chunks = [];
    let readStream;
    
    // Detectar y configurar descompresión
    if (contentEncoding.includes('gzip')) {
      readStream = zlib.createGunzip();
      proxyRes.pipe(readStream);
    } else if (contentEncoding.includes('deflate')) {
      readStream = zlib.createInflate();
      proxyRes.pipe(readStream);
    } else if (contentEncoding.includes('br')) {
      readStream = zlib.createBrotliDecompress();
      proxyRes.pipe(readStream);
    } else {
      // No está comprimido, leer directamente de proxyRes
      readStream = proxyRes;
      // IMPORTANTE: Leer datos ANTES de que se consuma el stream
      proxyRes.on('data', function(chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
    }
    
    // Para contenido comprimido, leer del stream de descompresión
    if (contentEncoding && (contentEncoding.includes('gzip') || contentEncoding.includes('deflate') || contentEncoding.includes('br'))) {
      readStream.on('data', function(chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
    }
    
    // Usar el stream correcto para el evento 'end'
    const endStream = (contentEncoding && (contentEncoding.includes('gzip') || contentEncoding.includes('deflate') || contentEncoding.includes('br'))) 
      ? readStream 
      : proxyRes;
    
    endStream.on('end', function() {
      try {
        if (chunks.length === 0) {
          console.warn('No se recibieron datos, pasando respuesta directamente');
          // Pasar directamente sin modificar
          Object.keys(proxyRes.headers).forEach(key => {
            res.setHeader(key, proxyRes.headers[key]);
          });
          res.statusCode = proxyRes.statusCode;
          proxyRes.pipe(res);
          return;
        }
        
        // Concatenar todos los chunks
        const buffer = Buffer.concat(chunks);
        let body = buffer.toString('utf8');
        
        // Verificar que el body sea válido HTML (debe tener al menos <html, <!DOCTYPE, o <head)
        const isValidHTML = body.includes('<html') || body.includes('<!DOCTYPE') || body.includes('<head') || body.trim().startsWith('<');
        
        if (!isValidHTML) {
          console.warn('El contenido no parece ser HTML válido, pasando sin modificar');
          console.warn('Content-Encoding recibido:', contentEncoding);
          console.warn('Primeros bytes (hex):', buffer.slice(0, 50).toString('hex'));
          // Si no es HTML válido, pasar directamente sin modificar
          const headers = {};
          Object.keys(proxyRes.headers).forEach(key => {
            headers[key] = proxyRes.headers[key];
          });
          res.writeHead(proxyRes.statusCode, headers);
          res.end(buffer);
          return;
        }
        
        // Modificar el HTML para evitar detección de navegador
        // Eliminar mensaje de "Browser not supported"
        body = body.replace(
          /<div[^>]*>[\s\S]*?Browser not supported[\s\S]*?<\/div>/gi,
          ''
        );
        
        // Eliminar cualquier bloque que contenga "Browser not supported"
        body = body.replace(
          /<!--[\s\S]*?Browser not supported[\s\S]*?-->/gi,
          ''
        );
        
        // Inyectar script ANTES de cualquier otro script para sobrescribir detecciones
        const injectScript = `
        <script>
          (function() {
            // Ejecutar inmediatamente, antes de que WhatsApp cargue
            if (typeof navigator !== 'undefined') {
              // Guardar User-Agent original
              navigator.__originalUserAgent = navigator.userAgent || '';
              
              // Sobrescribir User-Agent
              try {
                Object.defineProperty(navigator, 'userAgent', {
                  get: function() {
                    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
                  },
                  configurable: true
                });
              } catch(e) {}
              
              // Asegurar que Chrome esté detectado
              if (typeof window.chrome === 'undefined') {
                window.chrome = { runtime: {} };
              }
              
              // Sobrescribir vendor
              try {
                Object.defineProperty(navigator, 'vendor', {
                  get: function() { return 'Google Inc.'; },
                  configurable: true
                });
              } catch(e) {}
            }
          })();
        </script>
      `;
        
        // Inyectar al inicio del head o body
        if (body.includes('<head>')) {
          body = body.replace(/<head>/i, '<head>' + injectScript);
        } else if (body.includes('<html>')) {
          body = body.replace(/<html[^>]*>/i, '$&' + injectScript);
        } else if (body.includes('<body')) {
          body = body.replace(/<body[^>]*>/i, '$&' + injectScript);
        }
        
        // Copiar headers y eliminar content-encoding y content-length
        const headers = {};
        Object.keys(proxyRes.headers).forEach(key => {
          const lowerKey = key.toLowerCase();
          // No copiar content-encoding ni content-length (se recalcularán)
          if (lowerKey !== 'content-encoding' && lowerKey !== 'content-length' && lowerKey !== 'transfer-encoding') {
            headers[key] = proxyRes.headers[key];
          }
        });
        
        // Calcular el nuevo content-length
        const bodyBuffer = Buffer.from(body, 'utf8');
        headers['content-length'] = bodyBuffer.length.toString();
        
        // Enviar respuesta modificada (sin compresión)
        res.writeHead(proxyRes.statusCode, headers);
        res.end(bodyBuffer);
      } catch (error) {
        console.error('Error processing HTML:', error);
        // Si hay error, pasar directamente
        Object.keys(proxyRes.headers).forEach(key => {
          res.setHeader(key, proxyRes.headers[key]);
        });
        res.statusCode = proxyRes.statusCode;
        res.end(Buffer.concat(chunks));
      }
    });
    
    readStream.on('error', function(err) {
      console.error('Stream error:', err);
      // Si falla la descompresión, intentar pasar directamente
      try {
        // Limpiar listeners para evitar conflictos
        readStream.removeAllListeners();
        
        // Copiar headers originales
        const headers = {};
        Object.keys(proxyRes.headers).forEach(key => {
          headers[key] = proxyRes.headers[key];
        });
        
        res.writeHead(proxyRes.statusCode, headers);
        
        // Si ya tenemos chunks, enviarlos
        if (chunks.length > 0) {
          res.end(Buffer.concat(chunks));
        } else {
          // Si no, pasar directamente sin modificar
          proxyRes.pipe(res);
        }
      } catch (e) {
        console.error('Error handling stream error:', e);
        // Último recurso: pasar directamente
        try {
          proxyRes.pipe(res);
        } catch (e2) {
          res.end('Error procesando respuesta');
        }
      }
    });
  } else {
    // Para otros tipos de contenido, pasar directamente
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });
    res.statusCode = proxyRes.statusCode;
    proxyRes.pipe(res);
  }
});

const app = express();

// Middleware para modificar headers de las peticiones
app.use((req, res) => {
  const host = req.headers.host.split(':')[0];
  if (!hosts.includes(host)) {
    res.status(404).send('Host no permitido');
    return;
  }

  // Modificar headers para que parezca una petición directa desde Chrome
  req.headers['host'] = 'web.whatsapp.com';
  req.headers['origin'] = 'https://web.whatsapp.com';
  req.headers['referer'] = 'https://web.whatsapp.com/';
  
  // Asegurar User-Agent de Chrome (siempre)
  req.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  // Headers adicionales que Chrome envía
  req.headers['accept'] = req.headers['accept'] || 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';
  req.headers['accept-language'] = req.headers['accept-language'] || 'es-ES,es;q=0.9,en;q=0.8';
  req.headers['accept-encoding'] = req.headers['accept-encoding'] || 'gzip, deflate, br';
  req.headers['sec-ch-ua'] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
  req.headers['sec-ch-ua-mobile'] = '?0';
  req.headers['sec-ch-ua-platform'] = '"Windows"';
  req.headers['sec-fetch-dest'] = req.headers['sec-fetch-dest'] || 'document';
  req.headers['sec-fetch-mode'] = req.headers['sec-fetch-mode'] || 'navigate';
  req.headers['sec-fetch-site'] = req.headers['sec-fetch-site'] || 'none';
  req.headers['sec-fetch-user'] = req.headers['sec-fetch-user'] || '?1';
  req.headers['upgrade-insecure-requests'] = '1';
  
  // Eliminar headers que puedan delatar el proxy
  delete req.headers['x-forwarded-host'];
  delete req.headers['x-forwarded-proto'];
  delete req.headers['x-forwarded-for'];
  delete req.headers['via'];
  delete req.headers['x-real-ip'];
  
  proxy.web(req, res, { target: TARGET, changeOrigin: true, secure: true });
});

// Servidor HTTPS local
https.createServer({
  key: options.key,
  cert: options.cert
}, app).listen(PORT, () => {
  console.log(`Proxy HTTPS escuchando en https://wa1..wa${MAX}.localhost:${PORT}`);
  console.log('Asegúrate de mapear waN.localhost a 127.0.0.1 en tu hosts file y abrir https://waN.localhost:8443/');
});
