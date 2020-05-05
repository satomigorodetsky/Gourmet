document.addEventListener("DOMContentLoaded", () => {

  const button0 = document.getElementById("button-00");
    button0.onclick = () => { update("/data/ny_cuisine.csv", "New York")};

    const button1 = document.getElementById("button-01");
    button1.onclick = () => {update("/data/cali_cuisine.csv", "California");};

    const button2 = document.getElementById("button-02");
    button2.onclick = () => {update("/data/chi_cuisine.csv", "Chicago");};

    const button3 = document.getElementById("button-03");
    button3.onclick = () => {update("/data/dc_cuisine.csv", "Washington, D.C.");};

    const width = 800;
    const height = 850;

  const div = d3.select(".svg2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  const svg = d3
    .select("#svg2")
    .append("svg")
    .attr("class","bubblechart")
    .attr("height", height)
    .attr("width", width)

  function update(datafile, chartname) {
    d3.csv(datafile).then(function (dataset) {
      let revealAll = true;
      let revealOne = true;
      svg.selectAll("circle").remove();
      svg.selectAll("g").remove();
      svg.selectAll("text").remove();

      const radiusScale = d3
        .scaleSqrt()
        .domain([
          1,
          d3.max(dataset, function (d) {
            return parseInt(d.total);
          }),
        ])
        .range([5, 60]);


      svg.append("text")
        .attr("class", "barchart-title")
        .attr("x", width / 2)
        .attr("y", "60px")
        .attr("text-anchor", "middle")
        .attr("style", "fill:#dc3545")
        .text(chartname);

      const simulation = d3
        .forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force(
          "collide",
          d3.forceCollide(function (d) {
            return radiusScale(d.total) + 45;
          })
        );

      const bubbles = svg
        .selectAll(".cuisine")
        .data(dataset, function(d) {
          return d.cuisine
        })
        .enter()
        .append("g")
        .attr("transform", function(d) {`translate(${d.x}, ${d.y})` })
        .attr("class", "cuisine")


      const circles = bubbles.append("circle")
        .attr("r", function (d) {
          return radiusScale(d.total) + 35;
        })
        .attr("fill", "#dc3545")
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85')
          div.transition()
            .duration(50)
            .style("opacity", 1);

          div.html("# of restaurants: " + d.total)
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

      simulation.nodes(dataset).on("tick", ticked);

      function ticked() {
        circles
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
      }

        circles
        .on("dblclick", function (d) {
          if (revealAll === true ) {
            d3.selectAll('.cuisine-text').remove();
            revealAll = false
            const texts = svg
              .selectAll(null)
              .data(dataset)
              .enter()
              .append("text")
            texts
              .text((d) => d.cuisine)
              .attr("font-size", function (d) {
                if (d.total > 5 || (d.total > 5 && d.cuisine.length < 8)) {
                  return "25px"
                } else if (d.total < 3 && d.cuisine.length > 8 && d.cuisine !== "Gastropub") {
                  return "11.5px"
                }
                return "16px"
              })
              .attr("font-weight", "bold")
              .attr("class", "cuisine-texts")
              .attr("fill", "white")
              .attr("x", (d) => {
                return d.x;
              })
              .attr("y", (d) => {
                return d.y;
              })
              .style("text-anchor", "middle")
            } else {
              d3.selectAll('.cuisine-texts').remove();
              revealAll = true;
         }
        });


      circles
        .on("click", function (d) {
          if (revealOne === true) {
            d3.selectAll('.cuisine-texts').remove();
            revealOne = false
            const text = d3.select(d3.event.currentTarget.parentElement)
              .append("text")

            text
              .text(d.cuisine)
              .attr("font-size", function (d) {
                if (d.total > 5 || (d.total > 5 && d.cuisine.length < 8)) {
                  return "25px"
                } else if (d.total < 3 && d.cuisine.length > 8 && d.cuisine !== "Gastropub") {
                  return "11.5px"
                }
                return "16px"
              })
              .attr("font-weight", "bold")
              .attr("class", "cuisine-text")
              .attr("fill", "white")
              .attr("x", d.x )
              .attr("y", d.y )
              .style("text-anchor", "middle")
          } else {
            d3.selectAll('.cuisine-text').remove();
            revealOne = true;
          }
        })


    });
  }

  update("/data/ny_cuisine.csv", "New York");

});