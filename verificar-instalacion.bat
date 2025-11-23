@echo off
echo ========================================
echo   Verificacion de Instalacion
echo   WhatsApp Web Multi-Instance
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js NO esta instalado
    echo     Descarga desde: https://nodejs.org/
    goto :error
) else (
    echo [OK] Node.js esta instalado
    node --version
)

echo.
echo Verificando dependencias...
if not exist "node_modules\" (
    echo [X] Dependencias NO instaladas
    echo     Ejecuta: npm install
    goto :error
) else (
    echo [OK] Dependencias instaladas
)

echo.
echo Verificando certificados...
if not exist "server.key" (
    echo [!] Certificados NO generados (se generaran automaticamente al iniciar)
) else (
    echo [OK] Certificados generados
)

echo.
echo Verificando PM2...
where pm2 >nul 2>&1
if errorlevel 1 (
    echo [!] PM2 NO esta instalado (opcional, para servicio automatico)
    echo     Instala con: npm install -g pm2
) else (
    echo [OK] PM2 esta instalado
    pm2 list | findstr "whatsapp-proxy" >nul 2>&1
    if errorlevel 1 (
        echo [!] El servicio NO esta ejecutandose
        echo     Instala el servicio con: instalar-todo.bat
    ) else (
        echo [OK] El servicio esta ejecutandose
    )
)

echo.
echo Verificando archivo hosts...
findstr /C:"wa1.localhost" C:\Windows\System32\drivers\etc\hosts >nul 2>&1
if errorlevel 1 (
    echo [!] Dominios virtuales NO configurados en hosts
    echo     Ejecuta: configurar-hosts.bat (como administrador)
) else (
    echo [OK] Dominios virtuales configurados
)

echo.
echo ========================================
echo   Verificacion Completada
echo ========================================
echo.
goto :end

:error
echo.
echo ========================================
echo   Hay problemas que resolver
echo ========================================
echo.
pause
exit /b 1

:end
pause

