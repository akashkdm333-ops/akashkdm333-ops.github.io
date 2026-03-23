const amountInput = document.getElementById("amount");
const rateSelect = document.getElementById("rate");
const typeSelect = document.getElementById("type");
const modeSelect = document.getElementById("mode");
const resultDiv = document.getElementById("result");

function calculate() {
  const amount = parseFloat(amountInput.value);
  const rate = parseFloat(rateSelect.value);

  if (!amount || amount <= 0) {
    resultDiv.innerHTML = "";
    return;
  }

  let base, gst, total;

  if (modeSelect.value === "exclusive") {
    base = amount;
    gst = base * rate / 100;
    total = base + gst;
  } else {
    total = amount;
    base = total / (1 + rate / 100);
    gst = total - base;
  }

  let html = `
    Base: ₹${base.toFixed(2)}<br>
    GST: ₹${gst.toFixed(2)}<br>
  `;

  if (typeSelect.value === "intra") {
    html += `CGST: ₹${(gst/2).toFixed(2)}<br>
             SGST: ₹${(gst/2).toFixed(2)}<br>`;
  } else {
    html += `IGST: ₹${gst.toFixed(2)}<br>`;
  }

  html += `<b>Total: ₹${total.toFixed(2)}</b>`;

  resultDiv.innerHTML = html;
}

/* 🔥 AUTO EVENTS */
amountInput.addEventListener("input", calculate);
rateSelect.addEventListener("change", calculate);
typeSelect.addEventListener("change", calculate);
modeSelect.addEventListener("change", calculate);

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // 🔥 AUTO SHOW POPUP after 2 sec
  setTimeout(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    }
  }, 2000);
});
