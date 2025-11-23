@echo off
echo ========================================
echo   Instalando Certificado CA de Confianza
echo ========================================
echo.
echo Esto instalara el certificado CA en Windows
echo para que Chrome no muestre advertencias.
echo.
echo NOTA: Requiere permisos de Administrador
echo.
pause

cd /d "%~dp0"
npm run install-ca

pause

