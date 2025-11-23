# 📦 Instalación del Proyecto

## 🚀 Instalación Rápida

### 1. Clonar o descargar el proyecto

```bash
git clone [URL_DEL_REPOSITORIO]
cd "MULTIPLE WHATSAPP WEB"
```

O si descargaste el ZIP, extrae los archivos.

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará automáticamente:
- `express` - Servidor web
- `http-proxy` - Proxy HTTP
- `selfsigned` - Generación de certificados SSL
- `sharp` (dev) - Para generar iconos

### 3. Verificar instalación

```bash
npm run check
```

Si todo está bien, deberías ver un mensaje indicando que el proxy no está ejecutándose (es normal si no lo has iniciado aún).

### 4. Iniciar el proxy

```bash
npm start
```

O en Windows:
```bash
iniciar-proxy.bat
```

### 5. Cargar la extensión en Chrome

1. Abre `chrome://extensions/`
2. Activa "Modo de desarrollador"
3. Haz clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `extension`

## ⚠️ Solución de Problemas

### Error: "Cannot find module"

Si obtienes errores de módulos no encontrados:

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

En Windows PowerShell:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: "EACCES" o permisos

En Windows, ejecuta PowerShell como Administrador.

### Error: Puerto 8443 en uso

Si el puerto 8443 está ocupado, puedes cambiarlo en `proxy.js`:

```javascript
const PORT = 8443; // Cambia este número
```

## 📋 Requisitos

- Node.js v14 o superior
- npm (viene con Node.js)
- Google Chrome o navegador basado en Chromium

## 🔍 Verificar versiones

```bash
node --version  # Debe ser v14 o superior
npm --version
```

## ✅ Verificación Post-Instalación

Después de `npm install`, deberías tener:

- ✅ Carpeta `node_modules/` creada
- ✅ Sin errores en la consola
- ✅ Archivos `package.json` y `package-lock.json` presentes

Si todo está correcto, puedes proceder a iniciar el proxy.

