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
  let total = amount + gst;
  let html = "";

  if (typeSelect.value === "intra") {
    const cgst = gst / 2;
    const sgst = gst / 2;

    html = `
      Base: ₹${amount.toFixed(2)}<br>
      CGST: ₹${cgst.toFixed(2)}<br>
      SGST: ₹${sgst.toFixed(2)}<br>
      Total: ₹${total.toFixed(2)}
    `;
  } else {
    html = `
      Base: ₹${amount.toFixed(2)}<br>
      IGST: ₹${gst.toFixed(2)}<br>
      Total: ₹${total.toFixed(2)}
    `;
  }

  resultDiv.innerHTML = html;

  saveHistory({
    amount: amount,
    total: total.toFixed(2)
  });
}

calcBtn.addEventListener("click", calculate);

clearBtn.addEventListener("click", () => {
  amountInput.value = "";
  resultDiv.innerHTML = "";
  localStorage.removeItem("gst_history");
  renderHistory();
});

function saveHistory(data){
  let history = JSON.parse(localStorage.getItem("gst_history")) || [];
  history.unshift(data);
  history = history.slice(0,5);
  localStorage.setItem("gst_history", JSON.stringify(history));
  renderHistory();
}

function renderHistory(){
  const history = JSON.parse(localStorage.getItem("gst_history")) || [];
  const box = document.getElementById("history");

  box.innerHTML = history.map(h => `
    <div>₹${h.amount} → ₹${h.total}</div>
  `).join("");
}

renderHistory();

/* INSTALL BUTTON */
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", async () => {
  deferredPrompt.prompt();
  deferredPrompt = null;
});
