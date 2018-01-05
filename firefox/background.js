browser.contextMenus.create({
    id: "download_program_uri",
    title: "Queue download of program",
    contexts: ["link"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    sendTrigger(info.menuItemId, info.linkUrl);
});

function sendTrigger(menuItemId, linkUrl) {
    postRequest(menuItemId, {
        'url': escapeURL(linkUrl)
    });
}
