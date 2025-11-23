# 📦 Extensión de Chrome - Multiple WhatsApp Web

Esta carpeta contiene todos los archivos necesarios para cargar la extensión en Chrome.

## 🚀 Cargar en Chrome

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **"Modo de desarrollador"** (toggle en la esquina superior derecha)
3. Haz clic en **"Cargar extensión sin empaquetar"** (Load unpacked)
4. Selecciona esta carpeta: `extension`

## 📁 Archivos de la Extensión

- `manifest.json` - Configuración de la extensión
- `background.js` - Service worker que intercepta peticiones
- `popup.html` - Interfaz del popup
- `popup.js` - Lógica del popup
- `icon16.png`, `icon48.png`, `icon128.png` - Iconos de la extensión

## ⚠️ Importante

- El proxy debe estar ejecutándose para que la extensión funcione
- Inicia el proxy desde la carpeta raíz: `npm start` o `iniciar-proxy.bat`

