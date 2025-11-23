# 🔄 Configurar Inicio Automático del Proxy

## ⚠️ Importante

**Las extensiones de Chrome NO pueden ejecutar procesos automáticamente** por razones de seguridad. El proxy debe iniciarse manualmente o configurarse para iniciarse con Windows.

## 🚀 Opción 1: Inicio Automático con Windows (Recomendado)

### Pasos:

1. **Presiona `Win + R`** (tecla Windows + R)

2. **Escribe:** `shell:startup`
   - Esto abre la carpeta de inicio de Windows

3. **Crea un acceso directo:**
   - Haz clic derecho en `iniciar-con-windows.bat`
   - Selecciona "Crear acceso directo"
   - Corta el acceso directo (Ctrl+X)
   - Pégalo en la carpeta de inicio (Ctrl+V)

4. **¡Listo!** 
   - El proxy se iniciará automáticamente cada vez que inicies Windows
   - Se ejecutará en segundo plano (minimizado)

### Verificar que funciona:
- Reinicia tu computadora
- El proxy debería iniciarse automáticamente
- Verifica con: `npm run check`

## 🖱️ Opción 2: Inicio Manual (Más Control)

1. **Doble clic** en `iniciar-proxy.bat` cuando necesites usar la extensión
2. Mantén la ventana abierta mientras uses WhatsApp Web
3. Cierra cuando termines

## 💡 Opción 3: Crear Acceso Directo en Escritorio

1. Haz clic derecho en `iniciar-proxy.bat`
2. Selecciona "Crear acceso directo"
3. Arrastra el acceso directo al escritorio
4. Ahora puedes iniciar el proxy con un doble clic desde el escritorio

## ⚙️ Opción 4: Usar el Programador de Tareas de Windows

Para más control avanzado:

1. Abre "Programador de tareas" (Task Scheduler)
2. Crea una tarea nueva
3. Configura para ejecutar `iniciar-con-windows.bat` al iniciar sesión
4. Configura para ejecutarse con privilegios elevados si es necesario

## 📝 Resumen

- ✅ **Inicio automático**: Usa `iniciar-con-windows.bat` en la carpeta de inicio
- ✅ **Inicio manual**: Doble clic en `iniciar-proxy.bat`
- ✅ **Acceso rápido**: Acceso directo en el escritorio

**Recomendación**: Usa la Opción 1 (inicio automático) para que siempre esté disponible cuando necesites la extensión.

