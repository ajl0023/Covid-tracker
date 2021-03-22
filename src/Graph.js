import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
const Graph = (props) => {
  const node = useRef();
  const containerRef = useRef();
  const counterRef = useRef();
  const graphWrapper = useRef();
  useEffect(() => {
    if (props.formattedData.length > 0) {
      const strokeWidth = 1.5;
      const margin = { top: 0, bottom: 20, left: 40, right: 20 };
      const width = 600 - margin.left - margin.right - strokeWidth * 2;
      const height = 300 - margin.top - margin.bottom;
      const widthValue = 600;
      let svg = d3
        .select(node.current)
        .append("svg")
        .attr("display", "block")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${widthValue} ${300}`);
      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`);
      let x = d3
        .scaleTime()
        .domain(
          d3.extent(props.formattedData, function (d) {
            return d.date;
          })
        )
        .range([0, width]);
      let y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([
          0,
          d3.max(props.formattedData, (d) => {
            return d.value;
          }),
        ]);
      chart.append("g").call(
        d3.axisLeft(y).tickFormat((d) => {
          return d3.format(".2s")(d);
        })
      );
      chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));
      let bisect = d3.bisector((d) => {
        return d.date;
      }).left;
      let focus = chart
        .append("g")
        .append("circle")
        .style("fill", "#4285f4")
        .attr("stroke", "#4285f4")
        .attr("r", 4)
        .style("opacity", 0);
      let chartLege = d3.select(node.current).append("div");
      let textDate = d3
        .select(counterRef.current)
        .append("p")
        .text(d3.timeFormat("%B,%d")(props.formattedData[0].date))
        .attr("class", "graph-counter")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");
      let textValue = d3
        .select(counterRef.current)
        .append("p")
        .text(props.formattedData[0].value)
        .attr("class", "graph-counter")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");
      chart
        .selectAll("g")
        .attr("font-family", "Roboto Mono, monospace")
        .attr("font-size", "12px");
      chart
        .append("path")
        .datum(props.formattedData)
        .attr("fill", "none")
        .attr("stroke", "#4285f4")
        .attr("stroke-width", 3)
        .attr("vector-effect", "non-scaling-stroke")
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.value);
            })
        );
      svg
        .select("g")
        .append("rect")
        .attr("overflow", "visible")
        .style("fill", "none")
        .attr("x", 0)
        .attr("y", -120)
        .attr("height", 400)
        .attr("width", width)
        .style("pointer-events", "all")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);
      function mouseover() {
        focus.style("opacity", 1);
      }
      function mousemove(e) {
        var x0 = x.invert(d3.pointer(e)[0]);
        let i = bisect(props.formattedData, x0, 1);
        let selectedData = props.formattedData[i];
        if (!selectedData) {
          return;
        }
        focus
          .attr("cx", x(selectedData.date))
          .attr("cy", y(selectedData.value));
        textDate.html(d3.timeFormat("%B,%d")(selectedData.date));
        textValue.html(new Intl.NumberFormat().format(selectedData.value));
        chartLege.attr("x", x(selectedData.date));
        chartLege.attr("y", y(selectedData.value));
      }
      function mouseout() {
        focus.style("opacity", 0);
      }
    }
    return () => {
      d3.select(node.current).selectAll("svg").remove();
      d3.select(node.current).selectAll("div").remove();
      d3.select(counterRef.current).selectAll("p").remove();
    };
  }, [props.formattedData]);
  return (
    <div ref={graphWrapper} className="graph-wrapper">
      <div className="graph-container" ref={containerRef}>
        <div className="svg-image" ref={node}></div>
      </div>
      <div ref={counterRef} className="graph-counter"></div>
    </div>
  );
};
export default Graph;
