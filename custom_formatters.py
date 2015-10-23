from cubes.formatters import Formatter,CrossTableFormatter

try:
    import jinja2
except ImportError:
    from .common import MissingPackage
    jinja2 = MissingPackage("jinja2", "Templating engine")

def _jinja_env():
    """Create and return cubes jinja2 environment"""
    loader = jinja2.loaders.FileSystemLoader('templates')
    env = jinja2.Environment(loader=loader)
    return env

class FilterTableFormatter(Formatter):
    
    mime_type = "text/html"

    def __init__(self, table_style=None):


        super(FilterTableFormatter, self).__init__()

        self.env = _jinja_env()
        self.template = self.env.get_template("filter_table.html")
        self.table_style = table_style

    def format(self, members, dimension, hierarchy, level):

        
        levels = hierarchy.levels_for_depth(hierarchy.level_index(level) + 1)
        pattern = '/'.join(['%%(%s)s' % (hlevel.label_attribute.ref) for hlevel in levels])
        
        labels = [pattern % member for member in members]


        output = self.template.render(labels=labels, level_label=level.label,
                                      table_style=self.table_style)
        return output

class SummaryTableFormatter(Formatter):
    parameters = [
                {
                    "name": "aggregates_on",
                    "type": "string",
                    "label": "Localtion of measures. Can be columns, rows or "
                             "cells",
                    "scope": "formatter",
                },
                {
                    "name": "table_style",
                    "description": "CSS style for the table"
                }
            ]
    mime_type = "text/html"

    def __init__(self, aggregates_on="columns", table_style=None):
        """Create a simple HTML table formatter. See `CrossTableFormatter` for
        information about arguments."""

        if aggregates_on not in ["columns", "rows"]:
            raise ArgumentError("aggregates_on sohuld be either 'columns' "
                                "or 'rows', is %s" % aggregates_on)

        super(SummaryTableFormatter, self).__init__()

        self.env = _jinja_env()
        self.template = self.env.get_template("summary_table.html")
        self.table_style = table_style
        self.aggregates_on = aggregates_on

    def format(self, result, aggregates=None, aggregates_on=None):

        aggregates_on = aggregates_on or self.aggregates_on
        columns = []
        rows = []
        data = []

        cube = result.cell.cube
        aggregates = cube.get_aggregates(aggregates)

        for agg in aggregates:

            if aggregates_on == "rows":
                rows.append(agg.label or agg.name)
                data.append([result.summary[agg.ref()]])
            else:
                columns.append(agg.label or agg.name)
                if len(data) != 0:
                    data[0].append(result.summary[agg.ref()])
                else:
                    data.append([result.summary[agg.ref()]])



        output = self.template.render(columns=columns, rows=rows, data=data,
                                      table_style=self.table_style)
        return output

class GraphFormatter(Formatter):

    def format(self, result, request_object, aggregates_on="columns"):

        print "levels %s" % result.levels
        cross_table = CrossTableFormatter().format(request_object['cube'],result,request_object['onrows']['labels'],request_object['oncolumns']['labels']
            ,request_object['aggregates']['labels'],aggregates_on)

        result = {
            "resultset":[
            ],
            "metadata":[]
        };
        print cross_table
        cross_table = eval(cross_table)

        def populate_metadata(series,category=False):
            print "request_object %s" % request_object
            print "lo k debe salir %s" % [level_object[2].label for level_object in request_object[series]['objects']]
            result['metadata'].append({
                "colIndex":0,
                "colType":"String",
                "colName":"%s" % '~'.join([level_object[2].label for level_object in request_object[series]['objects']])
            })
            series_index = 1
            if category:
                result['metadata'].append({
                "colIndex":1,
                "colType":"String",
                "colName":"%s" % '~'.join([level_object[2].label for level_object in request_object[category]['objects']])
                })
                series_index+= 1
            result['metadata'].append({
                "colIndex":series_index,
                "colType":"Numeric",
                "colName":"Value"
            })

        if cross_table['rows'] or cross_table['columns']:
            if cross_table['rows'][0]:
                if cross_table['columns'][0]:
                    populate_metadata('oncolumns','onrows')
                    for head, row in zip(cross_table['rows'], cross_table['data']):
                        for index,column in enumerate(cross_table['columns']):

                            data = ["~".join([str(c) for c in column])]
                            data.append("~".join([str(h) for h in head]))
                            data.append(float(row[index]))
                            result['resultset'].append(data)
                else:
                    populate_metadata('onrows')
                    for head, row in zip(cross_table['rows'], cross_table['data']):
                        data = ["~".join([str(h) for h in head])]
                        data.append(float(row[0]))
            elif cross_table['columns'][0]:
                populate_metadata('oncolumns')
                row = cross_table['data'][0]
                for index,column in enumerate(cross_table['columns']):
                    data = data = ["~".join([str(c) for c in column])]
                    data.append(float(row[index]))
                    result['resultset'].append(data)
            
        return result
