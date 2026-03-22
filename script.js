const amountInput = document.getElementById("amount");
const rateSelect = document.getElementById("rate");
const typeSelect = document.getElementById("type");
const modeSelect = document.getElementById("mode");
const calcBtn = document.getElementById("calc");
const clearBtn = document.getElementById("clear");
const resultDiv = document.getElementById("result");

function calculate() {
  const amount = parseFloat(amountInput.value);
  const rate = parseFloat(rateSelect.value);

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML = "Enter valid amount";
    return;
  }

  let base = 0, gst = 0, total = 0;

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
    <b>Base Price:</b> ₹${base.toFixed(2)}<br>
    <b>GST (${rate}%):</b> ₹${gst.toFixed(2)}<br>
  `;

  if (typeSelect.value === "intra") {
    const cgst = gst / 2;
    const sgst = gst / 2;

    html += `
      <b>CGST:</b> ₹${cgst.toFixed(2)}<br>
      <b>SGST:</b> ₹${sgst.toFixed(2)}<br>
    `;
  } else {
    html += `<b>IGST:</b> ₹${gst.toFixed(2)}<br>`;
  }

  html += `<b>Total:</b> ₹${total.toFixed(2)}`;

  resultDiv.innerHTML = html;
}

calcBtn.addEventListener("click", calculate);

clearBtn.addEventListener("click", () => {
  amountInput.value = "";
  resultDiv.innerHTML = "";
});
