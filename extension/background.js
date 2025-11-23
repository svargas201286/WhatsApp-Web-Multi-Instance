// background.js - Service Worker para la extensión (Manifest V3)
const MAX_INSTANCES = 10;
const PROXY_PORT = 8443;

// Función para obtener el siguiente dominio disponible
async function getNextAvailableDomain() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['tabDomains'], (result) => {
      const tabDomains = result.tabDomains || {};
      const usedDomains = new Set(Object.values(tabDomains));
      
      for (let i = 1; i <= MAX_INSTANCES; i++) {
        const domain = `wa${i}.localhost`;
        if (!usedDomains.has(domain)) {
          resolve(domain);
          return;
        }
      }
      resolve(null);
    });
  });
}

// Función para asignar dominio a una pestaña
async function assignDomainToTab(tabId, domain) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['tabDomains'], (result) => {
      const tabDomains = result.tabDomains || {};
      tabDomains[tabId] = domain;
      chrome.storage.local.set({ tabDomains }, () => {
        resolve();
      });
    });
  });
}

// Abrir nueva instancia
async function openNewInstance(domain) {
  if (!domain) {
    domain = await getNextAvailableDomain();
  }
  
  if (domain) {
    const tab = await chrome.tabs.create({
      url: `https://${domain}:${PROXY_PORT}`
    });
    
    // Asignar dominio a la nueva pestaña
    await assignDomainToTab(tab.id, domain);
    
    return tab;
  } else {
    console.warn('Todas las instancias están en uso');
    return null;
  }
}

// Escuchar mensajes del content script y popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openInstance') {
    openNewInstance(request.domain).then(tab => {
      sendResponse({ success: !!tab });
    });
    return true; // Mantener el canal abierto para respuesta asíncrona
  }
  
  if (request.action === 'getNextDomain') {
    getNextAvailableDomain().then(domain => {
      sendResponse({ domain: domain });
    });
    return true; // Mantener el canal abierto para respuesta asíncrona
  }
});

// Manejar clics en el icono de la extensión (si no hay popup)
chrome.action.onClicked.addListener(async (tab) => {
  // Si hay popup definido, esto no se ejecutará
  // Pero lo dejamos por si acaso
  await openNewInstance();
});

// Limpiar instancias cuando se cierra una pestaña
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(['tabDomains'], (result) => {
    const tabDomains = result.tabDomains || {};
    if (tabDomains[tabId]) {
      delete tabDomains[tabId];
      chrome.storage.local.set({ tabDomains });
    }
  });
});

// Limpiar dominios de pestañas que ya no existen al iniciar
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['tabDomains'], (result) => {
    const tabDomains = result.tabDomains || {};
    chrome.tabs.query({}, (tabs) => {
      const existingTabIds = new Set(tabs.map(t => t.id));
      let changed = false;
      
      for (const tabId in tabDomains) {
        if (!existingTabIds.has(parseInt(tabId))) {
          delete tabDomains[tabId];
          changed = true;
        }
      }
      
      if (changed) {
        chrome.storage.local.set({ tabDomains });
      }
    });
  });
});

