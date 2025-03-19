import * as d3 from 'd3';

const graph = (container, data, graphType, options={}) => {
    if(!container || !data || data.length == 0)
        return;

    switch (graphType){
        case "bar":
            generateBarGraph(container, data, options);
            break;
        case "histogram":
            generateHistogram(container, data, options);
            break;
        case "pie":
            generatePieGraph(container, data, options);
            break;
        case "text":
        default:
            generateText(container, data, options);
    }
}

const generateBarGraph = (container, data, options) => {

    const width = 300;
    const height = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };

    d3.select(container).selectAll('*').remove();

    d3.select(container)
                  .html(`Total Counts of Each ${options[1]}`)
                  .style("text-align", "center");

     const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");


    const categoryCounts = d3.group(data, d => d[options["1"]]);

    const countData = Array.from(categoryCounts, ([cat, vals]) => ({
      cat: cat,
      count: vals.length
    }));
              // Set up scales
      const x = d3.scaleBand()
                       .domain(countData.map(d => d.cat))
                       .range([margin.left, width - margin.right])
                       .padding(0.1);

      const y = d3.scaleLinear()
                       .domain([0, d3.max(countData, d => d.count)])
    //                   .nice()
                       .range([height - margin.bottom, margin.top]);

              // Add rectangles for the bar chart
  svg.append("g")
      .attr("fill", "steelblue")
    .selectAll()
    .data(countData)
    .join("rect")
      .attr("x", (d) => x(d.cat))
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => y(0) - y(d.count))
      .attr("width", x.bandwidth());

              // Add X axis
      const xAxis = svg.append("g")
         .attr("transform", `translate(0,${height - margin.bottom})`)

         if(options["2"]) {
            xAxis.call(d3.axisBottom(x).tickValues([]));
            xAxis.selectAll("text").remove();
         }
         else {
            xAxis.call(d3.axisBottom(x));
         }

      // Step 5: Add the y-axis
      svg.append("g")
         .attr("transform", `translate(${margin.left},0)`)
         .call(d3.axisLeft(y));

          const tooltip = d3.select(container).append("div")
             .style("position", "absolute")
             .style("pointer-events", "none")
             .style("visibility", "hidden")
             .style("overflow", "visible")
             .style("white-space", "nowrap")

           svg.selectAll("rect")
              .on("mouseover", ((event, d) => {
                tooltip.style("visibility", "visible")
                       .text(`${d.cat}: ${d.count}`);
              }))
              .on("mousemove", ((event) => {
                   const svgRect = svg.node().getBoundingClientRect(); // Get SVG container's position
                   tooltip.style("top", (event.pageY - svgRect.top + 5) + "px")
                          .style("left", (event.pageX - svgRect.left + 5) + "px");
                 }))
              .on("mouseout", (() => {
                tooltip.style("visibility", "hidden");
              }));
}

const generateHistogram = (container, data, options) => {

    const width = 300;
    const height = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };

    d3.select(container).selectAll('*').remove();

    d3.select(container)
                      .html(`Histogram of ${options[1]}`)
                      .style("text-align", "center");

     const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    const vals = data.map(d => d[options[1]]);

    const [minValue, maxValue] = d3.extent(vals);

    // Define the number of bins
    const numBins = 10;

    // Calculate the bin width (make sure bins are evenly spaced)
    const binWidth = (maxValue - minValue) / (numBins);

    // Generate custom thresholds based on the desired number of bins
    const thresholds = d3.range(minValue, maxValue, binWidth);
    if(thresholds.at(-1) < maxValue)
        thresholds.push(maxValue)

    // Create a histogram layout
    const histogram = d3.histogram()
      .value(d => d)
      .domain([minValue, maxValue])
      .thresholds(thresholds);  // Number of bins (or thresholds)

    // Compute the bins
    const bins = histogram(vals);

    // Create scales for the x and y axes
    const x = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range([height - margin.bottom, margin.top]);

    // Add the x-axis
    svg.append("g")
         .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(bins.map(d => d.x0)));
    // Add the y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    //console.log(bins)
    // Create bars for the histogram
    svg.selectAll(".bar")
      .data(bins)
      .enter().append("rect")
      .attr("fill", "steelblue")
      .attr("class", "bar")
      .attr("x", d => x(d.x0))
      .attr("y", d => y(d.length))
      .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))  // Adjust width of bars
      .attr("height", d => y(0) - y(d.length));

    // Optional: Add axis labels
svg.selectAll(".axis-label")
  .data(bins)
  .enter().append("text")
  .attr("class", "axis-label")
  .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2) // Place the label in the middle of each bin
  .attr("y", height + margin.bottom - 5) // Adjust the y position slightly below the x-axis
  .attr("text-anchor", "middle") // Center the text horizontally
  .text(d => `${Math.round(d.x0)} - ${Math.round(d.x1)}`);

const tooltip = d3.select(container).append("div")
             .style("position", "absolute")
             .style("pointer-events", "none")
             .style("visibility", "hidden")
             .style("overflow", "visible")
             .style("white-space", "nowrap")

  svg.selectAll("rect")
                .on("mouseover", ((event, d) => {
                  tooltip.style("visibility", "visible")
                         .text(`${d.length}`);
                }))
                .on("mousemove", ((event) => {
                     const svgRect = svg.node().getBoundingClientRect(); // Get SVG container's position
                     tooltip.style("top", (event.pageY - svgRect.top + 5) + "px")
                            .style("left", (event.pageX - svgRect.left + 5) + "px");
                   }))
                .on("mouseout", (() => {
                  tooltip.style("visibility", "hidden");
                }));
}

const generatePieGraph = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };

    const radius = Math.min(width, height) / 2;

    // Create an SVG container
    d3.select(container).selectAll('*').remove();

     const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Create a pie layout
    const pie = d3.pie();

    // Create an arc generator
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);  // Set innerRadius to 0 for a full pie chart

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const vals = data.map(d => d[options[1]]);

    // Create the pie slices
    const slices = svg.selectAll(".slice")
      .data(pie(vals))
      .enter().append("g")
      .attr("class", "slice");

    // Draw the pie slices (arc paths)
    slices.append("path")
      .attr("class", "slice")
      .attr("d", arc)
      .style("fill", (d, i) => color(i));

    // Optional: Add text labels (percentage or value)
    slices.append("text")
      .attr("transform", (d) => {
        const centroid = arc.centroid(d);
        return `translate(${centroid})`;
      })
      .attr("class", "text")
      .text(d => d.data);  // Show the value (or use d3.format to show percentage)

      //formatPercent(d.data / d3.sum(data))
      //const formatPercent = d3.format(".1%");
}

const generateText = (container, data, options) => {
    switch(options[1]){
        case "Sum":
            const sum = d3.sum(data, d => d[options[2]]);
            d3.select(container)
                  .html(`Total ${options[2]}: ${sum.toFixed(2)}`);
            break;
        default:

    }
}

export default graph;