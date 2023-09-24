// listens for updates in tab system and checks if the most recent tab is a YouTube page
// Calls a function addListener, which takes another function as an argument. We are using an arrow function.
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];  // Saves the text after the question mark in a YouTube URL
      const urlParameters = new URLSearchParams(queryParameters);  // Stores queryParameters as a key-value pair (key is v)
  
      // Communicates that a new URL is loaded up
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),  // Gets the video ID
      });
    }
  });
  