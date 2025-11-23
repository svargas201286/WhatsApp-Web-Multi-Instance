# 🔐 Instalar Certificado CA para Eliminar Advertencias

## 🎯 Objetivo

Instalar el certificado CA como confiable en Windows para que Chrome **NO muestre** el mensaje de "La conexión no es privada".

## 🚀 Instalación Automática (Recomendado)

### Opción 1: Script Batch (Más Fácil)

1. **Haz clic derecho** en `instalar-certificado-ca.bat`
2. Selecciona **"Ejecutar como administrador"**
3. Sigue las instrucciones en pantalla

### Opción 2: Desde Terminal

1. Abre **PowerShell como Administrador**
2. Ejecuta:
   ```powershell
   npm run install-ca
   ```

## 📝 Instalación Manual (Si la automática falla)

Si el script automático no funciona, puedes instalar el certificado manualmente:

### Paso 1: Generar el certificado CA

Ejecuta:
```powershell
npm run install-ca
```

Esto generará el archivo `ca.crt` (aunque falle la instalación automática).

### Paso 2: Instalar manualmente en Windows

1. **Haz doble clic** en el archivo `ca.crt`
2. Se abrirá el asistente de certificados
3. Haz clic en **"Instalar certificado..."**
4. Selecciona **"Colocar todos los certificados en el siguiente almacén"**
5. Haz clic en **"Examinar..."**
6. Selecciona **"Entidades de certificación raíz de confianza"**
7. Haz clic en **"Aceptar"**
8. Haz clic en **"Siguiente"** → **"Finalizar"**
9. En la advertencia de seguridad, haz clic en **"Sí"**
10. Verás un mensaje de éxito

### Paso 3: Reiniciar Chrome

1. **Cierra completamente Chrome** (todas las ventanas)
2. Vuelve a abrir Chrome
3. Intenta acceder a `https://wa1.localhost:8443`
4. **¡No debería aparecer la advertencia!**

## ✅ Verificar que Funciona

Después de instalar:

1. Abre Chrome
2. Ve a `https://wa1.localhost:8443`
3. **NO debería aparecer** el mensaje de "La conexión no es privada"
4. Deberías ver el candado verde 🔒 en la barra de direcciones

## 🔄 Si Aún Aparece la Advertencia

1. **Cierra completamente Chrome** (Ctrl+Shift+Q o cerrar todas las ventanas)
2. **Reinicia Chrome**
3. Si persiste, verifica que el certificado esté instalado:
   - Presiona `Win + R`
   - Escribe: `certmgr.msc`
   - Ve a "Entidades de certificación raíz de confianza" → "Certificados"
   - Busca "WhatsApp Web Multiple CA"
4. Si no está, repite la instalación manual

## 🗑️ Desinstalar el Certificado (Opcional)

Si quieres eliminar el certificado CA:

1. Presiona `Win + R`
2. Escribe: `certmgr.msc`
3. Ve a "Entidades de certificación raíz de confianza" → "Certificados"
4. Busca "WhatsApp Web Multiple CA"
5. Haz clic derecho → "Eliminar" → "Sí"

## ⚠️ Notas Importantes

- El certificado CA es válido por **10 años**
- Solo afecta a los dominios `wa*.localhost`
- Es seguro porque solo funciona en tu computadora local
- No afecta otros sitios web

## 🎉 ¡Listo!

Una vez instalado, Chrome confiará en los certificados generados y **nunca más verás** el mensaje de advertencia.

