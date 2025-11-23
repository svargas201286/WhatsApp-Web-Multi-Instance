# 🔧 Configurar Archivo Hosts

## ⚠️ Problema

Si ves una página en blanco al acceder a `https://wa1.localhost:8443`, probablemente el archivo hosts no está configurado.

## 🚀 Solución Rápida

### Opción 1: Script Automático (Recomendado)

1. **Haz clic derecho** en `configurar-hosts.bat`
2. Selecciona **"Ejecutar como administrador"**
3. Sigue las instrucciones

### Opción 2: Manual

1. Presiona `Win + R`
2. Escribe: `notepad`
3. Presiona `Ctrl + Shift + Enter` (para abrir como administrador)
4. En el Notepad, ve a: `Archivo` → `Abrir`
5. Navega a: `C:\Windows\System32\drivers\etc\`
6. Cambia el filtro a "Todos los archivos"
7. Abre el archivo `hosts`
8. Agrega estas líneas al final:

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

9. Guarda el archivo (`Ctrl + S`)

## ✅ Verificar

Después de configurar, prueba acceder a:
- `https://wa1.localhost:8443`
- `https://wa2.localhost:8443`

Deberías ver WhatsApp Web cargando.

## 🔄 Alternativa Temporal

Si no puedes editar el archivo hosts, puedes usar directamente:
- `https://127.0.0.1:8443`

Pero esto solo te dará UNA instancia, no múltiples.

## ⚠️ Nota

- El archivo hosts requiere permisos de administrador para editar
- Si ya existen las entradas, no es necesario agregarlas de nuevo
- Después de editar, puede que necesites limpiar la caché del DNS: `ipconfig /flushdns`

