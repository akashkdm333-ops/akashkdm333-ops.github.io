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

  if(!box) return;

  box.innerHTML = history.map(h => `
    <div>₹${h.amount} → ₹${h.total}</div>
  `).join("");
}
