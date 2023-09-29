// Code snippet from google to get current tab
export async function getActiveTabURL() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab; 
}