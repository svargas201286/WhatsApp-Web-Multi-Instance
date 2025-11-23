@echo off
echo ========================================
echo   Configurar archivo hosts
echo ========================================
echo.
echo Este script agregara las entradas necesarias
echo al archivo hosts de Windows.
echo.
echo NOTA: Requiere permisos de Administrador
echo.
pause

echo.
echo Agregando entradas al archivo hosts...
echo.

:: Verificar si ya existen las entradas
findstr /C:"wa1.localhost" C:\Windows\System32\drivers\etc\hosts >nul 2>&1
if %errorlevel% equ 0 (
    echo Las entradas ya existen en el archivo hosts.
    echo.
    pause
    exit /b
)

:: Agregar entradas al archivo hosts
(
    echo.
    echo # Multiple WhatsApp Web - Dominios virtuales
    echo 127.0.0.1 wa1.localhost
    echo 127.0.0.1 wa2.localhost
    echo 127.0.0.1 wa3.localhost
    echo 127.0.0.1 wa4.localhost
    echo 127.0.0.1 wa5.localhost
    echo 127.0.0.1 wa6.localhost
    echo 127.0.0.1 wa7.localhost
    echo 127.0.0.1 wa8.localhost
    echo 127.0.0.1 wa9.localhost
    echo 127.0.0.1 wa10.localhost
) >> C:\Windows\System32\drivers\etc\hosts

if %errorlevel% equ 0 (
    echo.
    echo ✅ Entradas agregadas exitosamente!
    echo.
    echo Ahora puedes usar:
    echo   - https://wa1.localhost:8443
    echo   - https://wa2.localhost:8443
    echo   - etc.
    echo.
) else (
    echo.
    echo ❌ Error: No se pudieron agregar las entradas.
    echo.
    echo Por favor, ejecuta este script como Administrador:
    echo   1. Clic derecho en este archivo
    echo   2. Selecciona "Ejecutar como administrador"
    echo.
)

pause

