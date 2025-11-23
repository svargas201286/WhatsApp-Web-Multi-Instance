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

### 4. Iniciar el servidor proxy

```powershell
npm start
```

El servidor se iniciará en el puerto 8443. Los certificados SSL se generarán automáticamente la primera vez.

### 5. Cargar la extensión en Chrome

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el "Modo de desarrollador" (Developer mode) en la esquina superior derecha
3. Haz clic en "Cargar extensión sin empaquetar" (Load unpacked)
4. Selecciona la carpeta **`extension`** dentro del proyecto

## 🎯 Uso

1. **Asegúrate de que el proxy esté ejecutándose** (`npm start`)

2. **Abre instancias de WhatsApp Web**:
   - Haz clic en el icono de la extensión
   - Selecciona qué instancia quieres abrir (1-10)
   - O simplemente navega a `https://wa1.localhost:8443`, `https://wa2.localhost:8443`, etc.

3. **Primera vez**: Chrome mostrará una advertencia de seguridad porque los certificados son autofirmados:
   - Haz clic en "Avanzado"
   - Luego en "Continuar a waN.localhost (no seguro)"
   - Esto solo ocurre la primera vez por dominio

4. **Escanea el código QR** en cada instancia para iniciar sesión con diferentes números de celular

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
- Los certificados autofirmados generan advertencias de seguridad (normal en desarrollo)
- WhatsApp puede detectar múltiples sesiones simultáneas (úsalo bajo tu propio riesgo)
- Esta extensión es solo para uso personal y educativo

## 🐛 Solución de Problemas

### Error: "No se puede conectar"
- Verifica que el proxy esté ejecutándose (`npm start`)
- Verifica que el puerto 8443 no esté en uso
- Revisa la consola del proxy para ver errores

### Error de certificado SSL
- Acepta la advertencia de seguridad la primera vez
- Si persiste, elimina `server.key` y `server.crt` y reinicia el proxy
- O instala el certificado CA ejecutando `instalar-certificado-ca.bat` como administrador

### La extensión no redirige
- Verifica que tengas los permisos correctos en `manifest.json`
- Recarga la extensión en `chrome://extensions/`
- Revisa la consola del service worker (en `chrome://extensions/` → "Inspeccionar vistas: service worker")

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.
