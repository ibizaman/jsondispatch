function saveGeneralOptions(e) {
    e.preventDefault();

    browser.storage.local.set({
        server_url: document.querySelector("#server_url").value
    });

    refreshMenuItems();
}

function restoreOptions() {
    browser.storage.local.get('server_url').then((res) => {
        document.querySelector("#server_url").value = res.server_url || '';
    });

    updateMenuItemsFromStorage();
}

function refreshMenuItems(e) {
    getRequest('triggers', function(menu_items) {
        browser.storage.local.set({
            menu_items: menu_items
        });
    });

    updateMenuItemsFromStorage();
}

function updateMenuItemsFromStorage() {
    browser.storage.local.get('menu_items').then((res) => {
        // update settings menu items
        var ul = document.querySelector('#menuitems');

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        var menu_items = res.menu_items;
        var menu_items_length = menu_items.length;
        for (var i = 0; i < menu_items_length; i++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(menu_items[i]));
            ul.appendChild(li);
        }

        browser.contextMenus.removeAll().then(function () {
            for (var i = 0; i < menu_items_length; i++) {
                browser.contextMenus.create({
                    id: menu_items[i],
                    title: menu_items[i],
                    contexts: ["link"]
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveGeneralOptions);
document.querySelector("#btnupdate").addEventListener("click", refreshMenuItems);
