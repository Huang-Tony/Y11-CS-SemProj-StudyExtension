
        // Get the form elements
        const addBlocklistForm = document.getElementById('addBlocklistForm');
        const deleteBlocklistForm = document.getElementById('deleteBlocklistForm');
        // basically storing these html elements into constants so they can be manipulated more easily later
        // such as adding event listeners etc

  
        // Add event listeners to the forms
        addBlocklistForm.addEventListener('submit', addBlocklist); 
        // the function addBlocklist is called when the button submit is pressed
        // the sumbit button is in the same form as addBlocklistForm and not the delete blocklist one
        deleteBlocklistForm.addEventListener('submit', deleteBlocklist);

        // Get the input fields
        const addBlocklistInput = document.getElementById('addBlocklistInput'); // add blocklist's id is addBlocklistInput
        const deleteBlocklistInput = document.getElementById('deleteBlocklistInput');
  
        // Array to store the blocklists
        let blocklists = [];
  
        // Function to add a new blocklist
        function addBlocklist(event) {
          event.preventDefault();   //prevent the link above from following the URL (doesn't open on click)
          const newBlocklist = addBlocklistInput.value.trim();  // gets the web URL, 
          if (newBlocklist) {
            if(blocklists.includes(newBlocklist)){
                alert(newBlocklist + " is already in the blocklist!");
            }else{
                blocklists.push(newBlocklist);  // .push adds new items to end of array
            console.log('Added blocklist:', newBlocklist);  // outputs in console the URL
            console.log(blocklists);    // prints current websites in blocklist
            addBlocklistInput.value = '';
            }
          }
        }
  
        // Function to delete a blocklist
        function deleteBlocklist(event) {
          event.preventDefault();   //prevent the link above from following the URL (doesn't open on click)
          const blocklistToDelete = deleteBlocklistInput.value.trim();  // sets the URL to delete as a constant
          const index = blocklists.indexOf(blocklistToDelete);  // finds the index of URL in array
          if (index !== -1) {   // does nothing if the URL is not in array
            blocklists.splice(index, 1);    // overwrites the original array
            // .spice (index of element to remove, number of elements to remove)
            // .splice can also add new elements .splice(index of element to remove, number of elements to remove, element to add, element to add... etc)
            console.log('Deleted blocklist:', blocklistToDelete);   // outputs in console the URL
            console.log(blocklists);    // prints current websites in blocklist
            deleteBlocklistInput.value = '';    // resets the value of the input
          }
        }



        // find current web page

        let currentWebPage = window.location;
        // if(blocklists.includes(currentWebPage)){
        //     alert("A miracle if this works");
        // }
        
        // Get the button element
      const listTabsButton = document.getElementById('listTabs');

function listActiveTabs() {
  // Get all the active tabs in the current window
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    // Create an array to store the tab URLs
    const tabUrls = [];

    // Loop through the tabs and add their URLs to the array
    tabs.forEach((tab) => {
      tabUrls.push(tab.url);
      console.log(tab.url);
    });

    // Log the array of tab URLs to the console
    console.log(tabUrls);
  });
}

      const openSettings = document.getElementById('openSettings')
// Add a click event listener to the button
listTabsButton.addEventListener('click', listActiveTabs);
openSettings.addEventListener('click',settingsFunction);

function settingsFunction(event){
  chrome.tabs.create({ url: 'settingsPage.html' });
  console.log("Launched settings page!");
}