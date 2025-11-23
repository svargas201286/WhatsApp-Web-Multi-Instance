# 📱 Multiple WhatsApp Web - Proyecto Completo

Este proyecto permite abrir múltiples instancias independientes de WhatsApp Web usando dominios virtuales.

## 📂 Estructura del Proyecto

```
MULTIPLE WHATSAPP WEB/
│
├── extension/              # 📦 Archivos de la extensión de Chrome
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── icon*.png
│
├── proxy.js               # 🔄 Servidor proxy local
├── package.json           # 📋 Dependencias de Node.js
├── iniciar-proxy.bat      # 🚀 Script para iniciar el proxy
│
└── [otros archivos de configuración]
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```powershell
npm install
```

### 2. Iniciar el proxy
```powershell
npm start
```
O haz doble clic en `iniciar-proxy.bat`

### 3. Cargar la extensión en Chrome
1. Abre `chrome://extensions/`
2. Activa "Modo de desarrollador"
3. Haz clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `extension`

### 4. Usar la extensión
- Haz clic en el icono de la extensión
- Selecciona qué instancia abrir (1-10)
- ¡Listo!

## 📁 Carpetas

- **`extension/`** - Archivos de la extensión de Chrome (cargar esta carpeta)
- **Raíz** - Archivos del proxy y configuración

## 📖 Documentación

- `README.md` - Documentación completa
- `INSTRUCCIONES-CARGA.md` - Guía paso a paso
- `CONFIGURAR-INICIO-AUTOMATICO.md` - Configurar inicio automático
- `INICIO-RAPIDO.md` - Guía rápida

## ⚠️ Importante

- El proxy debe estar ejecutándose para que la extensión funcione
- Los certificados SSL se generan automáticamente la primera vez
- Cada instancia mantiene su propia sesión de forma independiente

