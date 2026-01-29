const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const gstOut = document.getElementById("gst");
const totalOut = document.getElementById("total");
const clearBtn = document.getElementById("clearBtn");
const modes = document.querySelectorAll('input[name="mode"]');

function getMode(){
  return document.querySelector('input[name="mode"]:checked').value;
}

function calculate(){
  const a = parseFloat(amount.value) || 0;
  const r = parseFloat(rate.value);

  let gst = 0;
  let total = 0;

  if(getMode() === "add"){
    gst = a * r / 100;
    total = a + gst;
  } else {
    gst = a - (a / (1 + r/100));
    total = a - gst;
  }

  gstOut.textContent = gst.toFixed(2);
  totalOut.textContent = total.toFixed(2);
}

/* auto calculation */
["input","keyup","change"].forEach(evt=>{
  amount.addEventListener(evt, calculate);
  rate.addEventListener(evt, calculate);
});

modes.forEach(m=>{
  m.addEventListener("change", calculate);
});

/* clear */
clearBtn.addEventListener("click", ()=>{
  amount.value="";
  gstOut.textContent="0.00";
  totalOut.textContent="0.00";
  amount.focus();
});

/* keyboard jump protection */
function lockHeight(){
  document.body.style.minHeight = window.innerHeight + "px";
}
window.addEventListener("resize", lockHeight);
lockHeight();

/* service worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

