# 🚀 Inicio Rápido - Proxy WhatsApp Web

## ⚡ Formas de Iniciar el Proxy

### Opción 1: Doble Clic (Más Fácil) ⭐
1. Haz **doble clic** en `iniciar-proxy.bat`
2. Se abrirá una ventana con el proxy ejecutándose
3. **Mantén la ventana abierta** mientras uses la extensión

### Opción 2: Desde Terminal
```powershell
npm start
```

### Opción 3: PowerShell
```powershell
.\iniciar-proxy.ps1
```

### Opción 4: Iniciar Automáticamente con Windows
1. Presiona `Win + R`
2. Escribe: `shell:startup`
3. Presiona Enter
4. Crea un acceso directo de `iniciar-con-windows.bat` en esa carpeta
5. El proxy se iniciará automáticamente al iniciar Windows (en segundo plano)

## ✅ Verificar si el Proxy está Ejecutándose

Ejecuta en una terminal:
```powershell
npm run check
```

O simplemente intenta abrir una instancia desde la extensión.

## ⚠️ Importante

- **El proxy DEBE estar ejecutándose** para que la extensión funcione
- Puedes minimizar la ventana del proxy, pero **NO la cierres**
- Si cierras el proxy, las instancias de WhatsApp Web dejarán de funcionar

## 🔄 Reiniciar el Proxy

Si necesitas reiniciar:
1. Cierra la ventana del proxy (Ctrl+C)
2. Vuelve a iniciarlo con cualquiera de las opciones anteriores

## 💡 Consejo

Crea un acceso directo de `iniciar-proxy.bat` en tu escritorio para acceso rápido.

