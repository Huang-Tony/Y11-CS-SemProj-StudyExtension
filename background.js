// Initialize allowlist and blocklist
let allowlist = [];
let blocklist = [];

// Load allowlist and blocklist from storage on extension startup
chrome.storage.local.get(["allowlist", "blocklist","activeList"], (data) => {
  allowlist = data.allowlist || [];
  blocklist = data.blocklist || [];
  activeList = data.activeList || "blocklist";
  console.log("Loaded blocklist: ", blocklist);
  console.log("Loaded allowlist: ", allowlist);
  console.log("ee");
  console.log(activeList);
  console.log("eeee");
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
    if (changes.activeList) {
      activeList = changes.activeList.newValue || "blocklist";
      console.log("Updated activeList:", activeList);
    }
  }
});

// Listen for changes in any tab's URL (e.g., when the user navigates to a new page)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    // Ensure the tab has finished loading and has a valid URL
    // if (changeInfo.status === "complete" && tab.url) {
      const url = new URL(tab.url);

      // Prevent redirection of the "goBackToWork.html" page itself
      if (url.pathname === "/goBackToWork.html") {
        console.log("Skipping redirection for goBackToWork.html");
        return;
      }

      if (activeList === "blocklist") {
        // Blocklist logic: Redirect if the hostname matches any entry in the blocklist
        for (let blockedUrl of blocklist) {
          if (url.hostname.includes(blockedUrl)) {
            chrome.tabs.update(tabId, { url: "goBackToWork.html" });
            console.log(`Redirected to goBackToWork.html due to blocklist entry: ${blockedUrl}`);
            return; // Prevent multiple redirects for the same URL
          }
        }
      } else if (activeList === "allowlist") {
        // Allowlist logic: Redirect if the hostname is NOT in the allowlist
        let isAllowed = allowlist.some((allowedUrl) => url.hostname.includes(allowedUrl));
        if (!isAllowed) {
          chrome.tabs.update(tabId, { url: "goBackToWork.html" });
          console.log(`Redirected to goBackToWork.html because ${url.hostname} is not in the allowlist.`);
          return;
        } else {
          console.log(`Allowed access to ${url.hostname} as it matches the allowlist.`);
        }
      // }
    }
  } catch (error) {
    console.error("Error in tab update listener:", error);
  }
});