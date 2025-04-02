import * as d3 from 'd3';

const graph = (container, data, graphType, options = {}) => {
    if (!container || !data || data.length == 0) return;

    switch (graphType) {
        case 'bar':
            generateBarGraph(container, data, options);
            break;
        case 'histogram':
            generateHistogram(container, data, options);
            break;
        case 'pie':
            generatePieGraph(container, data, options);
            break;
        case 'text':
        default:
            generateText(container, data, options);
    }
};

const generateBarGraph = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };

    d3.select(container).selectAll('*').remove();

    d3.select(container)
        .html(`Total ${options[2]}${options[4]? " By " + options[4]: "" } of Each ${options[1]}`)
        .style('text-align', 'center');

    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    const categorySplit = d3.group(data, (d) => d[options['1']]);

    let parsedData;

    switch (options[2]){
        case "Sum":
            parsedData = Array.from(categorySplit, ([cat, vals]) => ({
                cat: cat,
                val: d3.sum(vals, d => d[options[4]]),
            }));
            break;
        case "Count":
        default:
            parsedData = Array.from(categorySplit, ([cat, vals]) => ({
                cat: cat,
                val: vals.length,
            }));
            break;
    }

    // Set up scales
    const x = d3
        .scaleBand()
        .domain(parsedData.map((d) => d.cat))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(parsedData, (d) => d.val)])
        //                   .nice()
        .range([height - margin.bottom, margin.top]);

    // Add rectangles for the bar chart
    svg.append('g')
        .attr('fill', 'steelblue')
        .selectAll()
        .data(parsedData)
        .join('rect')
        .attr('x', (d) => x(d.cat))
        .attr('y', (d) => y(d.val))
        .attr('height', (d) => y(0) - y(d.val))
        .attr('width', x.bandwidth());

    // Add X axis
    const xAxis = svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`);

    if (options['3']) {
        xAxis.call(d3.axisBottom(x).tickValues([]));
        xAxis.selectAll('text').remove();
    } else {
        xAxis.call(d3.axisBottom(x));
    }

    // Step 5: Add the y-axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('overflow', 'visible')
        .style('white-space', 'nowrap');

    svg.selectAll('rect')
        .on('mouseover', (event, d) => {
            tooltip.style('visibility', 'visible').text(`${d.cat}: ${d.val % 1 !== 0 ? d.val.toFixed(2) : d.val}`);
        })
        .on('mousemove', (event) => {
            const svgRect = svg.node().getBoundingClientRect(); // Get SVG container's position
            tooltip
                .style('top', event.clientY - svgRect.top + 5 + 'px')
                .style('left', event.clientX - svgRect.left + 5 + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
};

const generateHistogram = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };

    d3.select(container).selectAll('*').remove();

    d3.select(container)
        .html(`Histogram of ${options[1]}`)
        .style('text-align', 'center');

    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    const vals = data.map((d) => d[options[1]]);

    const [minValue, maxValue] = d3.extent(vals);

    // Define the number of bins
    const numBins = 10;

    // Calculate the bin width (make sure bins are evenly spaced)
    const binWidth = (maxValue - minValue) / numBins;

    // Generate custom thresholds based on the desired number of bins
    const thresholds = d3.range(minValue, maxValue, binWidth);
    if (thresholds.at(-1) < maxValue) thresholds.push(maxValue);

    // Create a histogram layout
    const histogram = d3
        .histogram()
        .value((d) => d)
        .domain([minValue, maxValue])
        .thresholds(thresholds); // Number of bins (or thresholds)

    // Compute the bins
    const bins = histogram(vals);

    // Create scales for the x and y axes
    const x = d3
        .scaleLinear()
        .domain([minValue, maxValue])
        .range([margin.left, width - margin.right]);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([height - margin.bottom, margin.top]);

    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(bins.map((d) => d.x0)));
    // Add the y-axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    //console.log(bins)
    // Create bars for the histogram
    svg.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attr('fill', 'steelblue')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.x0))
        .attr('y', (d) => y(d.length))
        .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0) - 1)) // Adjust width of bars
        .attr('height', (d) => y(0) - y(d.length));

    // Optional: Add axis labels
    svg.selectAll('.axis-label')
        .data(bins)
        .enter()
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', (d) => x(d.x0) + (x(d.x1) - x(d.x0)) / 2) // Place the label in the middle of each bin
        .attr('y', height + margin.bottom - 5) // Adjust the y position slightly below the x-axis
        .attr('text-anchor', 'middle') // Center the text horizontally
        .text((d) => `${Math.round(d.x0)} - ${Math.round(d.x1)}`);

    const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('overflow', 'visible')
        .style('white-space', 'nowrap');

    svg.selectAll('rect')
        .on('mouseover', (event, d) => {
            tooltip.style('visibility', 'visible').text(`${d.length}`);
        })
        .on('mousemove', (event) => {
            const svgRect = svg.node().getBoundingClientRect(); // Get SVG container's position
            tooltip
                .style('top', event.clientY - svgRect.top + 5 + 'px')
                .style('left', event.clientX - svgRect.left + 5 + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
};

const generatePieGraph = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = 10;

    const radius = Math.min(width, height) / 2 - margin;

    // Create an SVG container
    d3.select(container).selectAll('*').remove();

    d3.select(container)
        .html(`Pie Graph of Each ${options[1]}`)
        .style('text-align', 'center');

    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;')
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create a pie layout
    const pie = d3.pie();

    // Create an arc generator
    const arc = d3.arc().outerRadius(radius).innerRadius(0); // Set innerRadius to 0 for a full pie chart

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const categoryCounts = d3.group(data, (d) => d[options['1']]);

    const vals = Array.from(categoryCounts, ([key, value]) => value.length);
    const keys = Array.from(categoryCounts, ([key, value]) => key);

    // console.log(pie(vals))

    //const sortedVals = vals.sort((a, b) => b - a);
    // Create the pie slices
    const slices = svg
        .selectAll('.slice')
        .data(pie(vals))
        .join('path')
        //      .enter().append("g")
        //     .attr("class", "slice");
        //
        // Draw the pie slices (arc paths)
        //  slices.append("path")
        .attr('class', 'slice')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i % color.range().length))
        .attr('stroke', 'black')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);

    const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('overflow', 'visible')
        .style('white-space', 'nowrap');

    svg.selectAll('path')
        .on('mouseover', (event, d) => {
            tooltip
                .style('visibility', 'visible')
                .text(
                    `${keys[d.index]}: ${d3.format('.1%')(d.data / d3.sum(vals))}`,
                );
        })
        .on('mousemove', (event) => {
            const svgRect = svg.node().getBoundingClientRect(); // Get SVG container's position
            tooltip
                .style('top', event.clientY - svgRect.top + 5 + 'px')
                .style('left', event.clientX - svgRect.left + 5 + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
};

const generateText = (container, data, options) => {
    switch (options[1]) {
        case 'Sum':
            const sum = d3.sum(data, (d) => d[options[2]]);
            d3.select(container).html(`Total ${options[2]}: ${sum.toFixed(2)}`);
            break;
    }
};

export default graph;
