function saveGeneralOptions(e) {
    browser.storage.local.set({
        server_url: document.querySelector("#server_url").value
    });
    e.preventDefault();
}

function restoreOptions() {
    browser.storage.local.get('server_url').then((res) => {
        document.querySelector("#server_url").value = res.server_url || '';
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveGeneralOptions);
