// source: https://www.youtube.com/watch?v=TOJ9yjvlapY
// tooltip source: https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html


// format data
const PERIODS = [
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').subtract(3, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').subtract(2, 'hours').valueOf(),
        fill: 'line',
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').format('dddd') },
        annotation2: { text: '1h' }
    },
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').add(2, 'days').subtract(7, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').add(2, 'days').subtract(3, 'hours').valueOf(),
        fill: 'line',
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').add(2, 'days').format('dddd') },
        annotation2: { text: '4h' }
    },
    {
        start: moment('08-03-2021', 'DD-MM-YYYY').add(6, 'days').subtract(20, 'hours').valueOf(),
        end: moment('08-03-2021', 'DD-MM-YYYY').add(6, 'days').subtract(12, 'hours').valueOf(),
        fill: 'line',
        annotation1: { text: moment('08-03-2021', 'DD-MM-YYYY').add(6, 'days').format('dddd') },
        annotation2: { text: '8h' }
    }
];

const timeline = new SimpleTimeline('visual', PERIODS);
timeline.test();

