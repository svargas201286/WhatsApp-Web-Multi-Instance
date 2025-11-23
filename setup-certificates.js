// Script para generar certificados SSL automáticamente
const { execSync } = require('child_process');
const fs = require('fs');

const hosts = Array.from({length: 10}, (_,i) => `wa${i+1}.localhost`);

console.log('🔐 Generando certificados SSL para dominios virtuales...\n');

// Verificar si mkcert está instalado
try {
  execSync('mkcert -version', { stdio: 'ignore' });
  console.log('✅ mkcert encontrado\n');
  
  // Instalar CA local si no está instalada
  try {
    execSync('mkcert -install', { stdio: 'inherit' });
  } catch (e) {
    console.log('ℹ️  CA local ya instalada o requiere permisos de administrador\n');
  }
  
  // Generar certificados
  const domains = ['localhost', '127.0.0.1', ...hosts].join(' ');
  const command = `mkcert -key-file server.key -cert-file server.crt ${domains}`;
  
  console.log('📝 Generando certificados para:', domains.split(' ').join(', '));
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Certificados generados exitosamente!');
  console.log('   - server.key');
  console.log('   - server.crt\n');
  
} catch (error) {
  console.error('❌ Error: mkcert no está instalado o no está en el PATH');
  console.error('\n📦 Opciones para instalar mkcert:');
  console.error('   1. Con Chocolatey: choco install mkcert');
  console.error('   2. Descargar desde: https://github.com/FiloSottile/mkcert/releases');
  console.error('   3. Ver INSTALACION.md para más detalles\n');
  process.exit(1);
}

