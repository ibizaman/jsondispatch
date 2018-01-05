from codecs import open as _open
from os import path

from setuptools import setup, find_packages

HERE = path.abspath(path.dirname(__file__))

with _open(path.join(HERE, 'README.md'), encoding='utf-8') as f:
    LONG_DESCRIPTION = f.read()

    setup(
        name='jsondispatch',
        version='0.1',
        description='Dispatch commands with JSON HTTP requests',
        long_description=LONG_DESCRIPTION,
        license='BSD3',
        packages=find_packages(),
        install_requires=[
            'aiohttp == 2.3.7',
            'aiohttp_cors == 0.6.0',
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
