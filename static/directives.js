ViewerControllers.directive("minOrMaxPanel", ["$rootScope" ,function($rootScope) {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
        	
        	//hide indicators
			var indicators_visible = false;

		
			var showIndicators = function(){
				$('.droppable-area [class|="container"]').hide();
		        $('.droppable-area').css({width:35,padding:'10px 0'});
		        $('.droppable-area > div:first-child').toggleClass('centered');
		        $('.droppable-area > div> a').text('').addClass('glyphicon glyphicon-arrow-right');
		        $('.indicators').show();
		        indicators_visible = true;		
			};
		
			var hideIndicators = function(){
		        $('.indicators').hide();
		        $('.droppable-area').css({width:200,padding:10});
		        $('.droppable-area > div:first-child').toggleClass('centered');
		        $('.droppable-area > div> a').text('Hide').removeClass('glyphicon glyphicon-arrow-right');	
				$('.droppable-area [class|="container"]').show();	
				indicators_visible = false;
			}
		
		    $('.droppable-area>div:first-child>a').click(function(){
		    	if(indicators_visible)
			        hideIndicators();
		        else
		        	showIndicators();
		        //$rootScope.$broadcast('ContentManagerSizeChange');
		    });
        }
    }
}]);
ViewerControllers.directive("setBottomHeight", function() {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
        	
        	
        	var height = function () {
        		return $(document).height() - 36;
			  
			}
        	$BottomHeightElement = $(element);
        	$BottomHeightElement.css({'height':height()})
        	$contentManager = $('.content-manager');
        	$contentManager.height(function(){
				return $contentManager.parent().height() - 20 - $contentManager.prev().outerHeight() - $contentManager.prev().prev().height(); //20 is the parent's padding
				
        	});
        }
    }
});
ViewerControllers.directive("toggleFilterArea",['$rootScope', function($rootScope) {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
        	var visible = true;
        	$toggleFilterAreaElement = $(element);
        	$filterArea = $toggleFilterAreaElement.next();
        	$toggleFilterAreaElement.bind('click',function(){
        		
        		if(visible){
					$('.data-area > a:first-child').removeClass('glyphicon-eye-close');
					$('.data-area > a:first-child').addClass('glyphicon-eye-open');
        			$filterArea.css('display','none');
        		}
        		else{
					$('.data-area > a:first-child').removeClass('glyphicon-eye-open');
					$('.data-area > a:first-child').addClass('glyphicon-eye-close');
        			$filterArea.css('display','block');
        		}
        		visible = !visible;
        		$rootScope.$emit('toggleFilterChange',visible);
        		
        	});
        	
        }
    }
}]);
ViewerControllers.directive("adjustContentManagerSize",['$rootScope', function($rootScope) {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
        	
        	$ContentManagerSizeElement = $(element);
			$rootScope.$on('toggleFilterChange', function( eventobject,visible ) {
        		
				$ContentManagerSizeElement.height(function(){
					if(visible){
						return $ContentManagerSizeElement.parent().height() - $ContentManagerSizeElement.prev().outerHeight()*2 - 46; //30: height of the <a>Filter Area</a> + parent padding
					}
					else{
						
						return $ContentManagerSizeElement.parent().height() - 25; //25: height of the <a>Filter Area</a>
					}
	        		
	        	});
	        	$rootScope.$broadcast('ContentManagerSizeChange');
				
			} );
        	
        }
    }
}]);
ViewerControllers.directive('contentManager',['$rootScope' , function($rootScope) {

  return {
  	
	link: function( $scope, element, attributes ) {
		
		var TableMode =  {
			
			$contentManagerElement : $(element),
			otable : null,
			warapper_height:0,
			init : function(data,rows_count,columns_count){
				
				
				this.$contentManagerElement.html('');
				this.$contentManagerElement.html(data);
				$table = $('> table',this.$contentManagerElement);
				this.otable = $table.dataTable({
				   	
				    "sScrollY": "1px",
					"bPaginate": false,
					//"bSort": false,
					"sScrollX": "100%",
					"bScrollCollapse": true,
					"bSortClasses": false,
					//"dom": 'T<"clear">lfrtip',
					//"bScrollInfinite": true
					//"sDom": "frtiS",
					//"bDeferRender": true
					
					
				   	
			    });
			    new $.fn.dataTable.FixedColumns( this.otable, {
			        leftColumns: rows_count
			    } );
			    this.set_warapper_height();
			    this.fnInitComplete();
				
			},
			set_warapper_height : function (){
				
				this.otable.fnSettings().oScroll.sY = 1;
			    this.otable.fnDraw();
			    var wrapper_height = $('div.dataTables_wrapper',this.$contentManagerElement).height();
			    this.warapper_height =  wrapper_height;
				
			},
			fnInitComplete : function(){
		    		
		    		var container_height = this.$contentManagerElement.height();
				    this.otable.fnSettings().oScroll.sY = container_height - this.warapper_height;
				    this.otable.fnDraw();
				    this.otable.fnAdjustColumnSizing();
			    	
			    	
		    }
		  
		}
		var GraphMode =  {
			
			$contentManagerElement : $(element),
			init : function(data,formatter){
				
				
				this.$contentManagerElement.html('<div id="chart_container"></div>');


				if( formatter == 'bar'){

					chart = new pvc.BarChart({
					    canvas: "chart_container",
					    width: 575,
					    height: 475,
					    title: "",
						titleSize:  {width: '0'},
						//barSizeMax: 0,	
						legend:     true,
					    clickable:  true,
					    hoverable:  true,
					    axisGrid: true,
					    valuesVisible:   false,
					    extensionPoints: {
									    	xAxisLabel_textAngle:    -1.48,
									    	xAxisLabel_textAlign:    'right',
					    }
					});	
				}
				else if( formatter == 'line'){	
					chart = new pvc.LineChart({
					    canvas: "chart_container",
					    width: 575,
					    height: 475,
					    title: "",
						titleSize:  {width: '0'},
						//barSizeMax: 0,	
						legend:     true,
					    clickable:  true,
					    hoverable:  true,
					    axisGrid: true,
					    valuesVisible:   false,
					    extensionPoints: {
									    	xAxisLabel_textAngle:    -1.48,
									    	xAxisLabel_textAlign:    'right',
					    }
					});	
				}
				else if( formatter == 'bullet'){
					chart = new pvc.BulletChart({
					    canvas: "chart_container",
					    width: 575,
					    height: 475,
					    title: "",
						titleSize:  {width: '0'},
						//barSizeMax: 0,	
						legend:     true,
					    clickable:  true,
					    hoverable:  true,
					    axisGrid: true,
					    valuesVisible:   false,
					    extensionPoints: {
									    	xAxisLabel_textAngle:    -1.48,
									    	xAxisLabel_textAlign:    'right',
					    }
					});	
				}
				else if( formatter == 'pie'){
					
					chart = new pvc.PieChart({
					    canvas: "chart_container",
					    width: 575,
					    height: 475,
					    title: "",
						titleSize:  {width: '0'},
						//barSizeMax: 0,	
						legend:     true,
					    clickable:  true,
					    hoverable:  true,
					    axisGrid: true,
					    valuesVisible:   false,
					    extensionPoints: {
									    	xAxisLabel_textAngle:    -1.48,
									    	xAxisLabel_textAlign:    'right',
					    }
					});	
				}
				chart.setData(data,{crosstabMode: false, seriesInRows: false});
				chart.render();
				
				
			}
		  
		}
	    $scope.$on('pageContentChange', function( eventobject,data ) {
        	
        	if (data.formatter == 'table'){
				TableMode.init(data.pageContent,data.rows_count,data.columns_count);
			}
			else{
				GraphMode.init(data.pageContent,data.formatter);
			}
			
		 } );
		$rootScope.$on('ContentManagerSizeChange', function( eventobject,data ) {
        	
			TableMode.fnInitComplete();
			
		} );
       }
    }
}]);
ViewerControllers.directive('bitree',['$rootScope' , function() {

  return {
  	
	link: function( $scope, element, attributes ) {
		
		console.log('Directiva del bitree reportandose');
		var bitree = function (element) {
			
			var $el = $(element);
	         if($el.is('li')){
                //icon
                $el.prepend('<span class="bitree-icon"></span>');
                if($el.parent().is('ul')){
                	$el.parent().addClass('bitree');
                }
                if($el.parent().is('ul') && $el.parent().parent().is('li')){
                	
                	if(!$el.parent().siblings().is('.grouper')){
	            		$el.parent().parent().prepend('<span class="bitree-icon grouper"></span>');
	                	//bind click events to show/hide nested lists
	                    $el.parent().siblings().click(function(e){
	                        var $target = $(e.target);
	                        $target.siblings('ul').toggle('fast');
	                        $target.toggleClass('closed');
	                        $target.siblings('.grouper').toggleClass('closed');
	                    })
                   	}
                	
                }
            }
		  
		}
		
	    $scope.$on('dimension', function( eventobject,element ) {
        	element.addClass(eventobject.name);
			bitree(element);
		 } );
	    $scope.$on('hierarchy', function( eventobject,element ) {
	        element.addClass(eventobject.name);
			bitree(element);
		} );
	    $scope.$on('level', function( eventobject,element ) {
	        element.addClass(eventobject.name)
			bitree(element);
		} );
		$scope.$on('measure', function( eventobject,element ) {
	        element.addClass(eventobject.name)
			bitree(element);
		} );
       }
    }
}]);
ViewerControllers.directive("onRepeatDone", function() {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
            $scope.$emit(attributes["onRepeatDone"], element);
        }
    }
});
ViewerControllers.directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
	    return {
	        restrict: 'A',
	        scope: {
	            dndData : '@',
	            dndFromTarget:'='
	        },
	        link: function(scope, el, attrs, controller) {

	        
	        	var $element = $(el);
	            var id = $element.attr("id");
	            if (!id) {
	                id = uuid.new()
	                $element.attr("id", id);
	            }
	            
	            $element.draggable({
	    			helper:'clone',
	    			start: function( e, ui ) {

						ui.helper.addClass('dragged');
						if(scope.dndFromTarget != undefined){
							$.data( ui.helper, "data", {'id':id,'data':scope.$eval(scope.dndData),'srcindex':scope.dndFromTarget,
								'srcmodel':attrs.ngModel} );
						}
						else{
							
							$.data( ui.helper, "data", {'id':id,'data':scope.$eval(scope.dndData)});
						}
		                //$rootScope.$emit("LVL-DRAG-START");
	    				
	    				
	    			},
	    			// stop: function( e, ui ) {
// 	    				
	    				// $rootScope.$emit("LVL-DRAG-END");
	    			// }
	    		});
	            
	            // el.bind("dragstart", function(e) {
	                // e.dataTransfer.setData('text', id);
					// e.dataTransfer.setData('type', scope.dndType);
					// e.dataTransfer.setData('ids', JSON.stringify(scope.$eval(scope.dndData)));
					// e.dataTransfer.setData('label', scope.dndLabel);
					// if(scope.dndFromTarget != undefined){
						// e.dataTransfer.setData('srcindex', scope.dndFromTarget);
						// e.dataTransfer.setData('srcmodel', attrs['ngModel']);
					// }
	                // $rootScope.$emit("LVL-DRAG-START");
	            // });
	            
	            // el.bind("dragend", function(e) {
	                // $rootScope.$emit("LVL-DRAG-END");
	            // });
	        }
    	}
	}]);

ViewerControllers.directive('dropPosition', ['$rootScope', function($rootScope) {
		//TODO : Check events
	    return {
	        restrict: 'A',
	        link: function(scope, el, attrs, controller) {
	        	
	        	el.droppable({
					
					over: function( e, ui ) {
						
						$(el).addClass('drop-position');
						
					},
					out: function( e, ui ) {
						$(el).removeClass('drop-position');
					},						
					tolerance: 'intersect',			
				});
	        	$(el).bind('dragenter',function(){
	        		console.log('entro al evento');
					$(el).addClass('drop-position');
				});
				$(el).bind('dragleave',function(){
					console.log('entro al evento');
					$(el).removeClass('drop-position');
					
				});
	        }
    	}
	}]);
ViewerControllers.directive('lvlDropTarget', ['$rootScope', function($rootScope) {
	    return {
	        restrict: 'A',
	        scope: {
	            onDrop: '&',
	            aceptedTypes:'@'
	        },
	        link: function(scope, el, attrs, controller) {
	            
	            el.droppable({
					
					over: function( e, ui ) {
						
						var type = $.data( ui.helper, "data").data.type
						if (type == scope.aceptedTypes){
							el.addClass('lvl-over');
						}
						
					},
					out: function( e, ui ) {
						
						el.removeClass('lvl-over');
					},
					drop: function(e, ui) {
						
						
						//Remove hover class
		            	el.removeClass('lvl-over');
		            	
		            	var textnode = $.data( ui.helper, "data").id
		            	var $position = $(el).find('.drop-position').first(); 
		            	var positionIndex = $position.parent().children().index($position);
		            	if (positionIndex != -1){
		            		positionIndex++;
		            		$position.removeClass('drop-position');
		            	}
		            	var src_index = null;//Index of dropped element in source container
		            	var src_model = null;//Type of source container
		            	var div_index = null;
			    		
		            	if($.data( ui.helper, "data").srcindex != 'undefined'){
		            		
		            		div_index = $position.parent().children().index($('#'+textnode));
		            		var src_index = $.data( ui.helper, "data").srcindex;
		            		var src_model = $.data( ui.helper, "data").srcmodel;
		            		
		            	}
						if (e.preventDefault) {
							e.preventDefault(); // Necessary. Allows us to drop.
						}
						
						if (e.stopPropagation) {
							e.stopPropagation(); // Necessary. Allows us to drop.
						}
		            	var data = $.data( ui.helper, "data").data;
		            	var type = $.data( ui.helper, "data").data.type;
		            	if (type == scope.aceptedTypes){
			                
			                scope.onDrop({data:{data:data,index:positionIndex,sourceIndex:src_index,
			                	divIndex:div_index,srcModel:src_model,targetModel:attrs['ngModel']}});
			           }
				        
				        									        
					},							
					tolerance: 'intersect',			
				});
	         
	        }
    	}
}]);

ViewerControllers.directive('btmodal',['$rootScope' , function($rootScope) {

  return {

  	scope: {
        onclose: '&',
        ondone:'&'
    },
  	
	link: function( $scope, element, attributes ) {
		
		$element = $(element);
		var index = null;

		var get_rows_selected = function(){
			var selected = [];
			var labels = []
			$rows = $(' table tr.datatable-el-selected',$element)
		    $rows.each(function( index ) {
		    	key = $(this).attr('key');
		      	selected.push(key);
		      	labels.push($('> td',this).text());
		    });
		    var label = "Incluir: " + labels.join(',');
		    return {'keys':selected,'label':label};
		};

		$('.btn-primary').bind('click', function(e) {	
			
			filters = get_rows_selected();
			$scope.ondone({data:{'filters':filters,'index':index}});	
			$element.modal('hide')


		});
		
	    $scope.$on('openModal', function( eventobject,data ) {
        	
        	$element.modal();
        	index = data.index;

			
		 } );
		
       }
    }
}]);

ViewerControllers.directive('datatable',['$rootScope' , function($rootScope) {

  return {
  	
	link: function( $scope, element, attributes ) {
		
		$datatable_element = $(element);
		that = this;

		$scope.$on('show_datatable', function( eventobject,data ) {
        	
        	$datatable_element.html('');
			$datatable_element.html(data['table']);
			console.log(data['keys']);
			$table = $('> table',$datatable_element);
			this.otable = $table.dataTable({
			   	
			   	"scrollY": "200px",
			    "bSortClasses": false,
                "processing": true,
                "sDom": "frtiS",
                "DeferRender": true,
				"oLanguage": {
                                "sZeroRecords": "No se encontraron elementos",
                                "sInfo": "Mostrando del _START_ al _END_ de _TOTAL_ elementos",
                                "sInfoEmpty": "Mostrando del 0 al 0 de 0 elementos",
                                "sInfoFiltered": "(filtrados de _MAX_ elementos)",
                                'sSearch': "Buscar",
                            },
				
				
			   	
		    });
		    $table.on('click', 'tr', function () {
		        $(this).toggleClass('datatable-el-selected');
		    } );

		    jQuery.each(data['keys'], function(index, value) {
		    	console.log("clase por defecto");
		    	console.log(value);
		    	console.log($table);
		    	console.log($('tr[key="' + value + '"]',$table));
			    $('tr[key="' + value + '"]',$table).addClass("datatable-el-selected");
			});
			
		 } );

		
       }
    }
}]);
