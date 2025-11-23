// popup.js
const MAX_INSTANCES = 10;
const PROXY_PORT = 8443;

const instancesDiv = document.getElementById('instances');
const statusDiv = document.getElementById('status');

// Crear botones para cada instancia
for (let i = 1; i <= MAX_INSTANCES; i++) {
  const btn = document.createElement('button');
  btn.className = 'instance-btn';
  btn.textContent = `Abrir WhatsApp Web ${i} (wa${i}.localhost)`;
  btn.onclick = () => {
    chrome.tabs.create({
      url: `https://wa${i}.localhost:${PROXY_PORT}`
    });
    window.close();
  };
  instancesDiv.appendChild(btn);
}

// Verificar estado del proxy (opcional)
chrome.storage.local.get(['tabDomains'], (result) => {
  const tabDomains = result.tabDomains || {};
  const activeCount = Object.keys(tabDomains).length;
  
  if (activeCount > 0) {
    statusDiv.textContent = `${activeCount} instancia(s) activa(s)`;
    statusDiv.style.background = '#d4edda';
    statusDiv.style.color = '#155724';
  }
});

