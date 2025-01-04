//logic for allowing and blocking tabs
const addToAllowlist = document.getElementById('addToAllowlist');
const addToBlocklist = document.getElementById('addToBlocklist');
addToAllowlist.addEventListener('click',addAllowlistFunc);
addToBlocklist.addEventListener('click',addBlocklistFunc);

const manipulateListsInput = document.getElementById('manipulateListsInput');
const currentWebsitePlaceholder2 = document.getElementById('currentWebsitePlaceholder2');
const currentActiveAllowlist = document.getElementById('currentActiveAllowlist');
const currentActiveBlocklist = document.getElementById('currentActiveBlocklist');

let allowlist = [];
let blocklist = [];

function addAllowlistFunc(event) {
  event.preventDefault();   //prevent the link above from following the URL (doesn't open on click)
  const newAllowlist = manipulateListsInput.value.trim();  // gets the web URL, 
  if (newAllowlist) {
    if(allowlist.includes(newAllowlist)){
        alert(newAllowlist + " is already in the blocklist!");
    }else{
      allowlist.push(newAllowlist);  // .push adds new items to end of array
    console.log('Added blocklist:', newAllowlist);  // outputs in console the URL
    console.log(allowlist);    // prints current websites in blocklist
    manipulateListsInput.value = '';
    currentActiveAllowlist.textContent = allowlist;
    }
  }
}

// currentActiveAllowlist.textContent = allowlist[0];

// Function to delete a blocklist
// function deleteBlocklist(event) {
//   event.preventDefault();   //prevent the link above from following the URL (doesn't open on click)
//   const blocklistToDelete = deleteBlocklistInput.value.trim();  // sets the URL to delete as a constant
//   const index = blocklists.indexOf(blocklistToDelete);  // finds the index of URL in array
//   if (index !== -1) {   // does nothing if the URL is not in array
//     blocklists.splice(index, 1);    // overwrites the original array
//     // .spice (index of element to remove, number of elements to remove)
//     // .splice can also add new elements .splice(index of element to remove, number of elements to remove, element to add, element to add... etc)
//     console.log('Deleted blocklist:', blocklistToDelete);   // outputs in console the URL
//     console.log(blocklists);    // prints current websites in blocklist
//     deleteBlocklistInput.value = '';    // resets the value of the input
//   }
// }




// function addAllowlistFunc(event){
//   console.log("eee");
//   event.preventDefault();
//   const newAllowlist = addToAllowlist.value.trim();  // gets the web URL 
//   if (newAllowlist) {
//     if(allowlist.includes(newAllowlist)){
//         alert(newAllowlist + " is already in the blocklist!");
//     }else{
//       allowlist.push(newAllowlist);  // .push adds new items to end of array
//     console.log('Added blocklist:', newAllowlist);  // outputs in console the URL
//     console.log(allowlist);    // prints current websites in blocklist
//     addToAllowlist.value = '';
//     currentActiveAllowlist.textContent = allowlist[0];
//     }
//   }
// }


function addBlocklistFunc(event) {
  // event.preventDefault();   //prevent the link above from following the URL (doesn't open on click)
  // const newBlocklist = addToBlocklist.value.trim();  // gets the web URL 

  //   if(blocklist.includes(newBlocklist)){
  //       alert(newBlocklist + " is already in the blocklist!");
  //   }else{
  //       blocklist.push(newBlocklist);  // .push adds new items to end of array
  //   console.log('Added blocklist:', newBlocklist);  // outputs in console the URL
  //   console.log(blocklist);    // prints current websites in blocklist
  //   manipulateListsInput.value = '';
  //   currentActiveBlocklist.textContent = blocklist[0];
  //   }
  console.log("ee");
}

// get current tab url
let activeTabId;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  activeTabId = tabs[0].id;
  chrome.tabs.get(activeTabId, (tab) => {
    document.getElementById('currentWebsitePlaceholder2').textContent = tab.url;
  });
});

// currentActiveBlocklist.textContent = blocklist[0];
// currentActiveAllowlist.textContent = allowlist[0];
