(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    // Listens to messages sent by background.js
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;  // Sets our timestamp in the video to the one in the bookmark
        }
    });

    // Fetch all bookmarks once a video is loaded
    const fetchBookmarks = () => {
        console.log("fetch bookmarks")
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                // Look in storage to see if the video has any bookmarks
                // If it does, stringify it. Otherwise, return an empty array
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    const newVideoLoaded = async () => {
        console.log("new video loaded")
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];  // Gets the first element that matches "bookmark-btn"
        
        currentVideoBookmarks = await fetchBookmarks();  // resolve fetchBookmarks promise

        // If a bookmark button does not exist on the web page, create an image element for the bookmark buttons
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");  // "document" is your web page

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            // You can find these two through the "inspect" command on your browser 
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];  // Running this command (without the variable) on your browser console returns the YouTube left controls
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;  // Variable that keeps video time in the YouTube website
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        
        currentVideoBookmarks = await fetchBookmarks();  // Ensure you always use most up-to-date bookmarks

        // Maps back to a set of bookmarks in chrome storage
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))  // The sort makes it so that the bookmarks are ordered by time
        });
    };

    newVideoLoaded();  // Fix for button not showing up if you refresh your video page
})();

// Converts the seconds from currentTime into a readable format for the computer
const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substring(19, 11);  // For some reason, this only worked if the numbers were backwards
};
