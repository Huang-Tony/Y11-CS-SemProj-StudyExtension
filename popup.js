//logic for allowing and blocking tabs
const addToAllowlist = document.getElementById('addToAllowlist');
const addToBlocklist = document.getElementById('addToBlocklist');
// basically storing these html elements into constants so they can be 
// manipulated more easily later such as adding event listeners and references etc
const removeFromAllowlist = document.getElementById('removeFromAllowlist');
const removeFromBlocklist = document.getElementById('removeFromBlocklist');
removeFromAllowlist.addEventListener('click',removeFromAllowlistFunc);
removeFromBlocklist.addEventListener('click',removeFromBlocklistFunc);

addToAllowlist.addEventListener('click',addAllowlistFunc);
addToBlocklist.addEventListener('click',addBlocklistFunc);

const manipulateListsInput = document.getElementById('manipulateListsInput');
const currentWebsitePlaceholder2 = document.getElementById('currentWebsitePlaceholder2');
const currentActiveAllowlist = document.getElementById('currentActiveAllowlist');
const currentActiveBlocklist = document.getElementById('currentActiveBlocklist');
const openSettings = document.getElementById('openSettings');

function renderList(listDisplay, list) {
  listDisplay.innerHTML = ""; // Clear the container
  list.forEach((url) => {
    const urlDiv = document.createElement("div");
    urlDiv.textContent = url;
    urlDiv.title = url; // Tooltip with the full URL
    listDisplay.appendChild(urlDiv);
  });
}



// Array to store the blocklists
chrome.storage.local.get(["allowlist", "blocklist"], (data) => {  // gets the allowlist and blocklist using their storagekey ids of "allowlist" and "blocklist".
  allowlist = data.allowlist || [];
  blocklist = data.blocklist || [];
  // either retrieve the allowlist files or create a new allowlist file if it's empty

  renderList(document.getElementById("currentActiveAllowlist"), allowlist);
  renderList(document.getElementById("currentActiveBlocklist"), blocklist);
});


//when the page is loaded, retrieve allowlist and blocklist using the keys "allowlist" and "blocklist respectively". 
// "|| []" basically initializes an empty array if user didn't previous store into array



openSettings.addEventListener('click',launchSettings);

// Load stored preferences on page load
let activeTabId;

document.addEventListener("DOMContentLoaded", () => { 
  //https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
  //"fires when the HTML document has been completely parsed, and all deferred scripts
  // (<script defer src="…"> and <script type="module">) have downloaded and executed"
  console.log("save imported!");
  renderList(currentActiveAllowlist, allowlist);
  renderList(currentActiveBlocklist, blocklist);

  // Detect the current website and check if it's blocked
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  // inspired by https://developer.chrome.com/docs/extensions/reference/api/tabs
    activeTabId = tabs[0].id;
    const currentUrl = new URL(tabs[0].url).hostname; // retrieves the url with only the host name: e.g. www.starwars.com 
    currentWebsitePlaceholder2.textContent = currentUrl;

    if (blocklist.some((blockedUrl) => currentUrl.includes(blockedUrl))) {
      // some iterates through every single url in the blocklsit
      //currentUrl.includes(blockedUrl) checks if the currentUrl contains the blockedUrl as a substring.
      //If currentUrl contains blockedUrl, the function returns true and redirects:
      chrome.tabs.update(tabs[0].id, { url: "goBackToWork.html" });
      console.log("redirected from popup.js!");
    }
  });
});



chrome.tabs.onCreated.addListener(function(tab) {         
  if (shouldBlock(tab.url)) {
    // Redirect to the "getToWork.html" page
    chrome.tabs.update(tabId, { url: "getToWork.html" });
}
});

// Event listener for tab updates (URL changes, navigation, etc.)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ensure we only act when the tab's URL has been fully loaded
  
    if (shouldBlock(tab.url)) {
      // Redirect to the "getToWork.html" page
      chrome.tabs.update(tabId, { url: "getToWork.html" });
  }
});

// // Listener for storage changes to keep allowlist and blocklist updated
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   if (namespace === "local") {
//     if (changes.allowlist) {
//       allowlist = changes.allowlist.newValue || [];
//     }
//     if (changes.blocklist) {
//       blocklist = changes.blocklist.newValue || [];
//     }
//   }
// });

// Utility function to store lists in localStorage
// function saveLists() {
//   localStorage.setItem("allowlist", JSON.stringify(allowlist));
//   localStorage.setItem("blocklist", JSON.stringify(blocklist));
// }


// Function to check if a URL should be blocked
function shouldBlock(url) {
  const currentUrl = new URL(url).hostname;
  return blocklist.some((blockedUrl) => currentUrl.includes(blockedUrl)); // iterates through all blocked urls. If the current url contains the blocked url, return true
}

// Event listener for tab updates (URL changes, navigation, etc.)


localStorage.setItem("mytime", Date.now());
var timeNow = localStorage.getItem("mytime");

function launchSettings(event){
    chrome.tabs.create({ url: 'settingsPage.html'});
    console.log("Launched settings page!");
}

function addAllowlistFunc(event) {
  event.preventDefault();
  // chrome.storage.local.set({ allowlist });
  addToList(manipulateListsInput.value.trim(), allowlist, currentActiveAllowlist);
}

function addBlocklistFunc(event) {
  event.preventDefault();
  addToList(manipulateListsInput.value.trim(), blocklist, currentActiveBlocklist);
}

function removeFromAllowlistFunc(event) {
  event.preventDefault();
  // chrome.storage.local.set({ allowlist });
  removeFromAllowlistFF(manipulateListsInput.value.trim(), allowlist, currentActiveAllowlist);
}

function removeFromBlocklistFunc(event){
  event.preventDefault();
  // chrome.storage.local.set({ allowlist });
  removeFromBlocklistFF(manipulateListsInput.value.trim(), blocklist, currentActiveBlocklist);
}


// Event listeeners



openSettings.addEventListener("click", (event) => {
  chrome.tabs.create({ url: "settingsPage.html" });
  console.log("Launched settings page!");
});



// Helper functions that simplifies the task so that I don't have to repeat the same code from my previous commit
function addToList(url, list, listDisplay) {
  if (url) {
    if (list.includes(url)) {
      alert(url.hostname + ` is already in the list!`);
    } else {
      list.push(url);
      if(list == allowlist){
        chrome.storage.local.set({allowlist});
      }else{
        chrome.storage.local.set({blocklist});
      }
      renderList(listDisplay, list);
      manipulateListsInput.value = "";  // clears value of the input box
    }
  }
}


function removeFromAllowlistFF(url, list, listDisplay) {
  const index = list.indexOf(url);
  console.log("ee");
  console.log(index);
  console.log()
  if (index !== -1) {
    list.splice(index, 1);  // removes the item starting from index 1, removes 1 item
    chrome.storage.local.set({allowlist});   // stores the modified array using its key after removal
    console.log(list);
    renderList(listDisplay, list);
  }
}

function removeFromBlocklistFF(url, list, listDisplay) {
  const index = list.indexOf(url);
  console.log("ee");
  console.log(index);
  console.log()
  if (index !== -1) {
    list.splice(index, 1);  // removes the item starting from index 1, removes 1 item
    chrome.storage.local.set({blocklist});   // stores the modified array using its key after removal
    console.log(list);
    renderList(listDisplay, list);
  }
}




// currentActiveBlocklist.textContent = blocklist[0];
// currentActiveAllowlist.textContent = allowlist[0];
