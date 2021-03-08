// source: https://www.youtube.com/watch?v=TOJ9yjvlapY

const DATA = [
    { id: 'A', value: 7, text: 'Item A' },
    { id: 'B', value: 10, text: 'Item B' },
    { id: 'C', value: 3, text: 'Item C' },
    { id: 'D', value: 12, text: 'Item D' },
];

const containerClass = 'visual';
const minValue = 0;
const maxValue = DATA.map(val => val.value).sort((val1, val2) => val2 - val1)[0];

const container = d3.select('svg').classed('container', true);
const containerHtml = document.getElementsByClassName(containerClass)[0];

if (!containerHtml) {
    throw new Error('html component with class "' + containerClass + '" not found');
}

const maxWidth = parseInt(containerHtml.getAttribute('width'), 10);
const maxHeight = parseInt(containerHtml.getAttribute('height'), 10);

if (!maxWidth || !maxHeight) {
    throw new Error('svg component must have "width" and "height" properties set');
}

const scaleX = d3.scaleBand()
    .domain(DATA.map(data => data.id))
    .rangeRound([0, maxWidth])
    .padding(0.1);

const scaleY = d3.scaleLinear()
    .domain([0, maxValue + 2])
    .range([maxHeight, 0]);


const bars = container

    // select all ".bar" elements inside the container
    .selectAll('.bar')
    
    // set the data
    .data(DATA)

    // get data entries that do not yet have an HTML element
    .enter()

    // for each one, create a new "rect" element
    .append('rect')

    // add a "bar" class to each
    .classed('bar', true)

    // width evenly distributed across x domain entries
    .attr('width', scaleX.bandwidth())

    // scales height based on the item value and the y domain
    .attr('height', data => scaleY(data.value))

    // must be the same property used to define the x domain
    .attr('x', data => scaleX(data.id))

    // make the bars extend from the bottom of the graph
    .attr('y', data => maxHeight - scaleY(data.value))
;
