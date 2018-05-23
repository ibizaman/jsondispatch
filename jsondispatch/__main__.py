"""
Json Dispatch main entry point.

Just running `python jsondispatch` will start a server listening on port 8850
for JSON requests.

Run `python jsondispatch --help` for more info, or read this file.
"""
import argparse
import logging
import importlib
from pathlib import Path
from string import Template

import yaml
from aiohttp import web
import aiohttp_cors


DEFAULT_CONFIG_FILES = [Path(p)
                        for p in ["/etc/jsondispatch/jsondispatch.yaml",
                                  Path.home() / ".config/jsondispatch/jsondispatch.yaml",
                                  "./config/jsondispatch.yaml"]]


async def trigger_handler(request):
    name = request.match_info['name']
    commands = request.app['config']['triggers'].get(name)
    if not commands:
        return web.Response(text="Unkown trigger", status=404)

    data = await request.json()

    results = []
    for command in commands:
        args = {name: Template(value).substitute(**data)
                for name, value in command.get('arguments', {}).items()}
        command_module = import_module(command['command'])
        command_method = getattr(command_module, command['method'])
        command_config = request.app['config']['commands'].get(command['command'], {})
        results.append(await command_method(command_config, **args))

    return web.json_response(results)


def get_triggers_handler(request):
    commands = list(request.app['config']['triggers'].keys())
    return web.json_response(commands)


def import_module(module_name):
    spec = importlib.util.spec_from_file_location(module_name, Path(__file__).parent / 'trigger_commands' / (module_name + '.py'))
    assert spec is not None, 'Could not import module {}'.format('trigger_commands.' + module_name)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run(port, config):
    """
    Serve the JsonDispatch HTTP Server on given port with given config.
    """
    logging.basicConfig(level=logging.DEBUG)

    app = web.Application()
    app['config'] = config

    cors = aiohttp_cors.setup(app, defaults={
        config['cors']['domain']: aiohttp_cors.ResourceOptions(
            allow_credentials=False,
            expose_headers=['Content-Type'],
            allow_headers=[],
        )
    })

    trigger_resource = app.router.add_resource('/trigger/{name}')
    cors.add(trigger_resource.add_route('POST', trigger_handler))

    get_triggers_resource = app.router.add_resource('/triggers')
    cors.add(get_triggers_resource.add_route('GET', get_triggers_handler))

    try:
        web.run_app(app, port=port)
    except KeyboardInterrupt:
        pass


def parse_configs(config_files):
    conf = None
    found_file = None
    for config_file in reversed(config_files):
        if config_file.is_file():
            with config_file.open() as f:
                conf = yaml.load(f.read())
                found_file = config_file
                break

    if not conf:
        raise RuntimeError("Found no configuration on given paths.")

    errors = []

    if 'cors' not in conf:
        errors.append("Missing required field 'cors'.")
    else:
        if 'domain' not in conf['cors']:
            errors.append("Missing required field 'cors.domain'.")

    if 'commands' not in conf:
        errors.append("Missing required field 'commands'.")

    if not isinstance(conf['commands'], dict):
        errors.append("Field 'commands' must be a dict, not {}.".format(type(conf['triggers'])))

    if 'triggers' not in conf:
        errors.append("Missing required field 'triggers'.")

    if not isinstance(conf['triggers'], dict):
        errors.append("Field 'trigger' must be a dict, not {}.".format(type(conf['triggers'])))

    if errors:
        raise ValueError('Configuration file {} has some errors:\n{}'.format(found_file, '\n'.join(errors)))

    return conf


def main():
    """
    Parse arguments from command line and call `run` function.
    """
    arg_parser = argparse.ArgumentParser(__doc__)
    arg_parser.add_argument(
        "--port",
        type=int,
        default=8850,
        help="Port on which to listen incoming requests, defaults to 8850.")
    arg_parser.add_argument(
        "--config",
        type=Path,
        nargs='*',
        default=DEFAULT_CONFIG_FILES,
        help="Location of config files, last one found take precendence, default to {}.".format(', '.join(str(p) for p in DEFAULT_CONFIG_FILES)))
    args = arg_parser.parse_args()

    config = parse_configs(args.config)

    run(args.port, config)

main()
