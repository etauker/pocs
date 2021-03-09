class Period {
    start
    end
    fill
    annotation1
    annotation2
    hideTooltipAnnotation1; // internal use
    hideTooltipAnnotation2; // internal use
}

const DAY_DURATION_MS = 24 * 60 * 60 * 1000;

class SimpleTimeline {

    _container;
    _days;
    _svg;
    _periods;
    _maxWidth;
    _maxHeight;
    _tooltip;

    constructor(svgId, data) {
        data = JSON.parse(JSON.stringify(data));
        this._container = d3.select(`#${svgId}`);
        this._svg = document.getElementById(svgId);
        const days = this._findDays(data);

        if (!this._svg) {
            throw new Error('html component with id "' + svgId + '" not found');
        }
    
        this._maxWidth = parseInt(this._svg.getAttribute('width'), 10);
        this._maxHeight = parseInt(this._svg.getAttribute('height'), 10);
    
        if (!this._maxWidth || !this._maxHeight) {
            throw new Error('svg component must have "width" and "height" properties set');
        }

        this._scaleX = d3.scaleLinear()
            .domain([0, DAY_DURATION_MS])
            .range([0, this._maxWidth]);

        this._scaleY = d3.scaleBand()
            .domain(days.map(data => data.annotation1))
            .rangeRound([0, this._maxHeight])
            .padding(0.3);

        this._days = this._container
            .selectAll('.bar')
            .data(days)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('width', data => this._scaleX(data.end - data.start))
            .attr('height', this._scaleY.bandwidth())
            .attr('x', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y', data => this._scaleY(data.annotation1))

        this._periods = this._container
            .selectAll('.period')
            .data(data)
            .enter();


        // TODO: generalise
        this._tooltip = d3.select("#my_dataviz")
            .append("div")
            .classed('tooltip', true);


        this._styleContainer();
        this._formatPeriods();
        this._addBoundaries(this._periods)
        this._addFill(this._periods)
        this._addAnnotations(this._periods)

    }

    _styleContainer = function() {
        console.log('styling container...');
        this._container.classed('container', true);
    }

    _scaleX = function() {
        throw new Error('X scaling function not implemented');
    }

    _scaleY = function() {
        throw new Error('Y scaling function not implemented');
    }

    _formatPeriods = function() {
        console.log('formatting time periods...');
        const instance = this;
        this._periods
            .append('rect')
            .classed('bar', true)
            .attr('width', data => this._scaleX(data.end - data.start))
            .attr('height', this._scaleY.bandwidth())
            .attr('x', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y', data => this._scaleY(data.annotation1))
            .on('mouseover', function (event, period) {
                let show = false;

                if (!period.hideTooltipAnnotation1) {
                    show = true;
                    instance._tooltip.append('div').text(period.annotation1);
                }
                if (!period.hideTooltipAnnotation2) {
                    show = true;
                    instance._tooltip.append('div').text(period.annotation2);
                }
                if (show) {
                    return instance._tooltip.style('visibility', 'visible');
                }

            })
            .on('mousemove', function (event, period) {
                return instance._tooltip.style('top', (event.pageY)+'px').style('left',(event.pageX)+'px');
            })
            .on('mouseout', function () {
                instance._tooltip.text('');
                return instance._tooltip.style('visibility', 'hidden');
            });
    }

    // HELPER METHODS
    _addBoundaries = function(periodComponents) {
        console.log('adding period boundaries...');
        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y1', data => this._scaleY(data.annotation1))
            .attr('x2', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y2', data => this._scaleY(data.annotation1) + this._scaleY.bandwidth())

        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', data => (data.end % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y1', data => this._scaleY(data.annotation1))
            .attr('x2', data => (data.end % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y2', data => this._scaleY(data.annotation1) + this._scaleY.bandwidth())
    }

    _addFill = function(periodComponents) {
        console.log('adding period fill...');
        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y1', data => this._scaleY(data.annotation1) + this._scaleY.bandwidth() / 2)
            .attr('x2', data => (data.end % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
            .attr('y2', data => this._scaleY(data.annotation1) + this._scaleY.bandwidth() / 2)
    }

    _addAnnotations = function(periodComponents) {
        console.log('adding annotations...');
        const instance = this;

        periodComponents
            .append('text')
            .classed('text', true)
            .attr('x', data => ((data.start % DAY_DURATION_MS)) / DAY_DURATION_MS * this._maxWidth)
            .attr('y', data => this._scaleY(data.annotation1) + this._scaleY.bandwidth() / 4)
            .attr('width', data => (data.end - data.start) / 2 * this._maxWidth)
            .attr('dx', data => (data.end - data.start) / DAY_DURATION_MS * this._maxWidth / 2)
            .text(data => data.annotation1)
            .text(function(data) {
                if (this.getComputedTextLength() > instance._getPeriodWidth(data)) {
                    data.hideTooltipAnnotation1 = false;
                    return '';
                }
                data.hideTooltipAnnotation1 = true;
                return data.annotation1;
            })

        periodComponents
            .append('text')
            .classed('text', true)
            .attr('x', data => ((data.start % DAY_DURATION_MS)) / DAY_DURATION_MS * this._maxWidth)
            .attr('y', data => this._scaleY(data.annotation1) + this._scaleY.bandwidth() / 4 * 3)
            .attr('width', data => (data.end - data.start) / 2 * this._maxWidth)
            .attr('dx', data => (data.end - data.start) / DAY_DURATION_MS * this._maxWidth / 2)
            .text(data => data.annotation2)
            .text(function(data) {
                if (this.getComputedTextLength() > instance._getPeriodWidth(data)) {
                    data.hideTooltipAnnotation2 = false;
                    return '';
                }
                data.hideTooltipAnnotation2 = true;
                return data.annotation2;
            })
    }

    _getPeriodWidth(data) {
        return ((data.end - data.start) / DAY_DURATION_MS * this._maxWidth);
    }

    _findDays = function(periods) {
        const earliestTimestamp = periods.map(val => val.start).sort((val1, val2) => val1 - val2)[0];
        const latestTimestamp = periods.map(val => val.end).sort((val1, val2) => val2 - val1)[0];
        const dayCount = Math.ceil((latestTimestamp - earliestTimestamp) / DAY_DURATION_MS);

        const days = [];
        for (let i = 0; i < dayCount; i++) {
            const timestamp = earliestTimestamp + (DAY_DURATION_MS * i);
            const dayStart = moment(timestamp).set({
                hour:0,
                minute:0,
                second:0,
                millisecond:0,
            });
            const dayEnd = dayStart.clone().add(1, 'day').subtract(1, 'millisecond');
            const dayOfTheWeek = dayStart.clone().format('dddd');

            days.push({
                start: dayStart.valueOf(),
                end: dayEnd.valueOf(),
                fill: 'none',
                annotation1: dayOfTheWeek,
                annotation2: 'additional info'
            });

        }

        return days;
    }


}