@echo off
REM Script para iniciar el proxy automáticamente con Windows
REM Para usar: Coloca un acceso directo de este archivo en la carpeta de inicio de Windows
REM Carpeta de inicio: Win+R -> shell:startup

cd /d "%~dp0"
start "Proxy WhatsApp Web" /MIN npm start

