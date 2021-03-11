import moment from 'moment';
import * as d3 from 'd3';

import { Period, PeriodInternal } from './period.interface';
import { ScaleBand, ScaleLinear } from 'd3';

export class SimpleTimeline {

    private DAY_DURATION_MS = 24 * 60 * 60 * 1000;
    private container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private daySelection;//: d3.Selection<SVGRectElement, unknown, any, any>;
    private svg: HTMLElement;
    private data: Period[];
    private days: PeriodInternal[];
    private componentWidth: number;
    private componentHeight: number;
    private yBandKeys: string[];

    private scaleX: ScaleLinear<number, number, never>;
    private scaleY: ScaleBand<string>;
    
    constructor(svgId: string, data: Period[]) {
        console.log('creating simple timeline');

        this.data = JSON.parse(JSON.stringify(data));
        this.container = this.getContainer(svgId);
        this.svg = this.getSvg(svgId);
        this.days = this.findDays(data);
        this.yBandKeys = this.days.map(data => data.group);

        this.componentWidth = parseInt(this.svg.getAttribute('width') || '0', 10);
        this.componentHeight = parseInt(this.svg.getAttribute('height') || '0', 10);
        if (!this.componentWidth || !this.componentHeight) {
            throw new Error('svg component must have "width" and "height" properties set');
        }

        this.scaleX = d3.scaleLinear()
            .domain([0, this.DAY_DURATION_MS])
            .range([0, this.componentWidth])

        this.scaleY = d3.scaleBand()
            .domain(this.yBandKeys)
            .rangeRound([0, this.componentHeight])
            .padding(0.3)

        this.daySelection = this.container
            .selectAll('.bar')
            .data(this.days)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('width', data => this.scaleX(data.end - data.start))
            .attr('height', this.scaleY.bandwidth())
            .attr('x', data => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y', (data) => this.scaleY(data.group) || null)

        // this._periods = this._container
        //     .selectAll('.period')
        //     .data(data)
        //     .enter();


        // // TODO: generalise
        // this._tooltip = d3.select("#my_dataviz")
        //     .append("div")
        //     .classed('tooltip', true);


        // this._styleContainer();
        // this._formatPeriods();
        // this._addBoundaries(this._periods)
        // this._addFill(this._periods)
        // this._addAnnotations(this._periods)
    }

    public test() {
        console.log('testing'); 
    }


    // _styleContainer = function() {
    //     console.log('styling container...');
    //     this._container.classed('container', true);
    // }

    // _scaleX = function() {
    //     throw new Error('X scaling function not implemented');
    // }

    // _scaleY = function() {
    //     throw new Error('Y scaling function not implemented');
    // }

    // _formatPeriods = function() {
    //     console.log('formatting time periods...');
    //     const instance = this;
    //     this._periods
    //         .append('rect')
    //         .classed('bar', true)
    //         .attr('width', data => this.scaleX(data.end - data.start))
    //         .attr('height', this.scaleY.bandwidth())
    //         .attr('x', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y', data => this.scaleY(data.annotation1.text))
    //         .on('mouseover', function (event, period) {
    //             let show = false;

    //             if (!period.hideTooltipAnnotation1) {
    //                 show = true;
    //                 instance._tooltip.append('div').text(period.annotation1);
    //             }
    //             if (!period.hideTooltipAnnotation2) {
    //                 show = true;
    //                 instance._tooltip.append('div').text(period.annotation2);
    //             }
    //             if (show) {
    //                 return instance._tooltip.style('visibility', 'visible');
    //             }

    //         })
    //         .on('mousemove', function (event, period) {
    //             return instance._tooltip.style('top', (event.pageY)+'px').style('left',(event.pageX)+'px');
    //         })
    //         .on('mouseout', function () {
    //             instance._tooltip.text('');
    //             return instance._tooltip.style('visibility', 'hidden');
    //         });
    // }

    // // HELPER METHODS
    // _addBoundaries = function(periodComponents) {
    //     console.log('adding period boundaries...');
    //     periodComponents
    //         .append('line')
    //         .classed('line', true)
    //         .attr('x1', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y1', data => this.scaleY(data.annotation1.text))
    //         .attr('x2', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y2', data => this.scaleY(data.annotation1.text) + this.scaleY.bandwidth())

    //     periodComponents
    //         .append('line')
    //         .classed('line', true)
    //         .attr('x1', data => (data.end % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y1', data => this.scaleY(data.annotation1.text))
    //         .attr('x2', data => (data.end % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y2', data => this.scaleY(data.annotation1.text) + this.scaleY.bandwidth())
    // }

    // _addFill = function(periodComponents) {
    //     console.log('adding period fill...');
    //     periodComponents
    //         .append('line')
    //         .classed('line', true)
    //         .attr('x1', data => (data.start % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y1', data => this.scaleY(data.annotation1.text) + this.scaleY.bandwidth() / 2)
    //         .attr('x2', data => (data.end % DAY_DURATION_MS) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y2', data => this.scaleY(data.annotation1.text) + this.scaleY.bandwidth() / 2)
    // }

    // _addAnnotations = function(periodComponents) {
    //     console.log('adding annotations...');
    //     const instance = this;

    //     periodComponents
    //         .append('text')
    //         .classed('text', true)
    //         .attr('x', data => ((data.start % DAY_DURATION_MS)) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y', data => this.scaleY(data.annotation1.text) + this.scaleY.bandwidth() / 4)
    //         .attr('width', data => (data.end - data.start) / 2 * this._maxWidth)
    //         .attr('dx', data => (data.end - data.start) / DAY_DURATION_MS * this._maxWidth / 2)
    //         .text(data => data.annotation1.text)
    //         .text(function(data) {
    //             if (this.getComputedTextLength() > instance._getPeriodWidth(data)) {
    //                 data.hideTooltipAnnotation1 = false;
    //                 return '';
    //             }
    //             data.hideTooltipAnnotation1 = true;
    //             return data.annotation1.text;
    //         })

    //     periodComponents
    //         .append('text')
    //         .classed('text', true)
    //         .attr('x', data => ((data.start % DAY_DURATION_MS)) / DAY_DURATION_MS * this._maxWidth)
    //         .attr('y', data => this.scaleY(data.annotation1.text) + this.scaleY.bandwidth() / 4 * 3)
    //         .attr('width', data => (data.end - data.start) / 2 * this._maxWidth)
    //         .attr('dx', data => (data.end - data.start) / DAY_DURATION_MS * this._maxWidth / 2)
    //         .text(data => data.annotation2)
    //         .text(function(data) {
    //             if (this.getComputedTextLength() > instance._getPeriodWidth(data)) {
    //                 data.hideTooltipAnnotation2 = false;
    //                 return '';
    //             }
    //             data.hideTooltipAnnotation2 = true;
    //             return data.annotation2;
    //         })
    // }

    // _getPeriodWidth(data) {
    //     return ((data.end - data.start) / DAY_DURATION_MS * this._maxWidth);
    // }

    private findDays(data: Period[]): PeriodInternal[] {
        const earliestTimestamp = data
            .map(val => val.start.valueOf())
            .sort((val1, val2) => val1 - val2)[0];

        const latestTimestamp = data
            .map(val => val.end.valueOf())
            .sort((val1, val2) => val2 - val1)[0];

        const dayCount = Math.ceil((latestTimestamp - earliestTimestamp) / this.DAY_DURATION_MS);
        return new Array(dayCount).fill(null).map((_, i) => {
           
            const timestamp = earliestTimestamp + (this.DAY_DURATION_MS * i);
            const dayStart = moment(timestamp).set({
                hour:0,
                minute:0,
                second:0,
                millisecond:0,
            });

            const dayEnd = dayStart.clone().add(1, 'day').subtract(1, 'millisecond');
            const dayOfTheWeek = dayStart.clone().format('dddd');

            return {
                start: dayStart.valueOf(),
                end: dayEnd.valueOf(),
                fill: 'none',
                group: dayOfTheWeek,
                annotation1: {
                    text: dayOfTheWeek,
                },
                annotation2: {
                    text: dayEnd.diff(dayStart, 'hours') + 'h',
                },
            };
        });
    }

    private getContainer(id: string): d3.Selection<d3.BaseType, unknown, HTMLElement, any> {
        const container = d3.select(`#${id}`);
        if (!container) {
            throw new Error('html component with id "' + id + '" not found');
        } else {
            return container;
        }
    }

    private getSvg(id: string): HTMLElement {
        const svg = document.getElementById(id)
        if (!svg) {
            throw new Error('svg component with id "' + id + '" not found');
        } else {
            return svg;
        }
    }
}