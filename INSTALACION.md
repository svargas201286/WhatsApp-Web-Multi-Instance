# Instalación de Certificados SSL para WhatsApp Web Múltiple

## Opción 1: Instalar mkcert (Recomendado)

### Método A: Con Chocolatey (si lo tienes instalado)
```powershell
choco install mkcert
```

### Método B: Descarga manual
1. Ve a: https://github.com/FiloSottile/mkcert/releases
2. Descarga `mkcert-v1.4.4-windows-amd64.exe` (o la versión más reciente)
3. Renómbralo a `mkcert.exe`
4. Colócalo en una carpeta que esté en tu PATH, o úsalo directamente desde donde lo descargaste

### Después de instalar mkcert:
```powershell
# Instalar la CA local
mkcert -install

# Generar certificados para los dominios virtuales
mkcert -key-file server.key -cert-file server.crt wa1.localhost wa2.localhost wa3.localhost wa4.localhost wa5.localhost wa6.localhost wa7.localhost wa8.localhost wa9.localhost wa10.localhost localhost 127.0.0.1
```

## Opción 2: Generar certificados con OpenSSL (Alternativa)

Si prefieres no instalar mkcert, puedes usar OpenSSL:

```powershell
# Instalar OpenSSL (si no lo tienes)
# Opción 1: Con Chocolatey
choco install openssl

# Opción 2: Descargar desde https://slproweb.com/products/Win32OpenSSL.html

# Generar certificado autofirmado
openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -nodes -subj "/CN=localhost"
```

**Nota**: Los certificados autofirmados requerirán que aceptes la advertencia de seguridad en Chrome.

## Opción 3: Script automatizado

Ejecuta el script `setup-certificates.js` que genera certificados automáticamente.

