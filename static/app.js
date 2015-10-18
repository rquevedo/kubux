var _ = {};

_.map = function(ary, f) {
  var ret = [];
  for (var i = 0; i < ary.length; i++) {
    ret.push(f(ary[i]));
  }
  return ret;
};

_.filter = function(ary, f) {
  var ret = [];
  for (var i = 0; i < ary.length; i++) {
    if ( f(ary[i]) ) ret.push(ary[i]);
  }
  return ret;
};

_.find = function(ary, f) {
  var i;
  if (Object.prototype.toString.call(ary) === '[object Array]') {
    for (i = 0; i < ary.length; i++) {
      if ( f(ary[i]) ) return ary[i];
    }
  } else {
    for (i in ary) {
      if ( f(ary[i]) ) return ary[i];
    }
  }
  return null;
};

_.isString = function(o) {
  return Object.prototype.toString.call(o) === '[object String]';
};


// Move item in array from from_index to to_index
_.moveItem = function (array, from_index, to_index) {
    array.splice(to_index, 0, array.splice(from_index, 1)[0]);
    return array;
};

_.relativeMoveItem = function(array, obj, offset){
    // Direction: -1=down 1=up
    from_index = array.indexOf(obj);
    to_index = from_index + offset;
    to_index = to_index < 0 ? 0 : to_index;
    to_index = to_index >= array.length ? array.length-1 : to_index;
    _.moveItem(array, from_index, to_index);
};



var CubesViewerApp = angular.module('CubesViewerApp', [
    'ngRoute',
    'ViewerControllers'
]);
 
CubesViewerApp.config(
    ['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/cubes_viewer/cube-viewer-base.html'
        }).
        otherwise({
            templateUrl: 'views/cubes_viewer/cube-viewer-base.html',
            redirectTo: '/'
        });
    }
]);
