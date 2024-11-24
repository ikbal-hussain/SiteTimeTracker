const tableBody = document.querySelector("#timeTable tbody");
const toggleButton = document.querySelector("#toggleHistory");
let showingHistory = false;


function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = (minutes / 60).toFixed(1);
  return `${hours}h`;
}

function loadDailyData() {
  chrome.storage.local.get("timeData", (data) => {
    const timeData = data.timeData || {};
    renderTable(timeData);
  });
}


function loadHistory() {
  chrome.storage.local.get("history", (data) => {
    const history = data.history || {};
    renderTable(history, true);
  });
}


function renderTable(data, isHistory = false) {
  tableBody.innerHTML = "";

  // Sort entries by time in descending order
  const sortedEntries = Object.entries(data).sort((a, b) => {
    const timeA = isHistory
      ? Object.values(a[1]).reduce((sum, ms) => sum + ms, 0) // Sum all site times for history
      : a[1]; // Single value for daily data
    const timeB = isHistory
      ? Object.values(b[1]).reduce((sum, ms) => sum + ms, 0)
      : b[1];
    return timeB - timeA; // Descending order
  });

  // Render sorted entries
  sortedEntries.forEach(([key, value]) => {
    const row = document.createElement("tr");
    const time = isHistory
      ? Object.entries(value)
          .map(([site, ms]) => `${site}: ${formatTime(ms)}`)
          .join("<br>")
      : formatTime(value);
    row.innerHTML = `<td>${key}</td><td>${time}</td>`;
    tableBody.appendChild(row);
  });
}



toggleButton.addEventListener("click", () => {
  showingHistory = !showingHistory;
  toggleButton.textContent = showingHistory ? "View Today's Data" : "View Weekly History";
  showingHistory ? loadHistory() : loadDailyData();
});


loadDailyData();

const exportButton = document.createElement("button");
exportButton.textContent = "Export Data";
exportButton.style.margin = "10px 0";
document.body.appendChild(exportButton);

const goalInput = document.createElement("input");
goalInput.type = "number";
goalInput.placeholder = "Set Daily Goal (mins)";
goalInput.style.margin = "10px 0";
document.body.appendChild(goalInput);

const graphContainer = document.createElement("div");
graphContainer.id = "graphContainer";
document.body.appendChild(graphContainer);

exportButton.addEventListener("click", exportData);
goalInput.addEventListener("change", setDailyGoal);


function exportData() {
  chrome.storage.local.get("history", (data) => {
    const history = data.history || {};
    const rows = [["Date", "Site", "Time Spent"]];

    Object.entries(history).forEach(([date, sites]) => {
      Object.entries(sites).forEach(([site, time]) => {
        rows.push([date, site, formatTime(time)]);
      });
    });

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SiteTimeTracker.csv";
    a.click();
  });
}

// daily productivity goal
function setDailyGoal() {
  const minutes = parseInt(goalInput.value, 10);
  if (!isNaN(minutes)) {
    chrome.storage.local.set({ dailyLimit: minutes * 60000 });
    alert(`Daily goal set to ${minutes} minutes`);
  }
}

// bar graph
function loadGraph() {
  chrome.storage.local.get("timeData", (data) => {
    const timeData = data.timeData || {};
    const labels = Object.keys(timeData);
    const values = Object.values(timeData).map((ms) => Math.floor(ms / 60000)); // Convert to minutes

    renderBarGraph(labels, values);
  });
}

// bar graph using Chart.js
function renderBarGraph(labels, values) {
  const canvas = document.createElement("canvas");
  graphContainer.innerHTML = ""; // Clear previous graph
  graphContainer.appendChild(canvas);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Time Spent (mins)",
        data: values,
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

// Initial load
loadGraph();
