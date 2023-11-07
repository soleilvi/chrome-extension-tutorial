import {getActiveTabURL} from "./utils.js";

// Adding a new bookmark row to the popup (allows us to see bookmarks)
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");  // Encapsulates all elements in bookmark row
    const controlsElement = document.createElement("div");  // For play button

    bookmarkTitleElement.textContent = bookmark.desc;  // Setting the bookmark's content to the timestamp text we made in addNewBookmarkEventHandler()
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-" + bookmark.time;  // Guarantees a unique ID for each row element
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play", onPlay, controlsElement);

    // Encapsulating elements by appending them
    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
};

// logic for UI
const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }

    return;
};

const onPlay = async event => {
    const bookmarkTime = event.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getActiveTabURL();

    // Send message to contentScript
    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    })
};

const onDelete = event => {};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {  // src is the type of button created (play, delete, ect.)
    const controlElement = document.createElement("img");  // This one control element can be any image (?)
    
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);

    controlParentElement.appendChild(controlElement);
}; 

// Native window event that is triggerd when you load an HTML document (when we want to show bookmarks)
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();

    // I've already explained the following 3 lines in backgorund.js
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            // currentVideoBookmarks contains all JSON-ified videos
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];  // If there are no bookmarks, return empty array

            viewBookmarks(currentVideoBookmarks);
        })
    }
    // Show this is not a YouTube video page
    else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class = "title"> This is not a YouTube video page.</div>';
    }
});
