import youtube_dl


async def download(config, url):
    options = {}
    with youtube_dl.YoutubeDL(options) as ydl:
        ydl.download(url)
