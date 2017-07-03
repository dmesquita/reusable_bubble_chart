/*
* Original Author: Deborah Mesquita
* Source: 
*	https://bl.ocks.org/dmesquita/37d8efdb3d854db8469af4679b8f984a
*	https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46
* Modified by: Taylor White
* Modified on: July 2, 2017
* Purpose:
* 	Generate a reusable bubble chart
*/

function bubbleChart() {
	var width = 960,
	height = 960,
	minRadius = 6,
	maxRadius = 20,
	columnForColors = "category",
	columnForTitle = "title",
	columnForRadius = "views",
	forceApart = -50,
	unitName="hearts",
	customColors=false,
	customRange,
	customDomain,
	showTitleOnCircle=false;

	function chart(selection) {
		var data = selection.enter().data();
		var div = selection,
		svg = div.selectAll('svg');
		svg.attr('width', width).attr('height', height);

		var tooltip = selection
		.append("div")
		.style("position", "absolute")
		.style("visibility", "hidden")
		.style("color", "white")
		.style("padding", "8px")
		.style("background-color", "#626D71")
		.style("border-radius", "6px")
		.style("text-align", "center")
		.style("font-family", "monospace")
		.style("width", "400px")
		.text("");


		var simulation = d3.forceSimulation(data)
		.force("charge", d3.forceManyBody().strength([forceApart]))
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.on("tick", ticked);

		function ticked(e) {
			node.attr("transform",function(d) {
				return "translate(" + [d.x+(width / 2), d.y+(height / 2)] +")";
			});
		}

		var colorCircles;
		if (!customColors) {
			colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
		} 
		else {
			colorCircles = d3.scaleOrdinal()
			.domain(customDomain)
			.range(customRange);
		}
	
		var minRadiusDomain = d3.min(data, function(d) {
			return +d[columnForRadius];
		});
		var maxRadiusDomain = d3.max(data, function(d) {
			return +d[columnForRadius];
		});
		var scaleRadius = d3.scaleLinear()
		.domain([minRadiusDomain, maxRadiusDomain])
		.range([minRadius, maxRadius])

		var node = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("g")
		.attr('transform', 'translate(' + [width / 2, height / 2] + ')');		
	
		node.append("circle")
		.attr("id",function(d,i) {
			return i;
		})
		.attr('r', function(d) {
			return scaleRadius(d[columnForRadius]);
		})
		.style("fill", function(d) {
			return colorCircles(d[columnForColors]);
		})
		.on("mouseover", function(d) {
			tooltip.html(d[columnForTitle] + "<br/>" + d[columnForColors] + "<br/>" + d[columnForRadius] + " "+ unitName);
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
		})
		.on("mouseout", function() {
			return tooltip.style("visibility", "hidden");
		});
		node.append("clipPath")
		.attr("id",function(d,i) {
			return "clip-"+i;
		})
		.append("use")
		.attr("xlink:href",function(d,i) {
			return "#" + i;
		});
		if (showTitleOnCircle) {
			node.append("text")
			.attr("clip-path",function(d,i) {
				return "url(#clip-" + i + ")"
			})
			.attr("text-anchor", "middle")
			.append("tspan")
			.attr("x",function(d) {
				return 0;//-1*scaleRadius(d[columnForRadius])/3;
			})
			.attr("y",function(d) {
				return ".3em";//scaleRadius(d[columnForRadius])/4;
			})
			.text(function(d) {
				return d[columnForTitle];
			})
			.on("mouseover", function(d) {
				tooltip.html(d[columnForTitle] + "<br/>" + d[columnForColors] + "<br/>" + d[columnForRadius] + " "+ unitName);
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function() {
				return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
			})
			.on("mouseout", function() {
				return tooltip.style("visibility", "hidden");
			});
		}
	}

	chart.width = function(value) {
		if (!arguments.length) {
			return width;
		}
		width = value;
		return chart;
	};

	chart.height = function(value) {
		if (!arguments.length) {
			return height;
		}
		height = value;
		return chart;
	};


	chart.columnForColors = function(value) {
		if (!arguments.length) {
			return columnForColors;
		}
		columnForColors = value;
		return chart;
	};
	
	chart.columnForTitle = function(value) {
		if (!arguments.length) {
			return columnForTitle;
		}
		columnForTitle = value;
		return chart;
	};

	chart.columnForRadius = function(value) {
		if (!arguments.length) {
			return columnForRadius;
		}
		columnForRadius = value;
		return chart;
	};
	
	chart.minRadius = function(value) {
		if (!arguments.length) {
			return minRadius;
		}
		minRadius = value;
		return chart;
	};
	
	chart.maxRadius = function(value) {
		if (!arguments.length) {
			return maxRadius;
		}
		maxRadius = value;
		return chart;
	};
	
	chart.unitName = function(value) {
		if (!arguments.length) {
			return unitName;
		}
		unitName = value;
		return chart;
	};
	
	chart.forceApart = function(value) {
		if (!arguments.length) {
			return forceApart;
		}
		forceApart = value;
		return chart;
	};
	
	chart.showTitleOnCircle = function(value) {
		if (!arguments.length) {
			return showTitleOnCircle;
		}
		showTitleOnCircle = value;
		return chart;
	};
	
	chart.customColors = function(domain,range) {
		customColors=true;
		customDomain=domain;
		customRange=range;
		return chart;
	}

	return chart;
}