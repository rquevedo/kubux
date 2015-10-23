
from flask import Flask, render_template, request, make_response
from cubes import Workspace
from cubes import get_logger
from cubes.cells import Cell, PointCut, SetCut, RangeCut
import json
from collections import OrderedDict
from olap_engine import engine

modeler = Flask(__name__, static_folder='static', static_url_path='')

WORKSPACE = None
ENGINE = None

def create_workspace(config_file):
    
    global WORKSPACE
    global ENGINE
    
    logger = get_logger()
    logger.setLevel("INFO")
    logger.info("cretating workspace from %s" % config_file)

    WORKSPACE = Workspace(config=config_file)
    ENGINE = engine(WORKSPACE)

@modeler.route("/")
def index():
    return render_template('index.html')


@modeler.route("/model_list")
def get_model_list():
    model_list = []
    for i, provider in enumerate(WORKSPACE.namespace.providers):
        model_label = provider.metadata.get('label') or provider.metadata.get('name', 'unknown_model_%s' % i)
        model_list.append({'label':model_label,
                           'position':i})
    return json.dumps(model_list)


@modeler.route("/cube_list/<position>")
def get_cube_list_by_model(position):
    cube_list = []
    for cube in WORKSPACE.namespace.providers[int(position)].list_cubes():
        cube_list.append({'name':cube.get('name'), 'label':cube.get('label')})
    return json.dumps(cube_list)

@modeler.route("/dim_list/<name>")
def get_dim_list_by_cube(name):
    dimension_list = []
    for dimension in WORKSPACE.cube(name).dimensions:
        dimension_list.append(dimension.to_dict(create_label=True))
    return json.dumps(dimension_list)

@modeler.route("/agg_list/<name>")
def get_measure_list_by_cube(name):
    print WORKSPACE.cube(name).mappings
    agg_list = []
    for agg in WORKSPACE.cube(name).aggregates:
        agg_list.append(agg.to_dict())
    return json.dumps(agg_list)

@modeler.route("/request_cube_data", methods=["POST"])
def request_cube_data():
    request_data = json.loads(request.data)
    #result = ENGINE.manage_request(request.args)
    result = ENGINE.manage_request(request_data['data'])
    return json.dumps(result)
#    print request_data
#    return "ok"

@modeler.route("/request_members", methods=["POST"])
def request_filter_members():
    request_data = json.loads(request.data)
    cube = WORKSPACE.cube(request_data['cube'])
    dimension = cube.dimension(request_data['dimension'])
    hierarchy = dimension.hierarchy(request_data['hierarchy'])
    level = dimension.level(request_data['level'])

    browser = WORKSPACE.browser(cube)


    cell = Cell(cube, [])
    members = browser.members(cell, request_data['dimension'],level=request_data['level'], hierarchy=request_data['hierarchy'])

    html = ENGINE.format_to_filter_html_table(members, dimension, hierarchy, level)

    return html

def run_modeler(config_file, port=5000):
    
    if config_file:
        create_workspace(config_file)
    modeler.run(use_debugger=False, debug=True,
            use_reloader=False, host='0.0.0.0')

if __name__ == '__main__':
    import sys
    import webbrowser
    if len(sys.argv) > 1:
        config_file = sys.argv[1]
    else:
        config_file = None
    run_modeler(config_file)
