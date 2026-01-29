const amountInput = document.getElementById("amount");
const rateSelect = document.getElementById("rate");
const typeSelect = document.getElementById("type");
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

  const gst = amount * rate / 100;
  let html = "";

  if (typeSelect.value === "intra") {
    const cgst = gst / 2;
    const sgst = gst / 2;
    const total = amount + gst;

    html = `
      <b>Base Price:</b> ₹${amount.toFixed(2)}<br>
      <b>CGST:</b> ₹${cgst.toFixed(2)}<br>
      <b>SGST:</b> ₹${sgst.toFixed(2)}<br>
      <b>Total:</b> ₹${total.toFixed(2)}
    `;
  } else {
    const total = amount + gst;

    html = `
      <b>Base Price:</b> ₹${amount.toFixed(2)}<br>
      <b>IGST:</b> ₹${gst.toFixed(2)}<br>
      <b>Total:</b> ₹${total.toFixed(2)}
    `;
  }

  resultDiv.innerHTML = html;
}

calcBtn.addEventListener("click", calculate);

clearBtn.addEventListener("click", () => {
  amountInput.value = "";
  resultDiv.innerHTML = "";
});
