// Code snippet from google to get current tab
export async function getActiveTabURL() {
    console.log("get active tab")
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabs[0];
}