# 📦 Instrucciones para Cargar la Extensión en Chrome

## ✅ Pasos Rápidos

### 1. Crear los Iconos (Requerido)

Chrome necesita iconos PNG. Tienes 3 opciones:

**Opción A - Generador Online (Más Fácil):**
1. Ve a: https://www.favicon-generator.org/
2. Sube cualquier imagen o crea una simple
3. Descarga los iconos en tamaños 16x16, 48x48 y 128x128
4. Renómbralos a `icon16.png`, `icon48.png`, `icon128.png`
5. Colócalos en la raíz del proyecto

**Opción B - Usar los SVG generados:**
1. Abre `icon16.svg`, `icon48.svg`, `icon128.svg` en tu navegador
2. Toma capturas de pantalla
3. Redimensiona a los tamaños exactos (16x16, 48x48, 128x128)
4. Guarda como PNG con los nombres correctos

**Opción C - Crear manualmente:**
- Usa cualquier editor de imágenes (Paint, GIMP, Photoshop, etc.)
- Crea imágenes de 16x16, 48x48 y 128x128 píxeles
- Fondo verde (#25D366) con texto "WA" en blanco
- Guarda como PNG

### 2. Configurar el archivo hosts (Recomendado)

1. Abre PowerShell como **Administrador**
2. Ejecuta:
   ```powershell
   notepad C:\Windows\System32\drivers\etc\hosts
   ```
3. Agrega estas líneas al final:
   ```
   127.0.0.1 wa1.localhost
   127.0.0.1 wa2.localhost
   127.0.0.1 wa3.localhost
   127.0.0.1 wa4.localhost
   127.0.0.1 wa5.localhost
   127.0.0.1 wa6.localhost
   127.0.0.1 wa7.localhost
   127.0.0.1 wa8.localhost
   127.0.0.1 wa9.localhost
   127.0.0.1 wa10.localhost
   ```
4. Guarda el archivo

### 3. Iniciar el Proxy

En una terminal, ejecuta:
```powershell
npm start
```

Deberías ver:
```
🔐 Generando certificados SSL automáticamente...
✅ Certificados generados exitosamente!
Proxy HTTPS escuchando en https://wa1..wa10.localhost:8443
```

**¡Mantén esta terminal abierta!** El proxy debe estar ejecutándose.

### 4. Cargar la Extensión en Chrome

1. Abre Chrome
2. Ve a: `chrome://extensions/`
3. Activa el **"Modo de desarrollador"** (toggle en la esquina superior derecha)
4. Haz clic en **"Cargar extensión sin empaquetar"** (Load unpacked)
5. Selecciona la carpeta **`extension`** dentro del proyecto:
   - `F:\ARCHIVOS COMPRADOS\CRM WHATSAPP\MULTIPLE WHATSAPP WEB\extension`
6. ¡Listo! Deberías ver la extensión cargada

### 5. Usar la Extensión

1. Haz clic en el icono de la extensión (en la barra de herramientas)
2. Selecciona qué instancia quieres abrir (1-10)
3. La primera vez, Chrome mostrará una advertencia de seguridad:
   - Haz clic en **"Avanzado"**
   - Luego en **"Continuar a waN.localhost (no seguro)"**
4. Escanea el código QR con WhatsApp
5. ¡Listo! Tienes una instancia funcionando

### 6. Abrir Más Instancias

- Repite el paso 5 para abrir más instancias
- Cada una será independiente
- Puedes tener hasta 10 instancias simultáneas

## 🔧 Solución de Problemas

### Error: "No se puede cargar la extensión"
- Verifica que los iconos PNG existan (icon16.png, icon48.png, icon128.png)
- Revisa la consola en `chrome://extensions/` para ver errores específicos

### Error: "No se puede conectar"
- Verifica que el proxy esté ejecutándose (`npm start`)
- Verifica que el puerto 8443 no esté bloqueado por el firewall

### La extensión no redirige
- Recarga la extensión (botón de recarga en `chrome://extensions/`)
- Verifica que tengas los permisos correctos
- Revisa la consola del service worker

### Error de certificado SSL
- Acepta la advertencia la primera vez
- Si persiste, elimina `server.key` y `server.crt` y reinicia el proxy

## 📝 Notas

- El proxy **debe estar ejecutándose** siempre que uses la extensión
- Los certificados son autofirmados (normal en desarrollo)
- Cada instancia mantiene su propia sesión de forma independiente
- Puedes cerrar y reabrir instancias sin perder la sesión (si WhatsApp lo permite)

