let margin = {top: 20, right: 30, bottom: 80, left: 80},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let xScale = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

let yScale = d3.scale.linear()
  .range([height, 0]);

let xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

let yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(10);

let svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "chart");

let chart = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("directory.csv", function(data) {
  let data1 = data.filter(d => d['Country'] == "US")
  let data2 = d3.map(data1, function(d){return d["State/Province"]}).keys()

  let stateNumStores = [];
  let numStores =[];
  for (let i = 0; i < data2.length; i++) {
    stateNumStores.push({
      state: data2[i],
      value: data1.map((row) => row["State/Province"]).filter(d => d == data2[i]).length
    })
    numStores.push(
      data1.map((row) => row["State/Province"]).filter(d => d == data2[i]).length
    )
  }

  xScale.domain(d3.map(data1, function(d){return d["State/Province"]}).keys());
  yScale.domain([0, d3.max(numStores)]);

  let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

  chart.selectAll(".bar")
    .data(stateNumStores)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.state); })
      .attr("y", function(d) { return yScale(d.value); })
      .attr("height", function(d) { return height - yScale(d.value); })
      .attr("width", xScale.rangeBand())
    .on("mouseover", (d) => {
      div.transition()
      .duration(200)
      .style("opacity", .9)
      div.html("State: " + d.state + "<br>" + "No. Of Stores: " + d.value)
      .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
    })
    .on("mouseout", (d) => {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    });

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  chart.append('text')
    .attr('x', 450)
    .attr('y', 450)
    .attr('id', "x-label")
    .style('font-size', '12pt')
    .text('State');

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
      .attr('transform', 'translate(-50, 220)rotate(-90)')
      .style('font-size', '12pt')
      .text('No. of Stores');
});
