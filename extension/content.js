// content.js - Script que se inyecta en web.whatsapp.com
// Agrega un botón para abrir otra instancia de WhatsApp Web

(function() {
  'use strict';

  const PROXY_PORT = 8443;

  // Función para obtener el siguiente dominio disponible (mediante mensaje al background)
  async function getNextAvailableDomain() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'getNextDomain' },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            resolve(null);
          } else {
            resolve(response?.domain || null);
          }
        }
      );
    });
  }

  // Función para crear el botón
  function createButton() {
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
      // Enviar mensaje al background para abrir nueva instancia
      chrome.runtime.sendMessage(
        { action: 'openInstance' },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            alert('Error al abrir nueva instancia. Verifica que el proxy esté ejecutándose.');
          } else if (!response || !response.success) {
            alert('Todas las instancias están en uso (máximo 10) o el proxy no está ejecutándose.');
          }
        }
      );
    });

    document.body.appendChild(button);
  }

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

