@echo off
echo ========================================
echo   Desinstalando Servicio
echo   WhatsApp Web Multi-Instance
echo ========================================
echo.
echo Este script:
echo   1. Detendra y eliminara el servicio PM2
echo   2. NO eliminara el certificado CA (debes hacerlo manualmente)
echo.
pause

cd /d "%~dp0"

echo.
echo Deteniendo y eliminando el servicio...
call pm2 delete whatsapp-proxy 2>nul
call pm2 save 2>nul

echo.
echo ========================================
echo   Servicio Desinstalado
echo ========================================
echo.
echo El proxy ya no se ejecutara automaticamente.
echo.
echo NOTA: El certificado CA sigue instalado.
echo       Si quieres eliminarlo, ve a:
echo       Panel de Control ^> Certificados ^> Entidades de certificacion raiz
echo       y busca "localhost" o "selfsigned"
echo.
pause

