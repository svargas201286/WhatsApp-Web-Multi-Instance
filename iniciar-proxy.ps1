# Script PowerShell para iniciar el proxy
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Proxy WhatsApp Web Multiple" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el proxy" -ForegroundColor Yellow
Write-Host ""

# Cambiar al directorio del script
Set-Location $PSScriptRoot

# Iniciar el proxy
npm start

