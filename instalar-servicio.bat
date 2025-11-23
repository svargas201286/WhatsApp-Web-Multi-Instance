@echo off
echo ========================================
echo   Instalacion Completa del Servicio
echo   WhatsApp Web Multi-Instance
echo ========================================
echo.
echo Este script instalara:
echo   1. PM2 (gestor de procesos)
echo   2. El proxy como servicio de Windows
echo   3. El certificado CA de confianza
echo.
echo NOTA: Requiere permisos de Administrador
echo.
pause

cd /d "%~dp0"

echo.
echo [1/3] Instalando PM2 globalmente...
call npm install -g pm2
if errorlevel 1 (
    echo ERROR: No se pudo instalar PM2
    pause
    exit /b 1
)

echo.
echo [2/3] Instalando certificado CA...
call npm run install-ca
if errorlevel 1 (
    echo ADVERTENCIA: No se pudo instalar el certificado CA automaticamente
    echo Puedes instalarlo manualmente ejecutando: instalar-certificado-ca.bat
    echo.
)

echo.
echo [3/3] Configurando el proxy como servicio...
call pm2 start proxy.js --name "whatsapp-proxy"
if errorlevel 1 (
    echo ERROR: No se pudo iniciar el proxy con PM2
    pause
    exit /b 1
)

echo.
echo Configurando PM2 para iniciar con Windows...
call pm2 startup
if errorlevel 1 (
    echo ADVERTENCIA: No se pudo configurar el inicio automatico
    echo El proxy seguira funcionando, pero deberas iniciarlo manualmente
    echo.
)

echo.
echo ========================================
echo   Instalacion Completada
echo ========================================
echo.
echo El proxy esta ejecutandose y se iniciara automaticamente con Windows.
echo.
echo Comandos utiles:
echo   - Ver estado: pm2 status
echo   - Ver logs: pm2 logs whatsapp-proxy
echo   - Detener: pm2 stop whatsapp-proxy
echo   - Reiniciar: pm2 restart whatsapp-proxy
echo   - Eliminar servicio: pm2 delete whatsapp-proxy
echo.
pause

