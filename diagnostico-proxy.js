// Script de diagnóstico para el proxy
const https = require('https');

const PROXY_PORT = 8443;
const TEST_URL = `https://wa4.localhost:${PROXY_PORT}`;

console.log('🔍 Diagnóstico del Proxy\n');
console.log('URL de prueba:', TEST_URL);
console.log('');

// Intentar conectar y ver qué responde
const req = https.get(TEST_URL, { 
  rejectUnauthorized: false,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
}, (res) => {
  console.log('✅ Conexión exitosa!');
  console.log('   Estado:', res.statusCode);
  console.log('   Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');
  console.log('📄 Contenido recibido (primeros 500 caracteres):');
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk.toString();
  });
  
  res.on('end', () => {
    console.log(data.substring(0, 500));
    console.log('\n✅ Diagnóstico completado');
    process.exit(0);
  });
});

req.on('error', (err) => {
  if (err.code === 'ENOTFOUND') {
    console.log('❌ Error: wa4.localhost no se puede resolver');
    console.log('   Problema: El archivo hosts no está configurado');
    console.log('\n💡 Solución:');
    console.log('   1. Ejecuta: configurar-hosts.bat (como administrador)');
    console.log('   2. O edita manualmente: C:\\Windows\\System32\\drivers\\etc\\hosts');
    console.log('   3. Agrega: 127.0.0.1 wa4.localhost');
  } else if (err.code === 'ECONNREFUSED') {
    console.log('❌ Error: Conexión rechazada');
    console.log('   Problema: El proxy no está ejecutándose');
    console.log('\n💡 Solución:');
    console.log('   Ejecuta: npm start');
  } else {
    console.log('❌ Error:', err.message);
    console.log('   Código:', err.code);
  }
  process.exit(1);
});

req.setTimeout(5000, () => {
  req.destroy();
  console.log('❌ Timeout: El proxy no responde en 5 segundos');
  process.exit(1);
});

