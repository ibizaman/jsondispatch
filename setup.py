from codecs import open as _open
from os import path

from setuptools import setup

HERE = path.abspath(path.dirname(__file__))
VERSION = '0.1.4'

with _open(path.join(HERE, 'README.md'), encoding='utf-8') as f:
    LONG_DESCRIPTION = f.read()

    setup(
        name='jsondispatch',
        version=VERSION,
        description='Dispatch commands with JSON HTTP requests',
        long_description=LONG_DESCRIPTION,
        author='Pierre Penninckx',
        author_email='ibizapeanut@gmail.com',
        license='GPLv3',
        packages=['jsondispatch', 'jsondispatch/trigger_commands'],
        url='https://github.com/ibizaman/jsondispatch',
        download_url='https://github.com/ibizaman/jsondispatch/archive/{}.tar.gz'.format(VERSION),
        keywords=['json', 'aiohttp'],
        entry_points = {
            'console_scripts': ['jsondispatch=jsondispatch.__main__:main'],
        },
        install_requires=[
            'aiohttp == 2.3.7',
            'aiohttp_cors == 0.6.0',
            'yarl == 0.18.0',
            'PyYAML == 3.12',
        ],
        extras_require={
            'dev': [
                'pylint == 1.7.2',
            ],
            'test': [
                'coverage == 4.4.1',
                'pytest == 3.1.3',
                'pytest-cov == 2.5.1',
            ],
        }
    )
