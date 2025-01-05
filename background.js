// Initialize allowlist and blocklist
let allowlist = [];
let blocklist = [];

// Load allowlist and blocklist from storage
chrome.storage.local.get(["allowlist", "blocklist"], (data) => {
  allowlist = data.allowlist || [];
  blocklist = data.blocklist || [];
});

// Listener for storage changes to keep allowlist and blocklist updated
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.allowlist) {
      allowlist = changes.allowlist.newValue || [];
    }
    if (changes.blocklist) {
      blocklist = changes.blocklist.newValue || [];
    }
  }
});

// Function to check if a URL should be blocked
function shouldBlock(url) {
  const currentUrl = new URL(url).hostname;
  return blocklist.some((blockedUrl) => currentUrl.includes(blockedUrl));
}

// Redirect new tabs if they are in the blocklist
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && shouldBlock(tab.url)) {
    chrome.tabs.update(tab.id, { url: "getToWork.html" });
  }
});

// Redirect updated tabs if they are in the blocklist
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && shouldBlock(changeInfo.url)) {
    chrome.tabs.update(tabId, { url: "getToWork.html" });
  }
});