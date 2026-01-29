const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const result = document.getElementById("result");
const calcBtn = document.getElementById("calc");
const clearBtn = document.getElementById("clear");

// core calculate
function calculate() {
  const a = parseFloat(amount.value);
  const r = parseFloat(rate.value);

  if (!isFinite(a)) {
    result.textContent = "";
    return;
  }

  const gst = a * r / 100;
  const total = a + gst;

  result.textContent =
    `GST: ${gst.toFixed(2)} | Total: ${total.toFixed(2)}`;
}

// auto calculate on typing
amount.addEventListener("input", calculate);
rate.addEventListener("change", calculate);

// button calculate
calcBtn.addEventListener("click", calculate);

// clear
clearBtn.addEventListener("click", () => {
  amount.value = "";
  result.textContent = "";
});

// 🔴 prevent mobile scroll jump
amount.addEventListener("focus", () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, 50);
});
