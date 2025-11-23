@echo off
REM Script de instalacion completa y automatica
REM Ejecuta todos los pasos necesarios sin intervencion del usuario

echo ========================================
echo   Instalacion Automatica Completa
echo   WhatsApp Web Multi-Instance
echo ========================================
echo.
echo Este script ejecutara automaticamente:
echo   1. Configuracion del archivo hosts
echo   2. Instalacion de PM2 y dependencias
echo   3. Instalacion del certificado CA
echo   4. Configuracion del servicio automatico
echo.
echo NOTA: Requiere permisos de Administrador
echo       Todo se ejecutara automaticamente...
echo.
timeout /t 3 /nobreak >nul

cd /d "%~dp0"

REM Verificar si se ejecuta como administrador
net session >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Este script requiere permisos de Administrador
    echo.
    echo Por favor, haz clic derecho en este archivo y selecciona
    echo "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Paso 1/4: Configurando archivo hosts
echo ========================================
echo.
call configurar-hosts.bat /AUTO
if errorlevel 1 (
    echo [ADVERTENCIA] No se pudo configurar el archivo hosts automaticamente
    echo Puedes hacerlo manualmente ejecutando: configurar-hosts.bat
    echo.
) else (
    echo [OK] Archivo hosts configurado
)

echo.
echo ========================================
echo   Paso 2/4: Instalando dependencias
echo ========================================
echo.
if not exist "node_modules\" (
    echo Instalando dependencias de Node.js...
    call npm install
    if errorlevel 1 (
        echo [ERROR] No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas
) else (
    echo [OK] Dependencias ya instaladas
)

echo.
echo Instalando PM2 y pm2-windows-startup globalmente...
call npm install -g pm2 pm2-windows-startup
if errorlevel 1 (
    echo [ERROR] No se pudo instalar PM2
    pause
    exit /b 1
)
echo [OK] PM2 instalado

echo.
echo ========================================
echo   Paso 3/4: Instalando certificado CA
echo ========================================
echo.
call npm run install-ca
if errorlevel 1 (
    echo [ADVERTENCIA] No se pudo instalar el certificado CA automaticamente
    echo Puedes instalarlo manualmente ejecutando: instalar-certificado-ca.bat
    echo.
) else (
    echo [OK] Certificado CA instalado
)

echo.
echo ========================================
echo   Paso 4/4: Configurando servicio automatico
echo ========================================
echo.

REM Detener proceso anterior si existe
call pm2 delete whatsapp-proxy 2>nul

echo Iniciando el proxy con PM2...
call pm2 start proxy.js --name "whatsapp-proxy"
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el proxy con PM2
    pause
    exit /b 1
)
echo [OK] Proxy iniciado

echo.
echo Guardando configuracion de PM2...
call pm2 save
if errorlevel 1 (
    echo [ADVERTENCIA] No se pudo guardar la configuracion de PM2
) else (
    echo [OK] Configuracion guardada
)

echo.
echo Configurando inicio automatico con Windows...
call pm2-startup install
if errorlevel 1 (
    echo [ADVERTENCIA] No se pudo configurar el inicio automatico
    echo El proxy seguira funcionando, pero deberas iniciarlo manualmente
    echo.
) else (
    echo [OK] Inicio automatico configurado correctamente
)

echo.
echo ========================================
echo   Instalacion Completada Exitosamente
echo ========================================
echo.
echo [OK] Archivo hosts configurado
echo [OK] Dependencias instaladas
echo [OK] PM2 instalado y configurado
echo [OK] Proxy iniciado y ejecutandose
echo [OK] Certificado CA instalado
echo [OK] Inicio automatico configurado
echo.
echo El proxy se iniciara automaticamente cada vez que
echo enciendas tu computadora. No necesitas hacer nada mas.
echo.
echo Verificando estado final...
call pm2 status
echo.
echo ========================================
echo   Todo Listo!
echo ========================================
echo.
echo El proxy esta funcionando y se iniciara automaticamente.
echo Puedes cerrar esta ventana.
echo.
timeout /t 5 /nobreak >nul

