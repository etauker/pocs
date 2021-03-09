// source: https://www.youtube.com/watch?v=TOJ9yjvlapY

// format days
const DAYS = [];
const TODAY = moment('08-03-2021', 'DD-MM-YYYY');
for (let i = 0; i < 7; i++) {
    const base = TODAY.clone();
    const day = base.add(i, 'days');
    DAYS.push({
        start: day.valueOf(),
        end: day.add(1, 'day').subtract(1, 'millisecond').valueOf(),
        fill: 'none',
        annotation1: day.format('dddd'),
        annotation2: 'additional info'
    });
}

const PERIODS = [
    {
        start: moment().subtract(3, 'hours').valueOf(),
        end: moment().subtract(2, 'hours').valueOf(),
        fill: 'line',
        annotation1: moment().format('dddd'),
        annotation2: 'additional info'
    },
    {
        start: moment().add(2, 'days').subtract(7, 'hours').valueOf(),
        end: moment().add(2, 'days').subtract(3, 'hours').valueOf(),
        fill: 'line',
        annotation1: moment().add(2, 'days').format('dddd'),
        annotation2: 'additional info'
    },
    {
        start: moment().add(6, 'days').subtract(20, 'hours').valueOf(),
        end: moment().add(6, 'days').subtract(12, 'hours').valueOf(),
        fill: 'line',
        annotation1: moment().add(6, 'days').format('dddd'),
        annotation2: 'additional info'
    }
];


console.log(DAYS.map(d => d.annotation1));



const containerClass = 'visual';
const minValue = DAYS.map(val => val.end - val.start).sort((val1, val2) => val1 - val2)[0];
const maxValue = DAYS.map(val => val.end - val.start).sort((val1, val2) => val2 - val1)[0];
console.log(minValue);
console.log(maxValue);

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

console.log(maxWidth);
const dayDurationMs = 24 * 60 * 60 * 1000;
const scaleX = d3.scaleLinear()
    .domain([0, dayDurationMs])
    .range([0, maxWidth]);

const scaleY = d3.scaleBand()
    .domain(DAYS.map(data => data.annotation1))
    .rangeRound([0, maxHeight])
    .padding(0.3);


const bars = container
    .selectAll('.bar') // select all ".bar" elements inside the container
    .data(DAYS) // set the data
    .enter() // get data entries that do not yet have an HTML element
    .append('rect') // for each one, create a new "rect" element
    .classed('bar', true) // add a "bar" class to each
    .attr('width', data => scaleX(data.end - data.start)) // width evenly distributed across x domain entries
    .attr('height', scaleY.bandwidth()) // scales height based on the item value and the y domain
    .attr('x', data => (data.start % dayDurationMs) / dayDurationMs * maxWidth) // x axis position
    .attr('y', data => scaleY(data.annotation1)) // y axis band
;

const periods = container
    .selectAll('.period')
    .data(PERIODS)
    .enter()

periods
    .append('rect')
    .classed('bar', true)
    .attr('width', data => scaleX(data.end - data.start))
    .attr('height', scaleY.bandwidth())
    .attr('x', data => (data.start % dayDurationMs) / dayDurationMs * maxWidth)
    .attr('y', data => scaleY(data.annotation1))

addBoundaries(periods)
addFill(periods)
addAnnotations(periods)

// HELPER METHODS
function addBoundaries(periodComponents) {
    periodComponents
        .append('line')
        .classed('line', true)
        .attr('x1', data => (data.start % dayDurationMs) / dayDurationMs * maxWidth)
        .attr('y1', data => scaleY(data.annotation1))
        .attr('x2', data => (data.start % dayDurationMs) / dayDurationMs * maxWidth)
        .attr('y2', data => scaleY(data.annotation1) + scaleY.bandwidth())

    periodComponents
        .append('line')
        .classed('line', true)
        .attr('x1', data => (data.end % dayDurationMs) / dayDurationMs * maxWidth)
        .attr('y1', data => scaleY(data.annotation1))
        .attr('x2', data => (data.end % dayDurationMs) / dayDurationMs * maxWidth)
        .attr('y2', data => scaleY(data.annotation1) + scaleY.bandwidth())
}

function addFill(periodComponents) {
    periodComponents
        .append('line')
        .classed('line', true)
        .attr('x1', data => (data.start % dayDurationMs) / dayDurationMs * maxWidth)
        .attr('y1', data => scaleY(data.annotation1) + scaleY.bandwidth() / 2)
        .attr('x2', data => (data.end % dayDurationMs) / dayDurationMs * maxWidth)
        .attr('y2', data => scaleY(data.annotation1) + scaleY.bandwidth() / 2)
}

function addAnnotations(periodComponents) {
    periodComponents
        .append('text')
        .classed('text', true)
        .attr('x', data => ((data.start % dayDurationMs)) / dayDurationMs * maxWidth)
        .attr('y', data => scaleY(data.annotation1) + scaleY.bandwidth() / 4)
        .attr('width', data => (data.end - data.start) / 2 * maxWidth)
        .attr('dx', data => (data.end - data.start) / dayDurationMs * maxWidth / 2)
        .text(data => data.annotation1)
        .text(function(data) {
            const componentWidth = ((data.end - data.start) / dayDurationMs * maxWidth);
            console.log(componentWidth);
            console.log(this.getComputedTextLength());
            if (this.getComputedTextLength() > componentWidth) {
                return '';
            }
            return data.annotation1;
        })

    periodComponents
        .append('text')
        .classed('text', true)
        .attr('x', data => ((data.start % dayDurationMs)) / dayDurationMs * maxWidth)
        .attr('y', data => scaleY(data.annotation1) + scaleY.bandwidth() / 4 * 3)
        .attr('width', data => (data.end - data.start) / 2 * maxWidth)
        .attr('dx', data => (data.end - data.start) / dayDurationMs * maxWidth / 2)
        .text(data => data.annotation2)
        .text(function(data) {
            const componentWidth = ((data.end - data.start) / dayDurationMs * maxWidth);
            console.log(componentWidth);
            console.log(this.getComputedTextLength());
            if (this.getComputedTextLength() > componentWidth) {
                return '';
            }
            return data.annotation2;
        })
}
