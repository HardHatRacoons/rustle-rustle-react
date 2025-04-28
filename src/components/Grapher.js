import * as d3 from 'd3';

/*
 * Decides what type of graph to create based on graphType and calls to correct graphing function.
 *
 * @function
 * @param {React.RefObject} container The container in which to place the rendered graph.
 * @param {Array} data The data to parse for the graph.
 * @param {String} graphType The type of graph to generate.
 * @param {Array} options The options for a particular graph.
 */
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

/*
 * Generates a bar graph based on the given options and data.
 *
 * @function
 * @param {React.RefObject} container The container in which to place the rendered bar graph.
 * @param {Array} data The data to parse for the bar graph.
 * @param {Array} options The options for the bar graph.
 */
const generateBarGraph = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = { top: 5, right: 0, bottom: 40, left: 60 };

    //remove current stuff in container
    d3.select(container).selectAll('*').remove();

    //add title to bar graph
    d3.select(container)
        .html(
            `Total ${options[2]}${options[4] ? ' By ' + options[4] : ''} of Each ${options[1]}`,
        )
        .style('text-align', 'center');

    //create initial graph
    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    const categorySplit = d3.group(data, (d) => d[options['1']]);

    let parsedData;

    //collate right statistic for sum or count
    switch (options[2]) {
        case 'Sum':
            parsedData = Array.from(categorySplit, ([cat, vals]) => ({
                cat: cat,
                val: d3.sum(vals, (d) => d[options[4]]),
            }));
            break;
        case 'Count':
        default:
            parsedData = Array.from(categorySplit, ([cat, vals]) => ({
                cat: cat,
                val: vals.length,
            }));
            break;
    }

    //set up scales
    const x = d3
        .scaleBand()
        .domain(parsedData.map((d) => d.cat))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(parsedData, (d) => d.val)])
        .range([height - margin.bottom, margin.top]);

    //toggle theme color
    let color;
    if (options['theme'] === 'light') color = 'lightskyblue';
    else color = 'darkslateblue';

    //add rectangles for the bar chart
    svg.append('g')
        .attr('fill', color)
        .selectAll()
        .data(parsedData)
        .join('rect')
        .attr('x', (d) => x(d.cat))
        .attr('y', (d) => y(d.val))
        .attr('height', (d) => y(0) - y(d.val))
        .attr('width', x.bandwidth());

    //add X axis
    const xAxis = svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`);

    //remove labels if too dense
    if (options['3']) {
        xAxis.call(d3.axisBottom(x).tickValues([]));
        xAxis.selectAll('text').remove();
    } else {
        xAxis.call(d3.axisBottom(x));
    }

    //add Y axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    //add X axis label
    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left) // Position in the center of the X axis
        .attr('y', height - 10) // Position just below the X axis
        .style('text-anchor', 'middle') // Center align the text
        .style('font-size', '12px')
        .text(`${options[1]}`);

    //add Y axis label
    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -(height - margin.top - margin.bottom) / 2 - margin.top) // Position in the center of the Y axis
        .attr('y', 12) // Position to the left of the Y axis
        .style('text-anchor', 'middle') // Center align the text
        .attr('transform', 'rotate(-90)') // Rotate the text to be vertical
        .style('font-size', '12px')
        .text(`${options[2]}`);

    //add tooltip
    const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('overflow', 'visible')
        .style('white-space', 'nowrap');

    //style tooltip and interactions
    svg.selectAll('rect')
        .on('mouseover', (event, d) => {
            tooltip
                .style('visibility', 'visible')
                .text(
                    `${d.cat}: ${d.val % 1 !== 0 ? d.val.toFixed(2) : d.val}`,
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

/*
 * Generates a histogram based on the given options and data.
 *
 * @function
 * @param {React.RefObject} container The container in which to place the rendered histogram.
 * @param {Array} data The data to parse for the histogram.
 * @param {Array} options The options for the histogram.
 */
const generateHistogram = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = { top: 5, right: 0, bottom: 40, left: 50 };

    //remove current stuff in container
    d3.select(container).selectAll('*').remove();

    //add title to histogram
    d3.select(container)
        .html(`Histogram of ${options[1]}`)
        .style('text-align', 'center');

    //create initial graph
    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    const vals = data.map((d) => d[options[1]]);

    const [minValue, maxValue] = d3.extent(vals);

    //calculate the bin width (make sure bins are evenly spaced)
    const numBins = 10;
    const binWidth = (maxValue - minValue) / numBins;

    //generate custom thresholds based on the desired number of bins
    const thresholds = d3.range(minValue, maxValue, binWidth);
    if (thresholds.at(-1) < maxValue) thresholds.push(maxValue);

    //create a histogram layout
    const histogram = d3
        .histogram()
        .value((d) => d)
        .domain([minValue, maxValue])
        .thresholds(thresholds); // Number of bins (or thresholds)

    //compute the bins
    const bins = histogram(vals);

    //create scales for the X and Y axes
    const x = d3
        .scaleLinear()
        .domain([minValue, maxValue])
        .range([margin.left, width - margin.right]);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([height - margin.bottom, margin.top]);

    //add the X axis
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(bins.map((d) => d.x0)));

    //add the Y axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    //toggle theme color
    let color;
    if (options['theme'] === 'light') color = 'lightskyblue';
    else color = 'darkslateblue';

    //create bars for the histogram
    svg.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attr('fill', color)
        .attr('class', 'bar')
        .attr('x', (d) => x(d.x0))
        .attr('y', (d) => y(d.length))
        .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr('height', (d) => y(0) - y(d.length));

    //add axis labels
    svg.selectAll('.axis-label')
        .data(bins)
        .enter()
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', (d) => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
        .attr('y', height + margin.bottom - 5)
        .attr('text-anchor', 'middle')
        .text((d) => `${Math.round(d.x0)} - ${Math.round(d.x1)}`);

    //add X axis label
    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height - 10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(`Count`);

    //add Y axis label
    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -(height - margin.top - margin.bottom) / 2 - margin.top)
        .attr('y', 12)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .style('font-size', '12px')
        .text(`${options[1]}`);

    //add tooltip
    const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('overflow', 'visible')
        .style('white-space', 'nowrap');

    //style tooltip and interactions
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

/*
 * Generates a pie graph based on the given options and data.
 *
 * @function
 * @param {React.RefObject} container The container in which to place the rendered pie graph.
 * @param {Array} data The data to parse for the pie graph.
 * @param {Array} options The options for the pie graph.
 */
const generatePieGraph = (container, data, options) => {
    const width = 300;
    const height = 200;
    const margin = 10;

    const radius = Math.min(width, height) / 2 - margin;

    //remove current stuff in container
    d3.select(container).selectAll('*').remove();

    //add title to pie graph
    d3.select(container)
        .html(`Pie Graph of Each ${options[1]}`)
        .style('text-align', 'center');

    //create initial graph
    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;')
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    //create a pie layout
    const pie = d3.pie();

    //create an arc generator
    const arc = d3.arc().outerRadius(radius).innerRadius(0); // Set innerRadius to 0 for a full pie chart

    //toggle theme color and create color scale
    let color;
    if (options['theme'] === 'light')
        color = d3.scaleOrdinal(d3.schemePuBu[9].slice(1, 5));
    else color = d3.scaleOrdinal(d3.schemePurples[9].slice(5));

    //generate cats
    const categoryCounts = d3.group(data, (d) => d[options['1']]);

    const vals = Array.from(categoryCounts, ([key, value]) => value.length);
    const keys = Array.from(categoryCounts, ([key, value]) => key);

    //create the pie slices
    const slices = svg
        .selectAll('.slice')
        .data(pie(vals))
        .join('path')
        .attr('class', 'slice')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i % color.range().length))
        .attr('stroke', options['theme'] === 'light' ? '#0c4a6e' : 'black')
        .style('stroke-width', '1px')
        .style('opacity', 0.7);

    //add tooltip
    const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('overflow', 'visible')
        .style('white-space', 'nowrap');

    //style tooltip and interactions
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

/*
 * Generates text statistics based on the given options and data.
 *
 * @function
 * @param {React.RefObject} container The container in which to place the text statistics.
 * @param {Array} data The data to parse for the text statistics.
 * @param {Array} options The options for the text statistics.
 */
const generateText = (container, data, options) => {
    //remove current stuff in container
    d3.select(container).selectAll('*').remove();

    for (let idx = 1; ; idx += 2) {
        if (!options[idx]) break;
        switch (options[idx]) {
            case 'Average':
                const avg = d3.mean(data, (d) => d[options[idx + 1]]);
                d3.select(container)
                    .append('p')
                    .text(
                        `Average ${options[idx + 1]}: ${typeof avg === 'number' ? avg.toFixed(2) : 'N/A'}`,
                    )
                    .append('br');
                break;
            case 'Sum':
            default:
                const sum = d3.sum(data, (d) => d[options[idx + 1]]);
                d3.select(container)
                    .append('p')
                    .text(`Total ${options[idx + 1]}: ${sum.toFixed(2)}`)
                    .append('br');
                break;
        }
    }
};

export default graph;
