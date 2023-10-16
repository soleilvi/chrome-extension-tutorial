import {getActiveTabURL} from "./utils.js";

// Adding a new bookmark row to the popup (allows us to see bookmarks)
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");  // Encapsulates all elements in bookmark row

    bookmarkTitleElement.textContent = bookmark.desc;  // Setting the bookmark's content to the timestamp text we made in addNewBookmarkEventHandler()
    bookmarkTitleElement.className = "bookmark-title";

    newBookmarkElement.id = "bookmark-" + bookmark.time;  // Guarantees a unique ID for each row element
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    // Encapsulating elements by appending them
    newBookmarkElement.appendChild(bookmarkTitleElement);
    bookmarksElement.appendChild(newBookmarkElement);

    console.log("pee");
};

// logic for UI
const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";  // If there are no bookmarks, don't display anything

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

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
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];  // If there are no bookmarks, return empty array

            viewBookmarks(currentVideoBookmarks);
        })
    }
    // Show this is not a YouTube video page
    else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class = "title"> This is not a YouTube video page.</div>';
    }
});
