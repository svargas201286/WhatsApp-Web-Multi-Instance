# 🔧 Solución: Página en Blanco

## ❌ Problema

La página está en blanco al acceder a `https://wa4.localhost:8443` (o cualquier `waN.localhost:8443`).

## ✅ Causa

El archivo **hosts** de Windows no está configurado. Los dominios `wa*.localhost` no se pueden resolver.

## 🚀 Solución Rápida

### Opción 1: Script Automático (Más Fácil)

1. **Haz clic derecho** en `configurar-hosts.bat`
2. Selecciona **"Ejecutar como administrador"**
3. Sigue las instrucciones en pantalla

### Opción 2: Manual (Paso a Paso)

1. **Presiona `Win + R`**
2. **Escribe:** `notepad`
3. **Presiona `Ctrl + Shift + Enter`** (para abrir como administrador)
4. En Notepad, ve a: **`Archivo` → `Abrir`**
5. Navega a: `C:\Windows\System32\drivers\etc\`
6. **Cambia el filtro** a **"Todos los archivos"** (abajo a la derecha)
7. **Abre el archivo `hosts`**
8. **Agrega estas líneas al final:**

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

9. **Guarda el archivo** (`Ctrl + S`)
10. **Cierra Notepad**

### Opción 3: Desde PowerShell (Como Administrador)

```powershell
# Abre PowerShell como Administrador
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "`n127.0.0.1 wa1.localhost`n127.0.0.1 wa2.localhost`n127.0.0.1 wa3.localhost`n127.0.0.1 wa4.localhost`n127.0.0.1 wa5.localhost`n127.0.0.1 wa6.localhost`n127.0.0.1 wa7.localhost`n127.0.0.1 wa8.localhost`n127.0.0.1 wa9.localhost`n127.0.0.1 wa10.localhost"
```

## ✅ Después de Configurar

1. **Limpia la caché DNS:**
   ```powershell
   ipconfig /flushdns
   ```

2. **Cierra completamente Chrome** (todas las ventanas)

3. **Vuelve a abrir Chrome**

4. **Intenta acceder de nuevo:**
   - `https://wa1.localhost:8443`
   - `https://wa4.localhost:8443`
   - etc.

## 🔍 Verificar que Funciona

Ejecuta en PowerShell:
```powershell
node diagnostico-proxy.js
```

Deberías ver:
```
✅ Conexión exitosa!
   Estado: 200
```

## ⚠️ Notas Importantes

- El archivo hosts requiere **permisos de administrador** para editar
- Si ya existen las entradas, no es necesario agregarlas de nuevo
- Después de editar, limpia la caché DNS con `ipconfig /flushdns`
- El proxy debe estar ejecutándose (`npm start`)

## 🆘 Si Aún No Funciona

1. Verifica que el proxy esté ejecutándose:
   ```powershell
   netstat -ano | findstr :8443
   ```

2. Verifica que el archivo hosts tenga las entradas:
   ```powershell
   type C:\Windows\System32\drivers\etc\hosts | findstr wa
   ```

3. Prueba con `127.0.0.1:8443` directamente (solo una instancia)

