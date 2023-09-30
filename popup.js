import {getActiveTabURL} from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

// native window event that is triggerd when you load an HTML document (when we want to show bookmarks)
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();

    // I've already explained the following 3 lines in backgorund.js
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            // currentVideoBookmarks contains all JSON-ified videos
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];  // If there are no bookmarks, return empty array

            // videoBookmarks
        })
    }
    // Show this is not a YouTube video page
    else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class = "title"> This is not a YouTube video page.</div>';
    }
});
