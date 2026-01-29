const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const type = document.getElementById("type");
const result = document.getElementById("result");
const calcBtn = document.getElementById("calc");
const clearBtn = document.getElementById("clear");

function money(v){
  return "₹ " + v.toFixed(2);
}

function calculate() {
  const a = parseFloat(amount.value);
  const r = parseFloat(rate.value);

  if (!isFinite(a)) {
    result.innerHTML = "";
    return;
  }

  const gst = a * r / 100;

  if(type.value === "intra"){
    const cgst = gst / 2;
    const sgst = gst / 2;
    const total = a + gst;

    result.innerHTML = `
      Base Amount: ${money(a)}<br>
      CGST: ${money(cgst)}<br>
      SGST: ${money(sgst)}<br>
      Total GST: ${money(gst)}<br>
      <b>Total Invoice: ${money(total)}</b>
    `;
  }
  else{
    const total = a + gst;

    result.innerHTML = `
      Base Amount: ${money(a)}<br>
      IGST: ${money(gst)}<br>
      <b>Total Invoice: ${money(total)}</b>
    `;
  }
}

// auto calculate
amount.addEventListener("input", calculate);
rate.addEventListener("change", calculate);
type.addEventListener("change", calculate);

calcBtn.addEventListener("click", calculate);

clearBtn.addEventListener("click", () => {
  amount.value = "";
  result.innerHTML = "";
});

// mobile scroll fix
amount.addEventListener("focus", () => {
  setTimeout(() => window.scrollTo(0,0), 50);
});
