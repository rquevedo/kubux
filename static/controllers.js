// Controllers for Cubes viewer Application
//

var ViewerControllers = angular.module('ViewerControllers', []);

ViewerControllers.controller('ViewerNavigatorControler', ['$scope','$http','$q','get_data',
    function ($scope, $http,$q,get_data) {
    	
        $scope.view_mode = 'table';
        get_data.set('view_mode',$scope.view_mode,false);

        var model_list = $http.get('model_list');

        $q.all([model_list]).then(function(results){
            $scope.models = results[0].data;

        });
        //selection area models
        $scope.selected_model = get_data.get('selected_model')
        $scope.selected_cube = get_data.get('selected_cube')
        
        $scope.readCubes = function (){
        	
        	var cube_list = $http.get('cube_list/'+$scope.selected_model.position)
        	get_data.set('selected_model',$scope.selected_model,false)
        	$q.all([cube_list]).then(function(results){
	            $scope.cubes = results[0].data;
	            $scope.selected_cube = $scope.cubes[0]
	            get_data.set('selected_cube',$scope.selected_cube,true)
	
	        });
        	
        }
        $scope.manageModelChange = function (){
        	
        	var cube_list = $http.get('cube_list/'+$scope.selected_model.position)
        	get_data.set('selected_model',$scope.selected_model,false)
        	$q.all([cube_list]).then(function(results){
	            $scope.cubes = results[0].data;
	            $scope.selected_cube = $scope.cubes[0]
	            get_data.set('selected_cube',$scope.selected_cube,true)
	
	        });
        	
        }

        $scope.get_nav_action = function(mode) {
    		
    		$scope.view_mode = mode;
    		get_data.set('view_mode',$scope.view_mode,true)
		}

        
    }
]);
ViewerControllers.controller('ViewerBottomControler', ['$scope','$http','$q',
    function ($scope, $http,$q) {
    	
    	
    }
    
]);
ViewerControllers.controller('FiltersModalControler', ['$scope','$http','$q','get_data',
    function ($scope, $http,$q,get_data) {

    	$scope.members = [];
    	$scope.$on('modal_Changed', function(event, index) {

    		console.log(index);
    		data = get_data.get('filters')[index].data
			data['cube'] = get_data.get('selected_cube').name
		  
		
			var cube_request_result = $http.post('request_members',data);

        	$q.all([cube_request_result]).then(function(results){
	            $scope.$broadcast('show_datatable',results[0].data);
	            $scope.$broadcast('openModal',{'index':index});
	
	        });

	         
	    });

	    $scope.done_dialog = function(data){

	    	filters = get_data.get('filters')
	    	datafilter = filters[data.index].data
	    	datafilter['data'] = data
	    	filters[data.index]['data'] = datafilter
	    	get_data.set('filters',filters,true);

	    }
	    
    	
    	
    }
    
]);
ViewerControllers.controller('ViewerBottomLeftControler', ['$scope','$http','$q','get_data',
    function ($scope, $http,$q,get_data) {
    	
    	readDimensionsAndMeasures = function (){
        	
        	var dim_list = $http.get('dim_list/'+$scope.selected_cube.name)
        	var agg_list = $http.get('agg_list/'+$scope.selected_cube.name)
        	$q.all([dim_list,agg_list]).then(function(results){
	            $scope.dimensions = results[0].data;
	            $scope.aggregates = results[1].data;
	            get_data.set('dimensions',$scope.dimensions,false);
	            get_data.set('aggregates',$scope.aggregates,false);
	
	        });
        	
        }
        $scope.get_level_label = function (levels,key){
        	
        	for(var i=0,j=levels.length; i<j; i++){
			  if(levels[i].name === key){
			  	return levels[i].label
			  }
			};
			return key
        		
        	
        }
        $scope.$on('selected_cube_Changed', function(event, value) {
	        $scope.selected_cube = value;
	        readDimensionsAndMeasures()
	    });
    	
    	
    }
    
]);
ViewerControllers.controller('ViewerBottomRightControler', ['$scope','$http','$q','get_data','$sce','utils',
    function ($scope, $http,$q,get_data,$sce,utils) {
    	
    	$scope.rows = [];
    	$scope.columns = [];
    	$scope.aggregates = [];
    	$scope.filters = [];

    	get_data.set('filters',$scope.filters,false)
    	
    	$scope.dropped_element = function(data) {
    		
    		if(data.sourceIndex != null){
    			
    			if(data.sourceIndex < data.index){
    				
    				data.index--;
    				
    			}
    			$scope[data.srcModel].splice(data.sourceIndex,1);
    			$scope.$apply(function () {
					
					if(data.index != -1){
						$scope[data.targetModel].splice(data.index,0,{data:data.data})
					}
					else{
						$scope[data.targetModel].push({data:data.data})
					}
				    
				});
				request_cube_data();
    			
    		}
    		else if(!utils.inArray({data:data.data},$scope[data.targetModel],'data')){
				$scope.$apply(function () {
					
					if(data.index != -1){
						$scope[data.targetModel].splice(data.index,0,{data:data.data})
					}
					else{
						$scope[data.targetModel].push({data:data.data})
					}
				    
				});
				request_cube_data();
			}
		
		}

		$scope.dropped_filter = function(data) {
    		
    		if(!utils.inArray({data:data.data},$scope.filters,'data')){
	    		$scope.$apply(function () {
						
					$scope.filters.push({data:data.data})
					get_data.set('filters',$scope.filters,false)
					get_data.set('modal',$scope.filters.length -1,true)
				    
				});
	    	}
    		
		
		}
		$scope.openmodal = function(index) {
    		 get_data.set('modal',index,true)
		}
		// $scope.open = function (size) {

		//     $scope.modalInstance = $uibModal.open({
		// 	      animation: true,
		// 	      templateUrl: 'views/cubes_viewer/modal.html',
		// 	      controller: 'FiltersModalControler'
		//      });
	 //    }
		
		$scope.delete_row = function(index) {
    		
		    $scope.rows.splice(index,1);
		    request_cube_data();
		}
		$scope.delete_column = function(index) {
    		
		    $scope.columns.splice(index,1);
		    request_cube_data();
		}
		$scope.delete_measure = function(index) {
    		
		    $scope.aggregates.splice(index,1);
		    request_cube_data();
		}
		$scope.delete_filter = function(index) {
    		
		    $scope.filters.splice(index,1);
		    //request_cube_data();
		}
		make_request_object = function () {
		  
		  	var request = {}
			request['rows'] = $scope.rows
			request['columns'] = $scope.columns
			request['aggregates'] = $scope.aggregates
			request['cube'] = get_data.get('selected_cube').name
			request['model'] = get_data.get('selected_model').position
			request['formatter'] = get_data.get('view_mode')
			request['filters'] = get_data.get('filters')
			return request
		  
		}
		request_cube_data = function(){

			
			var request = make_request_object();
			console.log(request);
			var cube_request_result = $http.post('request_cube_data',{data:request});

        	$q.all([cube_request_result]).then(function(results){
	            $scope.pageContent = results[0].data.data;//$sce.trustAsHtml(results[0].data.html);
	            $scope.$broadcast('pageContentChange',{pageContent:$scope.pageContent,rows_count:$scope.rows.length,
	            	columns_count:$scope.columns.length,formatter:request['formatter']});
	
	        });

		}

		$scope.$on('view_mode_Changed', function(event, value) {
	        request_cube_data();
	    });
	    $scope.$on('filters_Changed', function(event, value) {
	        request_cube_data();
	    });
    	
    	
    }
    
]);

