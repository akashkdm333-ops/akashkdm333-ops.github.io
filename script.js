document.addEventListener("DOMContentLoaded", () => {

const amount = document.getElementById("amount");
const rate = document.getElementById("gstRate");
const result = document.getElementById("resultContent");
const clear = document.getElementById("clear");
const calcBtn = document.getElementById("calculate");

function calculate() {
const val = parseFloat(amount.value);
const r = parseFloat(rate.value);

if (!val) {
result.innerHTML = `<p class="muted">Enter values to calculate.</p>`;
return;
}

let gst = val * r / 100;
let total = val + gst;

result.innerHTML = `
<div class="result-row"><div>Base price</div><div>${val.toFixed(2)}</div></div>
<div class="result-row"><div>GST</div><div>${gst.toFixed(2)}</div></div>
<div class="result-row"><div>Total</div><div>${total.toFixed(2)}</div></div>
`;
}

amount.addEventListener("input", calculate);
rate.addEventListener("change", calculate);
calcBtn.addEventListener("click", calculate);

clear.addEventListener("click", () => {
amount.value = "";
result.innerHTML = `<p class="muted">Enter values to calculate.</p>`;
});

});

/* ===== MOBILE SCREEN JUMP FIX ===== */

let vh = window.innerHeight;

function lockViewport() {
document.documentElement.style.height = vh + "px";
document.body.style.height = vh + "px";
}

window.addEventListener("resize", () => {
const diff = Math.abs(window.innerHeight - vh);
if (diff > 150) return;
vh = window.innerHeight;
lockViewport();
});

lockViewport();

/* ===== PWA ===== */

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("sw.js");
}
