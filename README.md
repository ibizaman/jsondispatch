
# Table of Contents

1.  [Json Dispatch](#org109eefd)
    1.  [Use Case: Send file to aria2 and set download dir based on category](#org0d276be)
    2.  [Develop](#org24cb46a)


<a id="org109eefd"></a>

# Json Dispatch

Accepts HTTP GET and POST requests with JSON payload on a configurable port and
forwards the request to another program. The program and action are also
configurable.


<a id="org0d276be"></a>

## Use Case: Send file to aria2 and set download dir based on category

`/etc/jsondispatch/jsondispatch.conf`:

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

JSON payload to send to url `/trigger/download_program_uri` with POST request:

    {
        "url": "magnet:?xt=urn:btih:204a1789dd04e4d8f5a4e098e8f777794888f4ad&dn=archlinux-2017.12.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce"
    }

When sending the above POST request, jsondispatch will call the `addUri` RPC
method of aria2 with the give magnet url and the hardcoded `dir` argument.


<a id="org24cb46a"></a>

## Develop

    pip install -e ".[dev,test]"

