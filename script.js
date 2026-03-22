const amountInput = document.getElementById("amount");
const rateSelect = document.getElementById("rate");
const typeSelect = document.getElementById("type");
const modeSelect = document.getElementById("mode");
const resultDiv = document.getElementById("result");

function calculate() {
  const amount = parseFloat(amountInput.value);
  const rate = parseFloat(rateSelect.value);

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML = "";
    return;
  }

  let base = 0, gst = 0, total = 0;

  if (modeSelect.value === "exclusive") {
    base = amount;
    gst = (base * rate) / 100;
    total = base + gst;
  } else {
    total = amount;
    base = total / (1 + rate / 100);
    gst = total - base;
  }

  let output = `
    <b>Base Price:</b> ₹${base.toFixed(2)}<br>
    <b>GST (${rate}%):</b> ₹${gst.toFixed(2)}<br>
  `;

  if (typeSelect.value === "intra") {
    const cgst = gst / 2;
    const sgst = gst / 2;

    output += `
      <b>CGST:</b> ₹${cgst.toFixed(2)}<br>
      <b>SGST:</b> ₹${sgst.toFixed(2)}<br>
    `;
  } else {
    output += `<b>IGST:</b> ₹${gst.toFixed(2)}<br>`;
  }

  output += `<b>Total:</b> ₹${total.toFixed(2)}`;

  resultDiv.innerHTML = output;
}

function clearAll() {
  amountInput.value = "";
  resultDiv.innerHTML = "";
}

/* 🔥 AUTO EVENTS */

// typing pe
amountInput.addEventListener("input", calculate);

// dropdown change pe
rateSelect.addEventListener("change", calculate);
typeSelect.addEventListener("change", calculate);
modeSelect.addEventListener("change", calculate);

/* optional clear button */
const clearBtn = document.getElementById("clear");
if (clearBtn) {
  clearBtn.addEventListener("click", clearAll);
}
