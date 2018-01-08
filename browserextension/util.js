var browser_name = null;
var xplatform_browser = null;
if (typeof browser !== 'undefined') {
    console.info('Using Firefox');
    browser_name = 'firefox';
    xplatform_browser = browser;
} else {
    console.info('Using Chrome');
    browser_name = 'chrome';
    xplatform_browser = chrome;
}


if (browser_name === 'firefox') {
    function xplatform_storage_get(wanted_keys, callback) {
        if (!Array.isArray(wanted_keys)) {
            wanted_keys = [wanted_keys];
        }
        browser.storage.local.get(wanted_keys).then(function (res) {

            var keys_length = wanted_keys.length;
            var keys = {};
            for (var i = 0; i < keys_length; i++) {
                keys[wanted_keys[i]] = res[wanted_keys[i]];
            }

            callback(keys);
        });
    }
} else if (browser_name === 'chrome') {
    function xplatform_storage_get(keys, callback) {
        chrome.storage.local.get(keys, function(res) {
            callback(res);
        });
    }
}


if (browser_name === 'firefox') {
    function xplatform_contextMenus_removeAll(callback) {
        browser.contextMenus.removeAll().then(callback);
    }
} else if (browser_name === 'chrome') {
    function xplatform_contextMenus_removeAll(callback) {
        chrome.contextMenus.removeAll(callback);
    }
}

function xplatform_storage_set(key, value) {
    var data = {};
    data[key] = value;
    xplatform_browser.storage.local.set(data);
}

function getRequest(base_url, callback = null) {
    _request('get', base_url, null, callback);
}

function postRequest(base_url, json_data = {}, callback = null) {
    _request('post', base_url, json_data, callback);
}

function _request(method, base_url, json_data, callback) {
    xplatform_storage_get('server_url', function (settings) {
        if (settings.server_url === undefined) {
            console.warn('No json-rpc-url defined, set it in addon settings.');
            _xplatform_sendNotification("No json-rpc-url defined, set it in addon settings.");
            return;
        }
        var request = new XMLHttpRequest();

        var url = settings.server_url + '/' + base_url;
        request.open(method, url, false);

        request.onload = function(e) {
            if (this.status == 200) {
                var result = JSON.parse(this.responseText);
                _xplatform_sendNotification("Download in progress");
                if (callback !== null) {
                    callback(result);
                }
            } else {
                _xplatform_sendNotification("Download error", this.responseText);
            }
        };

        try {
            if (method === 'post') {
                request.send(JSON.stringify(json_data));
            } else {
                request.send();
            }
        } catch(e) {
            console.warn('Download could not send ajax request, reason %s', e.toString());
            _xplatform_sendNotification("Download ERROR", e.toString());
        }
    });
}

var _notification_ID = "json-dispatch-notification";
var _notification_timeout_ID;
if (browser_name === 'firefox') {
    function _xplatform_sendNotification(title, content = '') {
        browser.notifications.create(_notification_ID, {
            'type': "basic",
            'title': title,
            'message': content,
            'iconUrl': 'icon.svg'
        }).then(function() {
            _notification_timeout_ID = setTimeout(() => {
                browser.notifications.clear(_notification_ID);
            }, 5000);
        });
    }
} else if (browser_name === 'chrome') {
    function _xplatform_sendNotification(title, content = '') {
        chrome.notifications.create(_notification_ID, {
            'type': "basic",
            'title': title,
            'message': content,
            'iconUrl': 'icon.svg'
        }, function() {
            _notification_timeout_ID = setTimeout(() => {
                chrome.notifications.clear(_notification_ID);
            }, 5000);
        });
    }
}


// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeURL(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
