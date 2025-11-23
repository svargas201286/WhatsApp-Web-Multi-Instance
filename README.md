# WhatsApp Web Multi-Instance

Extensión de Chrome que permite abrir múltiples instancias independientes de WhatsApp Web usando dominios virtuales locales.

## 🚀 Características

- ✅ Hasta 10 instancias independientes de WhatsApp Web
- ✅ Cada instancia mantiene su propia sesión
- ✅ Sin necesidad de instalar herramientas externas (mkcert)
- ✅ Certificados SSL generados automáticamente
- ✅ Interfaz simple y fácil de usar

## 📋 Requisitos Previos

- Node.js instalado (v14 o superior)
- Google Chrome o navegador basado en Chromium
- Acceso para editar el archivo hosts (opcional, para mejor experiencia)

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/svargas201286/WhatsApp-Web-Multi-Instance.git
cd WhatsApp-Web-Multi-Instance
```

### 2. Instalar dependencias

```bash
npm install
```

**Nota:** Esto instalará automáticamente todas las dependencias necesarias. Si hay errores, ver la sección de [Solución de Problemas](#-solución-de-problemas).

### 3. Configurar archivo hosts (Recomendado)

Edita el archivo `C:\Windows\System32\drivers\etc\hosts` como administrador y agrega:

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

**Nota**: En Windows, puedes abrir el archivo con:
```powershell
notepad C:\Windows\System32\drivers\etc\hosts
```

O ejecuta el script `configurar-hosts.bat` como administrador.

### 4. Instalación Automática (Recomendado)

Para ejecutar el proxy automáticamente como servicio y eliminar la advertencia de seguridad:

1. **Ejecuta `instalar-servicio.bat` como administrador** (clic derecho → "Ejecutar como administrador")

   Este script:
   - Instala PM2 (gestor de procesos)
   - Instala el certificado CA de confianza (elimina la advertencia "No es seguro")
   - Configura el proxy como servicio de Windows
   - El proxy se iniciará automáticamente al encender tu PC

2. **Alternativa manual**:
   ```powershell
   # Instalar certificado CA (elimina advertencia de seguridad)
   npm run install-ca
   
   # Iniciar proxy manualmente
   npm start
   ```

### 5. Cargar la extensión en Chrome

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el "Modo de desarrollador" (Developer mode) en la esquina superior derecha
3. Haz clic en "Cargar extensión sin empaquetar" (Load unpacked)
4. Selecciona la carpeta **`extension`** dentro del proyecto

## 🎯 Uso

1. **Si instalaste el servicio automático**: El proxy ya está ejecutándose. Si no, ejecuta `npm start` o `iniciar-proxy.bat`

2. **Abre instancias de WhatsApp Web**:
   - Haz clic en el icono de la extensión
   - Selecciona qué instancia quieres abrir (1-10)
   - O simplemente navega a `https://wa1.localhost:8443`, `https://wa2.localhost:8443`, etc.

3. **Si instalaste el certificado CA**: No verás ninguna advertencia de seguridad. Si no lo instalaste:
   - Chrome mostrará "No es seguro" la primera vez
   - Haz clic en "Avanzado" → "Continuar a waN.localhost (no seguro)"
   - Para eliminar esta advertencia permanentemente, ejecuta `instalar-certificado-ca.bat` como administrador

4. **Escanea el código QR** en cada instancia para iniciar sesión con diferentes números de celular

## 🔧 Gestión del Servicio (Si instalaste PM2)

Si instalaste el servicio automático, puedes gestionarlo con estos comandos:

```bash
# Ver estado del proxy
pm2 status

# Ver logs en tiempo real
pm2 logs whatsapp-proxy

# Reiniciar el proxy
pm2 restart whatsapp-proxy

# Detener el proxy
pm2 stop whatsapp-proxy

# Eliminar el servicio
pm2 delete whatsapp-proxy
# O ejecuta: desinstalar-servicio.bat
```

## 📁 Estructura del Proyecto

```
.
├── extension/             # Archivos de la extensión de Chrome
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── icon*.png
├── proxy.js              # Servidor proxy local
├── package.json          # Dependencias de Node.js
└── README.md            # Este archivo
```

## 🔒 Seguridad

- Los certificados SSL son autofirmados (solo para desarrollo local)
- Todas las conexiones pasan por el proxy local
- No se almacena información sensible
- Cada instancia mantiene su propia sesión de forma independiente

## ⚠️ Notas Importantes

- El proxy debe estar ejecutándose para que la extensión funcione
- **Recomendado**: Instala el servicio automático (`instalar-servicio.bat`) para:
  - Ejecutar el proxy automáticamente al iniciar Windows
  - Eliminar la advertencia "No es seguro" en Chrome
- WhatsApp puede detectar múltiples sesiones simultáneas (úsalo bajo tu propio riesgo)
- Esta extensión es solo para uso personal y educativo

## 🐛 Solución de Problemas

### Error: "No se puede conectar"
- Verifica que el proxy esté ejecutándose (`npm start`)
- Verifica que el puerto 8443 no esté en uso
- Revisa la consola del proxy para ver errores

### Error de certificado SSL / "No es seguro"
- **Solución permanente**: Ejecuta `instalar-certificado-ca.bat` como administrador
- Si no puedes instalar el certificado CA, acepta la advertencia la primera vez
- Si persiste, elimina `server.key` y `server.crt` y reinicia el proxy
- Después de instalar el certificado CA, cierra completamente Chrome y vuelve a abrirlo

### La extensión no redirige
- Verifica que tengas los permisos correctos en `manifest.json`
- Recarga la extensión en `chrome://extensions/`
- Revisa la consola del service worker (en `chrome://extensions/` → "Inspeccionar vistas: service worker")

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.
