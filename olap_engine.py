
import cubes
from cubes.formatters import HTMLCrossTableFormatter
from custom_formatters import SummaryTableFormatter,GraphFormatter
import re

class engine():
            
    
    def __init__(self, WORKSPACE):
        
        self.WORKSPACE = WORKSPACE
        self.formatters = {'table':self.manage_request_table, 'bar':self.manage_request_graph, 'line':self.manage_request_graph,
        'bullet':self.manage_request_graph,'pie':self.manage_request_graph}
    
    def get_request_object(self, request_data):
        
        result = {'drilldown_list':[],'onrows':{'labels':[],'objects':[]},'oncolumns':{'labels':[],'objects':[]},
                    'aggregates':{'labels':[],'objects':[]},'cube':False,'browser':False}

        cube = self.WORKSPACE.cube(request_data['cube'])
        result['cube'] = cube
        result['browser'] = self.WORKSPACE.browser(cube.name)
        result['aggregates']['labels'] = [agg['data']['name'] for agg in request_data['aggregates']]
        result['aggregates']['objects'] = cube.get_aggregates(result['aggregates']['labels'])

        for row in request_data['rows']:
            dimension = cube.dimension(row['data']['dimension'])
            hierarchy = dimension.hierarchy(row['data']['hierarchy'])
            level = dimension.level(row['data']['level'])
            result['drilldown_list'].append((dimension.name, hierarchy.name, level.name))
            if dimension.is_flat:
                result['onrows']['labels'].append(dimension.name)
                result['onrows']['objects'].append((dimension,hierarchy,level))
            else:
                result['onrows']['labels'].append(level.label_attribute.ref)
                result['onrows']['objects'].append((dimension,hierarchy,level))
        for column in request_data['columns']:
            dimension = cube.dimension(column['data']['dimension'])
            hierarchy = dimension.hierarchy(column['data']['hierarchy'])
            level = dimension.level(column['data']['level'])
            result['drilldown_list'].append((dimension.name, hierarchy.name, level.name))
            if dimension.is_flat:
                result['oncolumns']['labels'].append(dimension.name)
                result['oncolumns']['objects'].append((dimension,hierarchy,level))
            else:
                result['oncolumns']['labels'].append(level.label_attribute.ref)
                result['oncolumns']['objects'].append((dimension,hierarchy,level))
        return result
        
    def manage_request(self, request_data):
        
        return self.formatters[request_data['formatter']](request_data)
        
        
    def manage_request_table(self, request_data):
        
        request_object = self.get_request_object(request_data)
        
        result = request_object['browser'].aggregate(drilldown=request_object['drilldown_list']
            , aggregates=request_object['aggregates']['labels'], include_summary=True)
        
        if not request_object['drilldown_list']:
        	formatter = SummaryTableFormatter(aggregates_on="columns"
                , table_style="table table-striped table-bordered table-hover table-condensed")
        	html_result = formatter.format(result, aggregates=request_object['aggregates']['labels'])
        else:
            # for r in result:
            #     print r
	        formatter = HTMLCrossTableFormatter(table_style="table table-striped table-bordered table-hover table-condensed")
	        html_result = formatter.format('some_cube',result, request_object['onrows']['labels'], request_object['oncolumns']['labels']
                , request_object['aggregates']['labels'],aggregates_on="columns")

        #remove \n and \t
        html_result = re.sub(r'[\t\n\r]', '', html_result)
        return {'data':html_result}
    
    def manage_request_graph(self, request_data):

        print "graficoooooooooo"

        request_object = self.get_request_object(request_data)

        result = request_object['browser'].aggregate(drilldown=request_object['drilldown_list']
            , aggregates=request_object['aggregates']['labels'], include_summary=False)


        formatter = GraphFormatter()

        series_result = formatter.format(result,request_object)
        print series_result
        return {'data':series_result}

