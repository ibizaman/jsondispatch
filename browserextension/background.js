xplatform_browser.contextMenus.onClicked.addListener((info, tab) => {
    sendTrigger(info.menuItemId, info.linkUrl);
});

function sendTrigger(menuItemId, linkUrl) {
    postRequest('trigger/' + menuItemId, {
        'url': escapeURL(linkUrl)
    });
}
