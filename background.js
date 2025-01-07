// Initialize allowlist and blocklist
let allowlist = [];
let blocklist = [];

// Load allowlist and blocklist from storage on extension startup
chrome.storage.local.get(["allowlist", "blocklist"], (data) => {
  allowlist = data.allowlist || [];
  blocklist = data.blocklist || [];
  console.log("Loaded blocklist:", blocklist);
  console.log("Loaded allowlist:", allowlist);
});

// Listen for changes in `chrome.storage` to dynamically update the allowlist and blocklist
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes.allowlist) {
      allowlist = changes.allowlist.newValue || [];
      console.log("Updated allowlist:", allowlist);
    }
    if (changes.blocklist) {
      blocklist = changes.blocklist.newValue || [];
      console.log("Updated blocklist:", blocklist);
    }
  }
});

// Listen for changes in any tab's URL (e.g., when the user navigates to a new page)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab has finished loading and has a valid URL
  if (changeInfo.status === "complete" && tab.url) {
    try {
      // Parse the URL and check if it matches any entry in the blocklist
      const url = new URL(tab.url);
      for (let a = 0; a < blocklist.length; a++) {
        if (url.hostname.includes(blocklist[a])) {
          chrome.tabs.update(tabId, { url: "goBackToWork.html" });
          console.log(`Redirected to goBackToWork.html due to blocklist entry: ${blocklist[a]}`);
          break; // Prevent multiple redirects for the same URL
        }
      }
    } catch (error) {
      console.error("Error parsing URL:", error);
    }
  }
});