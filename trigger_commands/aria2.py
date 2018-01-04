import aiohttp


async def addUri(config, url, dir=None):
    async with aiohttp.ClientSession() as session:
        optional = {}
        if dir:
            optional['dir'] = dir
        data = {
            'jsonrpc': '2.0',
            'id': 'abc123',
            'method': 'aria2.addUri',
            'params': [
                'token:' + config['rpc_secret'],
                [url],
                optional,
            ]
        }
        async with session.post(config['url'], json=data) as resp:
            result = await resp.json()
            return {
                'status': resp.status,
                'gid': result['result'],
            }
