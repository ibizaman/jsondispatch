function saveGeneralOptions(e) {
    e.preventDefault();

    xplatform_storage_set('server_url', document.querySelector("#server_url").value);

    refreshMenuItems();
}

function restoreOptions() {
    xplatform_storage_get('server_url', function (settings) {
        document.querySelector("#server_url").value = settings.server_url || '';
    });

    updateMenuItemsFromStorage();
}

function refreshMenuItems(e) {
    getRequest('triggers', function(menu_items) {
        xplatform_storage_set('menu_items', menu_items.join(','));
    });

    updateMenuItemsFromStorage();
}

function updateMenuItemsFromStorage() {
    xplatform_storage_get('menu_items', function (settings) {
        var ul = document.querySelector('#menuitems');

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        var menu_items = settings.menu_items || [];
        var menu_items_length = menu_items.length;
        for (var i = 0; i < menu_items_length; i++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(menu_items[i]));
            ul.appendChild(li);
        }

        xplatform_contextMenus_removeAll(function () {
            for (var i = 0; i < menu_items_length; i++) {
                xplatform_browser.contextMenus.create({
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
