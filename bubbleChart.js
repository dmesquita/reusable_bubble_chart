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
	unitName="hearts";

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
			node.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			});
		}

		var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
		var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
			return +d[columnForRadius];
		}), d3.max(data, function(d) {
			return +d[columnForRadius];
		})]).range([minRadius, maxRadius])

		var node = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr('r', function(d) {
			return scaleRadius(d[columnForRadius])
		})
		.style("fill", function(d) {
			return colorCircles(d[columnForColors])
		})
		.attr('transform', 'translate(' + [width / 2, height / 2] + ')')
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

	return chart;
}