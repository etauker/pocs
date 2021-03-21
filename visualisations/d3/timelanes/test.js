// source: https://www.youtube.com/watch?v=TOJ9yjvlapY
// tooltip source: https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html


// format data
const PERIODS = [
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').subtract(16, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').subtract(495, 'minutes').valueOf(),
        style: {
            backgroundColour: 'grey',
            fillColour: 'black',
            fillStyle: 'none',
        },
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').format('dddd') },
        annotation2: { text: '7.75h' }
    },
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').subtract(8, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').subtract(3, 'hours').valueOf(),
        style: {
            backgroundColour: 'yellow',
            fillColour: 'orange',
            fillStyle: 'line-solid',
        },
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').format('dddd') },
        annotation2: { text: '5h' }
    },
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').subtract(3, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').subtract(2, 'hours').valueOf(),
        style: {
            backgroundColour: 'yellow',
            fillColour: 'red',
            fillStyle: 'line-solid',
        },
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').format('dddd') },
        annotation2: { text: '1h' }
    },
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').add(2, 'days').subtract(7, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').add(2, 'days').subtract(3, 'hours').valueOf(),
        style: { fillStyle: 'none' },
        annotation1: {
            text: moment('08-03-2021', 'DD-MM-YYYY').add(2, 'days').format('dddd'),
            textColor: 'green',
        },
        annotation2: { text: '4h' }
    },
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').add(6, 'days').subtract(20, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').add(6, 'days').subtract(12, 'hours').valueOf(),
        style: {
            fillStyle: 'line-dashed',
            fillColour: 'orange',
        },
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').add(6, 'days').format('dddd') },
        annotation2: { text: '8h' }
    }
];

const timeline = new TimelanesGraphic('visual', 'tooltip', PERIODS);

