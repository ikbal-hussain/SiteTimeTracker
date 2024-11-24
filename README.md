# Site Time Tracker Chrome Extension

## Overview
Site Time Tracker is a Chrome extension that tracks the time you spend on various websites. It provides daily and weekly insights into your browsing habits, allows you to set productivity goals, and export your usage data. Additionally, it includes a bar graph for visual representation of your daily activity.

---

## Features
- **Daily Time Tracking**: View the time spent on websites for the current day.
- **Weekly History**: Switch to view weekly history data of site usage.
- **Set Daily Goal**: Input a daily productivity goal and get notified upon setting it.
- **Export Data**: Export your browsing data in CSV format.
- **Bar Graph Visualization**: Visual representation of your daily usage using a bar graph powered by Chart.js.

---

## Usage Instructions

### 1. Installation
1. Clone or download the repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle on the top-right corner).
4. Click on **Load unpacked** and select the folder containing the extension files.

### 2. How to Use
- **View Today's Data**: By default, the extension displays today's site usage.
- **Toggle Weekly History**: Click the "View Weekly History" button to switch between daily and weekly data.
- **Set Daily Goal**:
  1. Enter your daily goal in minutes in the input box provided.
  2. The goal is saved, and you'll receive confirmation.
- **Export Data**:
  1. Click the "Export Data" button to download a CSV file with your site usage history.
- **View Graph**: A bar graph displays the time spent (in minutes) on different websites for the current day.

---

## File Structure
- **HTML**: UI structure for the extension popup.
- **JavaScript**: Core functionality, including data fetching, rendering, and exporting.
- **CSS**: Styles for the extension UI.
- **Manifest.json**: Metadata and permissions for the Chrome extension.

---

## Technologies Used
- **Chrome Storage API**: To store and retrieve time-tracking data.
- **Chart.js**: For rendering the bar graph visualization.
- **JavaScript**: Core functionality and event handling.

---

## Permissions
The extension requires the following permissions:
- `storage`: To store and retrieve usage data.
- `activeTab`: To track time spent on the currently active tab.

---

## Future Improvements
- Add notifications when daily goals are exceeded.
- Include a pie chart for weekly usage distribution.
- Provide customization options for time tracking.

---

## Contribution
Feel free to fork the repository, submit issues, or create pull requests to enhance the extension.

---

## License
This project is licensed under the MIT License.
