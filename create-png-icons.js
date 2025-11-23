// Script para crear iconos PNG desde SVG usando sharp
const sharp = require('sharp');
const fs = require('fs');

async function createPNGIcon(size) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#25D366" rx="${size * 0.15}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.45}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">WA</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`icon${size}.png`);
  
  console.log(`✅ Creado icon${size}.png`);
}

async function main() {
  console.log('🎨 Generando iconos PNG...\n');
  
  try {
    await createPNGIcon(16);
    await createPNGIcon(48);
    await createPNGIcon(128);
    
    console.log('\n✅ ¡Todos los iconos PNG creados exitosamente!');
    console.log('   La extensión está lista para cargar en Chrome.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Alternativa: Usa un generador online como favicon-generator.org');
  }
}

main();

