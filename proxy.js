// proxy.js
const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const fs = require('fs');
const express = require('express');
const selfsigned = require('selfsigned');

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
  selfHandleResponse: false
});

proxy.on('error', function(err, req, res) {
  console.error('Proxy error', err);
  try {
    res.writeHead(502, {'Content-Type': 'text/plain'});
    res.end('Proxy error.');
  } catch(e){ /* ignore */ }
});

const app = express();

// Forzar Host header al objetivo, pero mantenemos dominio local al navegador
app.use((req, res) => {
  const host = req.headers.host.split(':')[0];
  if (!hosts.includes(host)) {
    res.status(404).send('Host no permitido');
    return;
  }

  // Proxy: cambiamos headers antes de enviar a web.whatsapp.com
  req.headers['host'] = 'web.whatsapp.com';
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
