
# Table of Contents

1.  [Json Dispatch](#orge173a80)
    1.  [Use Case: Send file to aria2 and set download dir based on category](#org32fffb8)


<a id="orge173a80"></a>

# Json Dispatch

Accepts HTTP GET and POST requests with JSON payload on a configurable port and
forwards the request to another program. The program and action are also
configurable.


<a id="org32fffb8"></a>

## Use Case: Send file to aria2 and set download dir based on category

`jsondispatch.conf`:

    aria2:
      url: http://localhost:6800/jsonrpc
      rpc_secret: mYs3Cr3t
    
    download_program_uri:
      - command: aria2
        method: addUri
        arguments:
          - $url
          - dir: /srv/backups/programs

Payload to send with POST request:

    {
        "action": "download_program_uri",
        "url": "magnet:?xt=urn:btih:204a1789dd04e4d8f5a4e098e8f777794888f4ad&dn=archlinux-2017.12.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce"
    }

When sending the above POST request, jsondispatch will call the `addUri` RPC
method of aria2 with the give magnet url and the hardcoded `dir` argument.

