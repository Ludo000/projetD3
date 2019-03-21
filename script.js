var datas=[];

function fillSelectPays()
{
    var pays = Object.keys(datas[0])
        .filter(key => key != "Year")
        .sort();

    d3.select("#selectPays")
        .selectAll("option")
        .data(pays)
        .enter()
        .append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });
}

function rendu() {

    var data = d3.csv.parse(d3.select('#csv').text());
    datas = data;
    var largeurLabel = 40; 
    var largeureBarreLabel = 100; 
    var largeurMaxBarre = 800; 

    var grilleOffset = 5; 
    var hauteurBarre = 21; 

    var paddingLabelBarre = 5; 
    var hauteurGrilleLabel = 20; 

    fillSelectPays();

    var e = document.getElementById("selectPays");
    var pays = e.options[e.selectedIndex].value;

    document.getElementById("chart").innerHTML="";
    document.getElementById("nomPays").innerHTML= "Taux de CO2 émis par an de : " +pays;
 
    
    // rendre ça dynamique avec un select ou autre
    var barLabel = function(d) { return d['Year']; };
    var barValue = function(d) { return parseFloat(d[pays]); };
    console.log(data[0].France);
    

    var yScale = d3.scale.ordinal().domain(d3.range(0, data.length)).rangeBands([0, data.length * hauteurBarre]);
    var y = function(d, i) { return yScale(i); };
    var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
    var x = d3.scale.linear().domain([0, d3.max(data, barValue)]).range([0, largeurMaxBarre]);

    var chart = d3.select('#chart').append("svg")
    .attr('width', largeurMaxBarre
    + largeureBarreLabel + largeurLabel)
    .attr('height', hauteurGrilleLabel + grilleOffset + data.length * hauteurBarre);

    var gridContainer = chart.append('g')
    .attr('transform', 'translate(' + largeureBarreLabel + ',' + hauteurGrilleLabel + ')'); 
    gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
    .attr("x", x)
    .attr("dy", -3)
    .attr("text-anchor", "middle")
    .text(String);

    gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", yScale.rangeExtent()[1] + grilleOffset)
    .style("stroke", "#ccc");

    var labelsContainer = chart.append('g')
    .attr('transform', 'translate(' + (largeureBarreLabel - paddingLabelBarre) + ',' + (hauteurGrilleLabel + grilleOffset) + ')'); 
    labelsContainer.selectAll('text').data(data).enter().append('text')
    .attr('y', yText)
    .attr('stroke', 'none')
    .attr('fill', 'black')
    .attr("dy", ".35em") 
    .attr('text-anchor', 'end')
    .text(barLabel);
    

    var barsContainer = chart.append('g')
    .attr('transform', 'translate(' + largeureBarreLabel + ',' + (hauteurGrilleLabel + grilleOffset) + ')'); 
    barsContainer.selectAll("rect").data(data).enter().append("rect")
    .attr('y', y)
    .attr('height', yScale.rangeBand())
    .attr('width', function(d) { return x(barValue(d)); })
    .attr('stroke', 'black')
    .attr('fill', 'green')
    .on("mouseover", sourisEntreBarre)
    .on("mouseout", sourisSortBarre)
    .on("click", sourisClickBarre);

    barsContainer.selectAll("text").data(data).enter().append("text")
    .attr("x", function(d) { return x(barValue(d)); })
    .attr("y", yText)
    .attr("dx", 3) 
    .attr("dy", ".35em") 
    .attr("text-anchor", "start") 
    .attr("fill", "black")
    .attr("stroke", "none")
    .text(function(d) { return d3.round(barValue(d), 2); });

   

    barsContainer.append("line")
    .attr("y1", -grilleOffset)
    .attr("y2", yScale.rangeExtent()[1] + grilleOffset)
    .style("stroke", "#000");
    function sourisEntreBarre(d, i) {  // Add interactivity

      // Use D3 to select element, change color and size
      d3.select(this).attr({
        fill: "orange"
      });
     
    }

    function sourisSortBarre(d, i) {  // Add interactivity

      // Use D3 to select element, change color and size
      d3.select(this).attr({
        fill: "green"
      });
    }
    function sourisClickBarre(d, i) {  // Add interactivity
  
      // Use D3 to select element, change color and size
      d3.select(this).attr({
        fill: "red"
      });
    }

}


 