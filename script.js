// GST Calculator script — live updates with CGST/SGST split, currency selection, and configurable debounce
document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('amount');
  const gstRateSelect = document.getElementById('gstRate');
  const customRateInput = document.getElementById('customRate');
  const calculateBtn = document.getElementById('calculate');
  const clearBtn = document.getElementById('clear');
  const results = document.getElementById('resultContent');
  const copyBtn = document.getElementById('copyResult');
  const form = document.getElementById('gstForm');

  const currencySelect = document.getElementById('currency');
  const debounceRange = document.getElementById('debounceRange');
  const debounceNumber = document.getElementById('debounceNumber');

  // Locale map to pair with currency for Intl formatting
  const currencyLocales = {
    'INR': 'en-IN',
    'USD': 'en-US',
    'EUR': 'en-IE',
    'GBP': 'en-GB',
    'AUD': 'en-AU'
  };

  // Helper: format according to selected currency or as plain number
  function formatMoney(value) {
    const cur = currencySelect.value;
    if (!isFinite(value)) return '-';
    if (cur === 'NONE') {
      return Number(value).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
    }
    const locale = currencyLocales[cur] || undefined;
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: cur,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(value));
    } catch (e) {
      // Fallback to plain number formatting
      return Number(value).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
    }
  }

  // Read selected mode (exclusive or inclusive)
  function getMode() {
    const mode = form.elements['mode'];
    for (const r of mode) if (r.checked) return r.value;
    return 'exclusive';
  }

  // Get GST rate (handles custom)
  function getRate() {
    if (gstRateSelect.value === 'custom') {
      const r = parseFloat(customRateInput.value);
      return (isFinite(r) && r >= 0) ? r : NaN;
    }
    const r = parseFloat(gstRateSelect.value);
    return (isFinite(r) && r >= 0) ? r : NaN;
  }

  // Show/hide custom rate input
  gstRateSelect.addEventListener('change', () => {
    if (gstRateSelect.value === 'custom') {
      customRateInput.classList.remove('hidden');
      customRateInput.focus();
    } else {
      customRateInput.classList.add('hidden');
      customRateInput.value = '';
    }
    scheduleCalc();
  });

  // Sync debounce range and number inputs
  function setDebounceValue(v) {
    debounceRange.value = v;
    debounceNumber.value = v;
  }
  debounceRange.addEventListener('input', () => {
    debounceNumber.value = debounceRange.value;
    scheduleCalc();
  });
  debounceNumber.addEventListener('input', () => {
    let v = Number(debounceNumber.value);
    if (!isFinite(v) || v < 0) v = 0;
    if (v > 2000) v = 2000;
    setDebounceValue(v);
    scheduleCalc();
  });

  // Calculate and render results
  function calculate() {
    const rawAmount = parseFloat(amountInput.value);
    if (!isFinite(rawAmount) || rawAmount < 0) {
      results.innerHTML = `<p class="muted">Please enter a valid non-negative amount.</p>`;
      copyBtn.classList.add('hidden');
      return;
    }

    const rate = getRate();
    if (!isFinite(rate) || rate < 0) {
      if (gstRateSelect.value === 'custom') {
        results.innerHTML = `<p class="muted">Please enter a valid non-negative custom GST rate.</p>`;
      } else {
        results.innerHTML = `<p class="muted">Please select a valid GST rate.</p>`;
      }
      copyBtn.classList.add('hidden');
      return;
    }

    const mode = getMode();
    let html = '';

    if (mode === 'exclusive') {
      const base = rawAmount;
      const gst = base * (rate / 100);
      const cgst = gst / 2;
      const sgst = gst / 2;
      const total = base + gst;

      html += `<div class="result-row"><div>GST rate</div><div class="value">${rate}%</div></div>`;
      html += `<div class="result-row"><div>Base price</div><div class="value">${formatMoney(base)}</div></div>`;
      html += `<div class="result-row"><div>GST amount</div><div class="value">${formatMoney(gst)}</div></div>`;
      html += `<div class="result-row"><div> - CGST</div><div class="value">${formatMoney(cgst)}</div></div>`;
      html += `<div class="result-row"><div> - SGST</div><div class="value">${formatMoney(sgst)}</div></div>`;
      html += `<div class="result-row"><div>Total price (incl. GST)</div><div class="value">${formatMoney(total)}</div></div>`;

      results.innerHTML = html;
      copyBtn.classList.remove('hidden');
      copyBtn.disabled = false;
      copyBtn.dataset.text = `Base: ${formatMoney(base)} | GST ${rate}%: ${formatMoney(gst)} (CGST ${formatMoney(cgst)}, SGST ${formatMoney(sgst)}) | Total: ${formatMoney(total)}`;
    } else {
      const total = rawAmount;
      const base = total / (1 + rate / 100);
      const gst = total - base;
      const cgst = gst / 2;
      const sgst = gst / 2;

      html += `<div class="result-row"><div>GST rate</div><div class="value">${rate}%</div></div>`;
      html += `<div class="result-row"><div>Total price (incl. GST)</div><div class="value">${formatMoney(total)}</div></div>`;
      html += `<div class="result-row"><div>Base price (excl. GST)</div><div class="value">${formatMoney(base)}</div></div>`;
      html += `<div class="result-row"><div>GST amount</div><div class="value">${formatMoney(gst)}</div></div>`;
      html += `<div class="result-row"><div> - CGST</div><div class="value">${formatMoney(cgst)}</div></div>`;
      html += `<div class="result-row"><div> - SGST</div><div class="value">${formatMoney(sgst)}</div></div>`;

      results.innerHTML = html;
      copyBtn.classList.remove('hidden');
      copyBtn.disabled = false;
      copyBtn.dataset.text = `Total: ${formatMoney(total)} | GST ${rate}%: ${formatMoney(gst)} (CGST ${formatMoney(cgst)}, SGST ${formatMoney(sgst)}) | Base: ${formatMoney(base)}`;
    }
  }

  // Debounce scheduling for live typing (uses configured delay)
  let liveTimer = null;
  function scheduleCalc(delayOverride = null) {
    const delay = (delayOverride !== null) ? delayOverride : Number(debounceRange.value) || 0;
    if (liveTimer) clearTimeout(liveTimer);
    if (delay === 0) {
      // immediate
      calculate();
      return;
    }
    liveTimer = setTimeout(() => {
      calculate();
      liveTimer = null;
    }, delay);
  }

  // Input/change listeners for live calculation
  amountInput.addEventListener('input', () => scheduleCalc());
  customRateInput.addEventListener('input', () => scheduleCalc());
  currencySelect.addEventListener('change', () => scheduleCalc());
  // rate change already schedules in its change listener above
  const modeRadios = form.elements['mode'];
  for (const r of modeRadios) {
    r.addEventListener('change', () => scheduleCalc());
  }

  // Buttons: explicit calculate / clear
  calculateBtn.addEventListener('click', () => {
    // immediate calculation regardless of debounce
    if (liveTimer) { clearTimeout(liveTimer); liveTimer = null; }
    calculate();
  });
  clearBtn.addEventListener('click', () => {
    amountInput.value = '';
    gstRateSelect.value = '18';
    customRateInput.value = '';
    customRateInput.classList.add('hidden');
    form.elements['mode'][0].checked = true;
    currencySelect.value = 'NONE';
    setDebounceValue(150);
    results.innerHTML = `<p class="muted">Enter values and results will update live.</p>`;
    copyBtn.classList.add('hidden');
  });

  // Copy result text to clipboard
  copyBtn.addEventListener('click', async () => {
    const text = copyBtn.dataset.text || results.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
    } catch (e) {
      copyBtn.textContent = 'Copy failed';
      setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
    }
  });

  // Prevent form submit (Enter)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (liveTimer) { clearTimeout(liveTimer); liveTimer = null; }
    calculate();
  });

  // Initial setup & calculation
  function init() {
    // initialize debounce controls
    setDebounceValue(Number(debounceRange.value) || 150);
    scheduleCalc(0); // initial immediate render
  }

  init();
});

// ===== PWA Service Worker Register =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.error("SW error", err));
  });
}

/* ================================
   FORCE PWA INSTALL LOGIC
================================ */

let deferredPrompt = null;

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("✅ Service Worker registered"))
      .catch(err => console.error("❌ SW registration failed:", err));
  });
}

// Capture install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();           // stop auto mini-infobar
  deferredPrompt = e;
  console.log("💡 PWA install available");

  // Optional: auto-show install button
  showInstallButton();
});

// Create & show Install button
function showInstallButton() {
  if (document.getElementById("pwa-install-btn")) return;

  const btn = document.createElement("button");
  btn.id = "pwa-install-btn";
  btn.innerText = "📲 Install App";
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 18px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 6px 18px rgba(0,0,0,.25);
  `;

  btn.onclick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("📦 Install choice:", choice.outcome);

    deferredPrompt = null;
    btn.remove();
  };

  document.body.appendChild(btn);
}

// Hide button after install
window.addEventListener("appinstalled", () => {
  console.log("🎉 PWA installed successfully");
  const btn = document.getElementById("pwa-install-btn");
  if (btn) btn.remove();
});
