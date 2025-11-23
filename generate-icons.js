// Script para generar iconos SVG básicos para la extensión
const fs = require('fs');

function createSVGIcon(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#25D366" rx="${size * 0.15}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.45}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">WA</text>
</svg>`;
}

console.log('🎨 Generando iconos SVG...\n');

try {
  // Crear iconos SVG (Chrome los acepta, pero PNG es mejor)
  fs.writeFileSync('icon16.svg', createSVGIcon(16));
  fs.writeFileSync('icon48.svg', createSVGIcon(48));
  fs.writeFileSync('icon128.svg', createSVGIcon(128));
  
  console.log('✅ Iconos SVG creados: icon16.svg, icon48.svg, icon128.svg');
  console.log('\n📝 Para convertir a PNG:');
  console.log('   1. Abre los SVG en un navegador');
  console.log('   2. Toma capturas de pantalla y redimensiona');
  console.log('   3. O usa un convertidor online: https://convertio.co/svg-png/');
  console.log('   4. Renombra a icon16.png, icon48.png, icon128.png\n');
  
  console.log('⚠️  NOTA: Chrome prefiere PNG. Los SVG funcionan pero pueden verse pixelados.');
} catch (error) {
  console.log('❌ Error al crear iconos:', error.message);
}

