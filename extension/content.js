// content.js - Script que se inyecta en web.whatsapp.com
// Agrega un botón para abrir otra instancia de WhatsApp Web

(function() {
  'use strict';

  const PROXY_PORT = 8443;

  // Función para verificar que el runtime esté disponible
  function isRuntimeAvailable() {
    try {
      return chrome && chrome.runtime && chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  // Función para obtener el siguiente dominio disponible (mediante mensaje al background)
  async function getNextAvailableDomain() {
    if (!isRuntimeAvailable()) {
      console.warn('Extension context invalidated. Recarga la página.');
      return null;
    }
    
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(
          { action: 'getNextDomain' },
          (response) => {
            if (chrome.runtime.lastError) {
              // Si el contexto está invalidado, no mostrar error
              if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
                console.warn('Extension context invalidated. Recarga la página.');
                resolve(null);
              } else {
                console.error('Error:', chrome.runtime.lastError);
                resolve(null);
              }
            } else {
              resolve(response?.domain || null);
            }
          }
        );
      } catch (error) {
        console.warn('Error al enviar mensaje:', error);
        resolve(null);
      }
    });
  }

  // Función para crear el botón
  function createButton() {
    // Verificar si el runtime está disponible
    if (!isRuntimeAvailable()) {
      // Si la extensión se recargó, no crear el botón
      return;
    }
    
    // Verificar si el botón ya existe
    if (document.getElementById('wa-multi-open-btn')) {
      return;
    }

    const button = document.createElement('div');
    button.id = 'wa-multi-open-btn';
    button.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #25D366;
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
      " onmouseover="this.style.background='#20BA5A'; this.style.transform='scale(1.05)'" 
         onmouseout="this.style.background='#25D366'; this.style.transform='scale(1)'">
        <span>➕</span>
        <span>Abrir otra instancia</span>
      </div>
    `;

    button.addEventListener('click', async () => {
      // Verificar que el runtime esté disponible
      if (!isRuntimeAvailable()) {
        alert('La extensión se ha recargado. Por favor, recarga esta página (F5) para continuar.');
        return;
      }
      
      // Enviar mensaje al background para abrir nueva instancia
      try {
        chrome.runtime.sendMessage(
          { action: 'openInstance' },
          (response) => {
            if (chrome.runtime.lastError) {
              // Si el contexto está invalidado, mostrar mensaje específico
              if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
                alert('La extensión se ha recargado. Por favor, recarga esta página (F5) y vuelve a intentar.');
              } else {
                console.error('Error:', chrome.runtime.lastError);
                alert('Error al abrir nueva instancia. Verifica que el proxy esté ejecutándose.');
              }
            } else if (!response || !response.success) {
              alert('Todas las instancias están en uso (máximo 10) o el proxy no está ejecutándose.');
            }
          }
        );
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        alert('Error de comunicación con la extensión. Recarga la página (F5) y vuelve a intentar.');
      }
    });

    document.body.appendChild(button);
  }

  // Detectar si el contexto de la extensión se invalidó y recargar automáticamente
  function checkExtensionContext() {
    if (!isRuntimeAvailable()) {
      // Si el contexto está invalidado, recargar la página automáticamente
      console.log('Extension context invalidated. Recargando página...');
      window.location.reload();
      return;
    }
  }

  // Verificar el contexto periódicamente
  setInterval(checkExtensionContext, 2000); // Verificar cada 2 segundos

  // Esperar a que la página cargue completamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    // Si ya está cargado, crear el botón después de un pequeño delay
    setTimeout(createButton, 1000);
  }

  // También crear el botón cuando cambia el contenido dinámico
  const observer = new MutationObserver(() => {
    if (!document.getElementById('wa-multi-open-btn')) {
      createButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

