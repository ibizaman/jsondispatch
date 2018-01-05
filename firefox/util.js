function getRequest(base_url, callback = null) {
    _request('get', base_url, null, callback);
}

function postRequest(base_url, json_data = {}, callback = null) {
    _request('post', base_url, json_data, callback);
}

function _request(method, base_url, json_data, callback) {
    var promise_server_url = browser.storage.local.get('server_url');

    Promise.all([promise_server_url]).then((res) => {
        if (res[0]['server_url'] === undefined) {
            console.warn('No json-rpc-url defined, set it in addon settings.');
            _sendNotification("No json-rpc-url defined, set it in addon settings.");
            return;
        }
        var request = new XMLHttpRequest();

        var url = res[0]['server_url'] + '/' + base_url;
        request.open(method, url, false);

        request.onload = function(e) {
            if (this.status == 200) {
                var result = JSON.parse(this.responseText);
                _sendNotification("Download in progress");
                if (callback !== null) {
                    callback(result);
                }
            } else {
                _sendNotification("Download error", this.responseText);
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
            _sendNotification("Download ERROR", e.toString());
        }
    });
}

var _notification_ID = "json-dispatch-notification";
var _notification_timeout_ID;
function _sendNotification(title, cont = "") {
    browser.notifications.create(_notification_ID, {
        "type": "basic",
        "title": title,
        "message": cont
    }).then(()=>{
        _notification_timeout_ID = setTimeout(() => {
            browser.notifications.clear(_notification_ID);
        }, 5000);
    });
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
