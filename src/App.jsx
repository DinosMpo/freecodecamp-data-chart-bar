import { useState, useEffect } from 'react'
import './App.css'
import * as d3 from "d3";

function App() {
  const [myData, setMyData] = useState('');
  const [load, setLoad] = useState(false);
  const w = 1000;
  const h = 700;
  const padding = 60;

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => {
        setMyData(data.data);
      })
      .then(() => setLoad(true));

  }, [0]);

  useEffect(() => {
    if (load) {
      const container = d3.select('#chart')
        .append("div")
        .attr("id", "container");

      const tooltip = d3.select("#container")
        .append("div")
        .attr("id", "tooltip");

      const handleMouseOver = (e, d) => {
        tooltip
          .style("opacity", "1")
          .attr("data-date", d[0])
          .text(() => {
            return `Date: ${d[0]} \n\n GDP: ${d[1]}`;
          })
      }

      const handleMouseOut = (e, d) => {
        tooltip.style("opacity", "0");
      }

      const years = myData.map((d) => {
        return new Date(d[0]);
      });

      const minYear = d3.min(years);
      const maxYear = d3.max(years);

      const values = myData.map((d) => {
        return d[1];
      });

      const maxValue = d3.max(values);

      const xScale = d3.scaleTime()
        .domain([minYear, maxYear])
        .range([padding, w - padding]);

      const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([h - padding, padding]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "mySvg");

      svg.selectAll("rect")
        .data(myData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(years[i]))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", 5)
        .attr("height", (d) => h - padding - yScale(d[1]))
        .attr("fill", "green")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .on("mouseover", (e, d) => handleMouseOver(e, d))
        .on("mouseout", (e, d) => handleMouseOut(e, d))
        //προσθηκη tooltip
        .append("title")
        .attr("data-date", (d) => d[0])
        .text((d) => d[1])

      svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

      svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis);
    }
  }, [load]);

  return myData ? (
    <div id="App">
      <h1 id="title">Data Chart of United States GDP</h1>
      <div id="chart"></div>
      <div id="created">Created by <a target="_blank" rel="noreferrer" href="https://github.com/DinosMpo/freecodecamp-data-chart-bar">DinosMpo</a></div>
      <div>This is a freeCodeCamp challenge</div>
    </div>
  )
    :
    (
      <div>
        Loading
      </div>
    )
}

export default App