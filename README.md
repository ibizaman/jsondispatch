
# Table of Contents

1.  [Json Dispatch](#org4df669d)
    1.  [Use Cases](#org7800d12)
        1.  [Send file to aria2 and set download dir based on category](#org936354a)
    2.  [Install & Use](#org1dff345)
        1.  [Server](#org57a7c72)
        2.  [Firefox extension](#org5a2581f)
    3.  [Develop](#orgeb99c26)


<a id="org4df669d"></a>

# Json Dispatch

Server program written in python that accepts HTTP POST requests with a JSON
payload and forwards the request to another program, after transforming it in a
configurable way. Quite generic, but that's the goal. See [1.1](#org7800d12) for concrete
examples.

`Python 3.6` supported only, although other `Python 3.X` versions should work
too.

Also provides a Firefox (Chrome coming soon) extension that talks to the server
and allows you to right click on a URL/link in your browser and "send it to" the
server.


<a id="org7800d12"></a>

## Use Cases


<a id="org936354a"></a>

### Send file to aria2 and set download dir based on category

Config file `/etc/jsondispatch/jsondispatch.conf`:

    common:
      aria2:
        url: http://localhost:6800/jsonrpc
        rpc_secret: mYs3Cr3t
    
    triggers:
      - download_program_uri:
        - command: aria2
          method: addUri
          arguments:
            url: {url}
            dir: /srv/backups/programs

JSON payload to send to the server with URL ending with
`/trigger/download_program_uri` with POST request:

    {
        "url": "magnet:?xt=urn:btih:204a1789dd04e4d8f5a4e098e8f777794888f4ad&dn=archlinux-2017.12.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce"
    }

When sending the above POST request, jsondispatch will call the `addUri` RPC
method of aria2 with the given magnet URL and the hardcoded `dir` argument.

Or just use the browser extension which does this for you with a right click on
a magnet URL.


<a id="org1dff345"></a>

## Install & Use


<a id="org57a7c72"></a>

### Server

To install the server, clone this repo, `cd` in the repo and run:

    pip install -e "."

Create a configuration file in `/etc/jsondispatch/jsondispatch.conf` (by
default, `--config` option lets you setup a custom file location). See [1.1](#org7800d12)
for example configurations.

To run the server, `cd` in the repo and run:

    python . 

You can change the default port and config file location, give the `--help`
argument for detailed instructions.


<a id="org5a2581f"></a>

### Firefox extension

Go to `about:debugging` and click on `Load Temporary Add-On`. Browse to the
`firefox/` folder in this repo and select the `manifest.json` file.

Now that the addon is added, go to the addons settings page `about:addons` and
fill-in the server URL. If you're running the server locally with default port,
then the URL is `http://127.0.0.1:8850/trigger`.

Now you can just right click on a link and go in the submenu `Send to Json
Dispatch`, then choose the `Queue download of program` option. Of course,
first make sure you installed and started the server as explained in [1.2.1](#org57a7c72).


<a id="orgeb99c26"></a>

## Develop

    pip install -e ".[dev,test]"

