// Script para verificar si el proxy está ejecutándose
const https = require('https');

const PROXY_PORT = 8443;
const TEST_URL = `https://wa1.localhost:${PROXY_PORT}`;

console.log('🔍 Verificando si el proxy está ejecutándose...\n');

// Intentar conectar al proxy
const req = https.get(TEST_URL, { 
  rejectUnauthorized: false // Permitir certificados autofirmados
}, (res) => {
  console.log('✅ El proxy está ejecutándose correctamente!');
  console.log(`   Puerto: ${PROXY_PORT}`);
  console.log(`   Estado: ${res.statusCode}\n`);
  process.exit(0);
});

req.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.log('❌ El proxy NO está ejecutándose');
    console.log('\n💡 Para iniciarlo:');
    console.log('   - Ejecuta: npm start');
    console.log('   - O haz doble clic en: iniciar-proxy.bat\n');
  } else {
    console.log('⚠️  Error al verificar:', err.message);
  }
  process.exit(1);
});

req.setTimeout(3000, () => {
  req.destroy();
  console.log('❌ Timeout: El proxy no responde');
  console.log('\n💡 Para iniciarlo:');
  console.log('   - Ejecuta: npm start');
  console.log('   - O haz doble clic en: iniciar-proxy.bat\n');
  process.exit(1);
});

