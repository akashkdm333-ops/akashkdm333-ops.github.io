const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const gstOut = document.getElementById("gst");
const totalOut = document.getElementById("total");
const clearBtn = document.getElementById("clearBtn");
const calcBtn = document.getElementById("calcBtn");

function calculate(){
  const a = parseFloat(amount.value) || 0;
  const r = parseFloat(rate.value);

  const gst = a * r / 100;
  const total = a + gst;

  gstOut.textContent = gst.toFixed(2);
  totalOut.textContent = total.toFixed(2);
}

/* Auto calc for mobile + PC */
["input","keyup","change"].forEach(e=>{
  amount.addEventListener(e, calculate);
  rate.addEventListener(e, calculate);
});

calcBtn.addEventListener("click", calculate);

clearBtn.addEventListener("click", ()=>{
  amount.value="";
  gstOut.textContent="0";
  totalOut.textContent="0";
  amount.focus();
});

/* keyboard jump protection */
window.addEventListener("resize", ()=>{
  document.body.style.minHeight = window.innerHeight + "px";
});

/* optional service worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("sw.js");
}
