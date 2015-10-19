ViewerControllers.service('get_data', function($rootScope) {
	
    var objectValue = {
    };
    
    return {
        get: function(key) {
            return objectValue[key];
        },
        set: function(key,value,broadcast) {
            objectValue[key] = value;
            if (broadcast){
                $rootScope.$broadcast(key+'_Changed',value);
            }
        }
    }
});
ViewerControllers.factory('uuid', function() {
    var svc = {
        new: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },
        
        empty: function() {
          return '00000000-0000-0000-0000-000000000000';
        }
    };
    
    return svc;
});
ViewerControllers.factory('utils', function() {
	
	var utils = {
		
		inArray : function (object,array,key) {
			
			for (var i=0; i < array.length; i++) {
			   if (this.equal(array[i][key],object[key])){
			   		return true;
			   }
			};
			return false
		  
		},
		equal : function( x, y ) {
			  if ( x === y ) return true;
			    // if both x and y are null or undefined and exactly the same
			
			  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
			    // if they are not strictly equal, they both need to be Objects
			
			  if ( x.constructor !== y.constructor ) return false;
			    // they must have the exact same prototype chain, the closest we can do is
			    // test there constructor.
			
			  for ( var p in x ) {
			    if ( ! x.hasOwnProperty( p ) ) continue;
			      // other properties were tested using x.constructor === y.constructor
			
			    if ( ! y.hasOwnProperty( p ) ) return false;
			      // allows to compare x[ p ] and y[ p ] when set to undefined
			
			    if ( x[ p ] === y[ p ] ) continue;
			      // if they have the same strict value or identity then they are equal
			
			    if ( typeof( x[ p ] ) !== "object" ) return false;
			      // Numbers, Strings, Functions, Booleans must be strictly equal
			
			    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
			      // Objects and Arrays must be tested recursively
			  }
			
			  for ( p in y ) {
			    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
			      // allows x[ p ] to be set to undefined
			  }
			  return true;
			}
		
	}
	return utils;
    
});