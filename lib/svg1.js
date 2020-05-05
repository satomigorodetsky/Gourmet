document.addEventListener("DOMContentLoaded", () => { 

    const button0 = document.getElementById('button-0')
    button0.onclick = () => { update("./data/total_stars.csv", "Total")}

    const button1 = document.getElementById('button-1')
    button1.onclick = () => { update("./data/one_star.csv","One Star")}

    const button2 = document.getElementById('button-2')
    button2.onclick = () => { update("./data/two_stars.csv", "Two Stars")}

    const button3 = document.getElementById('button-3')
    button3.onclick = () => { update("./data/three_stars.csv", "Three Stars")}

   const width = 800;
   const height = 550;
   const padding = 60;

   const div = d3.select(".svg1").append("div")
       .style("opacity", 0)
        .attr("class", "tooltip")

        

   const svg = d3
     .select("#svg1")
     .append("svg")
     .attr("width", width)
     .attr("height", height)

   const xScale = d3.scaleBand()
        .rangeRound([padding, width - padding]) 
        .padding(0.5) 

   const yScale = d3.scaleLinear()
        .range([height - padding, padding]);

    function update(datafile, chartname) {

        d3.csv(datafile).then(function (dataset) {
            svg.selectAll('rect').remove();
            svg.selectAll('g').remove();
            svg.selectAll('text').remove();


            xScale.domain(dataset.map(function (d) { return d.region; })) 

            yScale.domain([0, 1 + d3.max(dataset, function (d) { return parseInt(d.total); })])

            svg.append("g")
                .attr("transform", "translate(" + 0 + "," + (height - padding) + ")")
                .call(d3.axisBottom(xScale))
                .attr("class", "x-axis")

            svg.append("text")
                .attr("class", "barchart-title")
                .attr("x", width / 2)
                .attr("y", "40px")
                .attr("text-anchor", "middle")
                .attr("style", "fill:#dc3545")
                .text(chartname);
           

            svg.append("g")
                .attr("transform", "translate(" + padding + "," + 0 + ")")
                .call(d3.axisLeft(yScale))
                .attr("class", "y-axis")

            svg
                .append("g")
                .selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return xScale(d.region);
                })
                .attr("y", 0)
                .attr("width", xScale.bandwidth())
                .attr("height", 100)
                .transition()
                .duration(500)
                .delay(function (d, i) {
                    return i * 50;
                })
                .attr("y", function (d) {
                    return yScale(d.total);
                })
                .attr("height", function (d) { return height - padding - yScale(d.total); })
                .attr("style", "fill:#dc3545")
                .on('end', function() {
                    d3.select(this)
                        .on('mouseover', function (d, i) {
                            d3.select(this).transition()
                                .duration('50')
                                .attr('opacity', '.85')
                            div.transition()
                                .duration(50)
                                .style("opacity", 1);

                            div.html("# of stars: " + d.total)
                                .style("left", (d3.event.pageX + 10) + "px")
                                .style("top", (d3.event.pageY - 15) + "px");
                        })
                        .on('mouseout', function (d, i) {
                            d3.select(this).transition()
                                .duration('50')
                                .attr('opacity', '1')
                            div.transition()
                                .duration('50')
                                .style("opacity", 0);
                        })
                })

        })
    }

    update("./data/total_stars.csv", "Total");

});
    

