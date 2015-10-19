PropiedadesGraficos = {
	bar : {	
		canvas: "",
		width:  0,
	    height: 0,
	    title: "",
		titleSize:  {width: '0'},
		barSizeMax: 0,	
	    clickable:  true,
	    hoverable:  true,
	    axisGrid: true,
	    valuesVisible:   false,
	    extensionPoints: {
					    	xAxisLabel_textAngle:    -1.48,
					    	xAxisLabel_textAlign:    'right',
	    }
	},
	barline : {
		canvas: "",
		width: 0,
		height: 0,
		title: "",
		titleSize:  {width: '0'},

		plot2: true,
	    plot2Series: [],
	    plot2NullInterpolationMode: 'linear',
	    
	    clickable:  true,
	    hoverable:  true,
	    legend:     true,
	    
	    axisGrid: true,
	    orthoAxisOffset: 0.1,
	    extensionPoints: {
	        plot2Line_lineWidth: 4,
	        plot2Dot_shapeSize: 20,
	    }

	},
	bullet: {
	    canvas: "",
		width: 0,
		height: 0,
	    orientation: "vertical",
	    bulletTitle: "",
	    bulletTitlePosition: "bottom",
   
	},
	line: {
		canvas: "",
		width: 0,
	    height: 0,
	    hoverable: true,
	    title: "",
		titleSize:  {width: '0'},
	    legend: true,
	    nullInterpolationMode: 'linear',
	    orientation: 'vertical',
	    dotsVisible: true,
	    axisGrid: true,
	    orthoAxisOriginIsZero: false,
	    valuesVisible: false,
	    yAxisPosition: "right",
	},
	pie: {
		canvas: "",
		width: 0,
	    height: 0,
	    hoverable: true,
	    title: "",
		titleSize:  {width: '0'},
	    legend: true,
	    //valuesOverflow: 'trim',
	    valuesOptimizeLegibility : false,
	    clickable:  true,
	    valuesVisible: true,
	    valuesMask: "{category} ({value.percent})",
	    // from http://flatuicolors.com/     and      http://bootflat.github.io/color-picker.html
	    //		blue      sunflower alizarin dodger blue eucalyptus sumac-dyed lynch  sky color pomegranate turquoise
	    colors: ["#1F77B4","#FFCE54","#FC6E51","#19B5FE","#26A65B","#E08A1E","#6C7A89","#4D8FAC","#c0392b","#1abc9c"],
	}
}