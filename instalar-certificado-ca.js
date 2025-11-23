// Script para generar e instalar certificado CA en Windows
const { execSync } = require('child_process');
const fs = require('fs');
const selfsigned = require('selfsigned');
const path = require('path');

console.log('🔐 Generando e instalando certificado CA de confianza...\n');

// Primero generar los certificados del servidor (como siempre)
const MAX = 10;
const hosts = Array.from({length: MAX}, (_,i) => `wa${i+1}.localhost`);

console.log('📝 Generando certificado del servidor...');
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, {
  keySize: 2048,
  days: 365,
  algorithm: 'sha256',
  extensions: [
    {
      name: 'basicConstraints',
      cA: true, // Marcar como CA para que Windows lo acepte
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

// Guardar certificados del servidor
fs.writeFileSync('server.key', pems.private);
fs.writeFileSync('server.crt', pems.cert);

// También guardar como CA para instalación
fs.writeFileSync('ca.crt', pems.cert);

console.log('✅ Certificados generados\n');

// Instalar CA en Windows
console.log('🔧 Instalando certificado CA en Windows...');
console.log('   (Esto requiere permisos de administrador)\n');

const caPath = path.resolve('ca.crt');
const psScript = `
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("${caPath.replace(/\\/g, '\\\\')}")
$store = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "LocalMachine")
$store.Open("ReadWrite")
try {
    $store.Add($cert)
    Write-Host "✅ Certificado CA instalado exitosamente en el almacén de certificados raíz"
} catch {
    if ($_.Exception.Message -like "*ya existe*" -or $_.Exception.Message -like "*already exists*") {
        Write-Host "ℹ️  El certificado CA ya está instalado"
    } else {
        Write-Host "❌ Error al instalar: $($_.Exception.Message)"
        Write-Host "   Intenta ejecutar PowerShell como Administrador"
        exit 1
    }
} finally {
    $store.Close()
}
`;

try {
  // Ejecutar PowerShell como administrador
  execSync(`powershell -ExecutionPolicy Bypass -Command "${psScript}"`, {
    stdio: 'inherit',
    shell: true
  });
  
  console.log('\n✅ ¡Certificado CA instalado exitosamente!');
  console.log('   Chrome ya no mostrará la advertencia de seguridad.\n');
  console.log('📝 Archivos generados:');
  console.log('   - server.key (clave privada del servidor)');
  console.log('   - server.crt (certificado del servidor)');
  console.log('   - ca.crt (certificado CA para instalación)\n');
  console.log('⚠️  NOTA: Si Chrome aún muestra la advertencia:');
  console.log('   1. Cierra completamente Chrome');
  console.log('   2. Vuelve a abrir Chrome');
  console.log('   3. Intenta acceder de nuevo\n');
  
} catch (error) {
  console.error('\n❌ Error al instalar el certificado CA');
  console.error('   Posibles causas:');
  console.error('   1. No tienes permisos de administrador');
  console.error('   2. PowerShell bloqueado por políticas\n');
  console.error('💡 Solución manual:');
  console.error('   1. Haz doble clic en ca.crt');
  console.error('   2. Haz clic en "Instalar certificado..."');
  console.error('   3. Selecciona "Colocar todos los certificados en el siguiente almacén"');
  console.error('   4. Haz clic en "Examinar..."');
  console.error('   5. Selecciona "Entidades de certificación raíz de confianza"');
  console.error('   6. Haz clic en "Siguiente" → "Finalizar" → "Sí"\n');
  process.exit(1);
}

