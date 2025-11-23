@echo off
echo ========================================
echo   Reparar Servicio de Proxy
echo   WhatsApp Web Multi-Instance
echo ========================================
echo.
echo Este script verificara y reparara el servicio
echo si no esta ejecutandose correctamente.
echo.
echo NOTA: Requiere permisos de Administrador
echo.
pause

cd /d "%~dp0"

echo.
echo Verificando PM2...
where pm2 >nul 2>&1
if errorlevel 1 (
    echo [X] PM2 NO esta instalado
    echo.
    echo Instalando PM2 y pm2-windows-startup...
    call npm install -g pm2 pm2-windows-startup
    if errorlevel 1 (
        echo ERROR: No se pudo instalar PM2
        pause
        exit /b 1
    )
    echo [OK] PM2 instalado
) else (
    echo [OK] PM2 esta instalado
)

echo.
echo Verificando si el proxy esta ejecutandose...
pm2 list | findstr "whatsapp-proxy" >nul 2>&1
if errorlevel 1 (
    echo [!] El proxy NO esta ejecutandose
    echo.
    echo Iniciando el proxy...
    call pm2 start proxy.js --name "whatsapp-proxy"
    if errorlevel 1 (
        echo ERROR: No se pudo iniciar el proxy
        pause
        exit /b 1
    )
    echo [OK] Proxy iniciado
) else (
    echo [OK] El proxy ya esta ejecutandose
    echo.
    echo Reiniciando el proxy para asegurar que funciona correctamente...
    call pm2 restart whatsapp-proxy
    if errorlevel 1 (
        echo ERROR: No se pudo reiniciar el proxy
        pause
        exit /b 1
    )
    echo [OK] Proxy reiniciado
)

echo.
echo Guardando configuracion de PM2...
call pm2 save
if errorlevel 1 (
    echo ADVERTENCIA: No se pudo guardar la configuracion
) else (
    echo [OK] Configuracion guardada
)

echo.
echo Verificando pm2-windows-startup...
where pm2-startup >nul 2>&1
if errorlevel 1 (
    echo [!] pm2-windows-startup NO esta instalado
    echo.
    echo Instalando pm2-windows-startup...
    call npm install -g pm2-windows-startup
    if errorlevel 1 (
        echo ADVERTENCIA: No se pudo instalar pm2-windows-startup
    )
)

echo.
echo Configurando inicio automatico...
call pm2-startup install
if errorlevel 1 (
    echo ADVERTENCIA: No se pudo configurar el inicio automatico
) else (
    echo [OK] Inicio automatico configurado
)

echo.
echo ========================================
echo   Estado del Servicio
echo ========================================
echo.
pm2 status
echo.
echo ========================================
echo   Reparacion Completada
echo ========================================
echo.
echo El proxy deberia estar ejecutandose ahora.
echo.
echo Para verificar:
echo   pm2 status
echo   pm2 logs whatsapp-proxy
echo.
pause

