let currentSite = null;
let startTime = null;
let timeData = {};
let history = {}; 


chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["timeData", "history"], (data) => {
    timeData = data.timeData || {};
    history = data.history || {};
  });
});


chrome.tabs.onActivated.addListener(async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  switchSite(tab[0]?.url);
});


chrome.tabs.onUpdated.addListener(async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  switchSite(tab[0]?.url);
});


chrome.idle.onStateChanged.addListener((state) => {
  if (state === "idle" || state === "locked") {
    switchSite(null);
  }
});


function switchSite(url) {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  if (!history[today]) {
    history[today] = {};
    pruneHistory(); 
  }

  if (currentSite && startTime) {
    const timeSpent = now - startTime;
    if (!timeData[currentSite]) timeData[currentSite] = 0;
    timeData[currentSite] += timeSpent;
    history[today][currentSite] = timeData[currentSite];
    chrome.storage.local.set({ timeData, history });
  }

  currentSite = url ? extractHostname(url) : null;
  startTime = url ? now : null;

  resetDailyDataIfNeeded();
}


function resetDailyDataIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  chrome.storage.local.get("lastReset", (data) => {
    const lastReset = data.lastReset || today;
    if (lastReset !== today) {
      chrome.storage.local.set({ lastReset: today, timeData: {} });
      timeData = {};
    }
  });
}


function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}


function pruneHistory() {
  const dates = Object.keys(history).sort().reverse();
  while (dates.length > 7) {
    delete history[dates.pop()];
  }
  chrome.storage.local.set({ history });
}



let alertsEnabled = true; 
let dailyLimit = 3600000; 


setInterval(() => {
  if (!alertsEnabled) return;

  const today = new Date().toISOString().slice(0, 10);
  chrome.storage.local.get(["timeData", "history"], (data) => {
    const timeData = data.timeData || {};
    const history = data.history || {};
    const totalToday = Object.values(timeData).reduce((sum, time) => sum + time, 0);

    if (totalToday > dailyLimit) {
      notify("You've exceeded your daily browsing limit!", `Total time spent today: ${formatTime(totalToday)}`);
    }
  });
}, 30000); 


function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/SiteTimeTrackerLogo.PNG", 
    title,
    message,
  });
}


function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = (minutes / 60).toFixed(1);
  return `${hours}h`;
}



chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("checkUsage", { periodInMinutes: 1 }); 
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkUsage") {
    monitorBrowsingUsage();
  }
});


function monitorBrowsingUsage() {
  const today = new Date().toISOString().slice(0, 10);

  chrome.storage.local.get(["timeData", "history"], (data) => {
    const timeData = data.timeData || {};
    const totalToday = Object.values(timeData).reduce((sum, time) => sum + time, 0);

    if (totalToday > dailyLimit) {
      notify("Daily Limit Exceeded", `Total browsing time today: ${formatTime(totalToday)}`);
    }
  });
}
