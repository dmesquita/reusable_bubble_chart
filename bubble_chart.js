/*
* Original Author: Deborah Mesquita
* Source: 
*	https://bl.ocks.org/dmesquita/37d8efdb3d854db8469af4679b8f984a
*	https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46
* Modified by: Taylor White whitetc2@gmail.com
* Modified on: July 4, 2017
* Purpose:
* 	Generate a reusable bubble chart
*/


/**
 * Instantiate the settings before rendering the bubble chart
 * @class
 * @example
 * var chart = bubbleChart(); // instantiate the chart
 * 
 * // update settings
 * chart.width(850).height(850).minRadius(7).maxRadius(55).forceApart(-170); 
 * 
 * // example of chaining
 * chart.columnForColors("Sex").columnForRadius("BirthCount");
 * chart.customColors(["M","F"],["#70b7f0","#e76486"]).showTitleOnCircle(true);
 * chart.title('Most popular baby names in 2016').columnForTitle("Name");
 * chart.unitName("babies");
 * 
 * // load the data and render the chart 
 * d3.select("#divBubbleChart")
 * 	.data(newData)
 * 	.call(chart);
 * 
 * @returns Chart function so that you can render the chart when ready
 */
function bubbleChart() {
	var width = 960,
	height = 960,
	marginTop = 96,
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
	chartSelection,
	chartSVG,
	showTitleOnCircle=false;

	/**
	 * The command to actually render the chart after setting the settings.
	 * @public
	 * @param {string} selection - The div ID that you want to render in 
	 */
	function chart(selection) {
		var data = selection.enter().data();
		chartSelection=selection;
		var div = selection,
		svg = div.selectAll('svg');
		svg.attr('width', width).attr('height', height);
		chartSVG=svg;

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
				return "translate(" + [d.x+(width / 2), d.y+((height+marginTop) / 2)] +")";
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
		.attr('transform', 'translate(' + [width / 2, height / 2] + ')')
		.style('opacity',1);
			
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

		svg.append('text')
			.attr('x',width/2).attr('y',marginTop)
			.attr("text-anchor", "middle")
			.attr("font-size","1.8em")
			.text(title);
	}


	chart.width = chartWidth;
	chart.height = chartHeight;
	chart.columnForColors = chartColForColors;
	chart.columnForRadius = chartColForRadius;
	chart.columnForTitle = chartColForTitle;
	chart.minRadius = chartMinRadius;
	chart.maxRadius = chartMaxRadius;
	chart.forceApart = chartForceApart;
	chart.unitName = chartUnitName;
	chart.customColors = chartCustomColors;
	chart.showTitleOnCircle = chartShowTitleOnCircle;
	chart.title=chartTitle;
	chart.remove = chartRemove;

	/**
	 * Get/set the height of the chart
	 * Use 'chart.width' to get or set. 
	 * @example
	 * chart.columnForColors(960);	// Sets the width of the SVG to 960
	 * chart.columnForColors();	// returns 960
	 * 
	 * @public
	 * @param {number} [value] - The width of the chart 
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartWidth(value) {
		if (!arguments.length) {
			return width;
		}
		width = value;
		return chart;
	};

	/**
	 * Get/set the height of the chart.
	 * Use 'chart.height' to get or set. 
	 * @example
	 * chart.height(960);	// Sets the height of the SVG to 960
	 * chart.height();		// returns 960
	 * 
	 * @public
	 * @param {number} [value] - The height of the chart
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartHeight(value) {
		if (!arguments.length) {
			return height;
		}
		height = value;
		marginTop=0.05*height;
		return chart;
	};


	/**
	 * Get/set the property used to determine the colors of the bubbles. 
	 * Use 'chart.columnForColors' to get or set. 
	 * @example
	 * chart.columnForColors("Sex");	// Sets the column to birthCount
	 * chart.columnForColors();	// returns "Sex"
	 * @public
	 * @param {string} [value] - Property name to bind the bubble color to.
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartColForColors(value) {
		if (!arguments.length) {
			return columnForColors;
		}
		columnForColors = value;
		return chart;
	};
	
	/**
	 * Get/set the property to determine the titles of the bubbles.
	 * Use 'chart.columnForTitle' to get or set. 
	 * @example
	 * chart.columnForTitle("Name");	// Sets the column to birthCount
	 * chart.columnForTitle();		// returns "Name"
	 * 
	 * @param {string} [value] - Property name to bind the bubble title to.
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartColForTitle(value) {
		if (!arguments.length) {
			return columnForTitle;
		}
		columnForTitle = value;
		return chart;
	};

	/**
	 * Get/set the property to determine the radii of the bubbles.
	 * Use 'chart.columnForRadius' to get or set. 
	 * 
	 * @example
	 * chart.columnForRadius("birthCount");	// Sets the column to birthCount
	 * chart.columnForRadius();		// returns "birthCount"
	 * @public
	 * @param {string} [value] - Property name to bind the bubble radius to. Requires a numerical property.
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartColForRadius (value) {
		if (!arguments.length) {
			return columnForRadius;
		}
		columnForRadius = value;
		return chart;
	};
	
	/**
	 * Get/set the minimum radius of the bubbles.
	 * Use 'chart.minRadius' to get or set. 
	 * @example
	 * 	chart.columnForColors(3); 	// Sets the column to birthCount
	 *  chart.columnForColors();	// returns 3
	 * 
	 * @param {number} [value] - The minimum radius for the width of the bubbles
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartMinRadius(value) {
		if (!arguments.length) {
			return minRadius;
		}
		minRadius = value;
		return chart;
	};
	
	/**
	 * Get/set the maximum radius of the bubbles.
	 * Use 'chart.maxRadius' to get or set.
	 * 
	 * @public
	 * @param {number} [value] - The maximum radius of the bubbles for the largest value in the dataset
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartMaxRadius(value) {
		if (!arguments.length) {
			return maxRadius;
		}
		maxRadius = value;
		return chart;
	};
	
	/**
	 * Get/set the unit name for the property the is represented by the radius of the bubbles. 
	 * Used in the tooltip of the bubbles.
	 * Use 'chart.unitName' to get or set.
	 * @example
	 * chart.unitName(" babies");	// Sets the column to birthCount
	 * chart.unitName();		// returns " babies"
	 * 
	 * @public
	 * @param {any} [value] - The unit name to display on the tooltip when hovering over a bubble
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartUnitName(value) {
		if (!arguments.length) {
			return unitName;
		}
		unitName = value;
		return chart;
	};
	
	/**
	 * Get/set the force the separates and pushes together the bubbles on loading of the chart
	 * Use 'chart.forceApart' to get or set.
	 * @example
	 * chart.forceApart(150);	// Sets the column to birthCount
	 * chart.forceApart();	// returns 150
	 * 
	 * @public
	 * @param {any} [value] - Determines the force to separate the bubbles from each other when loading the chart
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartForceApart(value) {
		if (!arguments.length) {
			return forceApart;
		}
		forceApart = value;
		return chart;
	};
	
	/**
	 * Get/set the property that determines if we show or hide the title of the data on the bubbles.
	 * Use 'chart.showTitleOnCircle' to get or set.
	 * @example
	 * chart.showTitleOnCircle(true); 	
	 * chart.forceApart();	// returns true
	 * 
	 * @public
	 * @param {boolean} [value] - Determines whether to show or hide the title of the data on the bubbles
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartShowTitleOnCircle(value) {
		if (!arguments.length) {
			return showTitleOnCircle;
		}
		showTitleOnCircle = value;
		return chart;
	};
	
	/**
	 * Set the domain and range of the colors used for the bubbles. This is only needed if you want to use custom colors in the chart.
	 * Use 'chart.customColors' to set.
	 * @example
	 * chart.customColors(["M","F"], ["#70b7f0","#e76486"]); 	// Sets the custom colors domain and range
	 * 
	 * @param {any[]} domain - The domain. This is the set of categories used for binding the colors.
	 * @param {string[]} range - The range. This is an array of color codes that you want to represent each category in the domain.
	 * 							 Note: The length of the array must perfectly match the length of the domain array.
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartCustomColors(domain,range) {
		customColors=true;
		customDomain=domain;
		customRange=range;
		return chart;
	};
	
	/**
	 * Get/set the property that determines the title of the chart.
	 * Use 'chart.title' to get or set.
	 * @example
	 * chart.title("Birth Count in the U.S. in 2016"); // Sets the chart title
	 * chart.title();	// returns "Birth Count in the U.S. in 2016"
	 * @public
	 * @param {string} value - The title of the chart
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartTitle(value) {
		if (!arguments.length) {
			return title;
		}
		title = value;
		return chart;
	}
	
	/**
	 * Animate the removal of data from the chart (and the title)
	 * @public
	 * @param {function} [callback] - At the end of each node animation call this function for each node
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartRemove(callback) {
		chartSVG.selectAll("text")
		.style("opacity",1)
		.transition()
		.duration(500)
		.style("opacity", "0")
		.remove();	
		if (!arguments.length) {	
			chartSVG.selectAll("g")
			.style("opacity",1)
			.transition()
			.duration(500)
			.style("opacity", "0")
			.remove();		
		}
		else {			
			chartSVG.selectAll("g")
			.style("opacity",1)
			.duration(500)
			.style("opacity", "0")
			.remove()
			.on("end", callback);
		}
		return chart;
	}
	
	return chart;
}
