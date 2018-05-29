
# Table of Contents

1.  [Json Dispatch](#orgd86c08b)
    1.  [Use Cases](#org34431b5)
        1.  [Send file to aria2 and set download dir based on category](#org22a58f9)
    2.  [Install & Use](#orgc80781a)
        1.  [Server](#orgb090a6e)
        2.  [Browser extension](#org60156d8)
    3.  [Develop](#orgc820fd4)
        1.  [Publish firefox extension](#org92d0e36)
    4.  [License](#org1858501)


<a id="orgd86c08b"></a>

# Json Dispatch

Server program written in python that accepts HTTP POST requests with a JSON
payload and forwards the request to another program, after transforming it in a
configurable way. Quite generic, but that's the goal. See [1.1](#org34431b5) for concrete
examples.

`Python 3.6` supported only, although other `Python 3.X` versions should work
too.

Also provides a Firefox and Chrome extension that talks to the server and allows
you to right click on a URL/link in your browser and "send it to" the server.


<a id="org34431b5"></a>

## Use Cases


<a id="org22a58f9"></a>

### Send file to aria2 and set download dir based on category

Config file `/etc/jsondispatch/jsondispatch.conf`:

    cors:
      domain: '*'
    
    commands:
      aria2:
        url: http://localhost:6800/jsonrpc
        rpc_secret: mYs3Cr3t
    
    triggers:
      download_program_uri:
        - command: aria2
          method: addUri
          arguments:
            url: $url
            dir: /srv/backups/programs

JSON payload to send to the server with URL ending with
`/trigger/download_program_uri` with POST request:

    {
        "url": "magnet:?xt=urn:btih:204a1789dd04e4d8f5a4e098e8f777794888f4ad&dn=archlinux-2017.12.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce"
    }

When sending the above POST request, jsondispatch will call the `addUri` RPC
method of aria2 with the given magnet URL and the hardcoded `dir` argument.

Or just use the browser extension which does this for you with a right click on
a magnet URL (or any link for that matter).


<a id="orgc80781a"></a>

## Install & Use


<a id="orgb090a6e"></a>

### Server

To install the server, clone this repo, `cd` in the repo and run:

    pip install -e "."

Create a configuration file in `/etc/jsondispatch/jsondispatch.conf` (by
default, `--config` option lets you setup a custom file location). See [1.1](#org34431b5)
for example configurations.

To run the server, `cd` in the repo and run:

    python . 

You can change the default port and config file location, give the `--help`
argument for detailed instructions.


<a id="org60156d8"></a>

### Browser extension

For Firefox, go to `about:debugging` and click on `Load Temporary Add-On`.
Browse to the `browserextension/` folder in this repo and select the
`manifest.json` file. Now that the addon is added, go to the addons settings
page `about:addons` and fill-in the server URL.

If you're running the server locally with default port, then the URL is
`http://127.0.0.1:8850`.

For Chrome, go to `chrome://extensions/`, enable `Developer mode`, click on
`Load unpacked extension`. Browse to the `firefox/` folder in this repo and
click on `open`. Now that the addon is added, click on the addon's `option`
button and fill-in the server URL.

Now you can just right click on a link and go in the submenu `Send to Json
Dispatch`, then choose one of the options which correspond to the configured
triggers. Of course, first make sure you installed and started the server as
explained in [1.2.1](#orgb090a6e).


<a id="orgc820fd4"></a>

## Develop

    pip install -e ".[dev,test]"


<a id="org92d0e36"></a>

### Publish firefox extension

1.  [Zip](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Package_your_extension_) the file:
    
        cd browserextension
        zip -r -FS ../browserextension.zip *


<a id="org1858501"></a>

## License

The icon was taken from <https://feathericons.com/>, it's under MIT License.

