import moment from 'moment';
import * as d3 from 'd3';

import { Period, PeriodInternal } from './period.interface';
import { ScaleBand, ScaleLinear } from 'd3';
import { Annotation, AnnotationInternal } from 'annotation.interface';
import { PeriodFill } from './period-fill.interface';

export class SimpleTimeline {

    private DAY_DURATION_MS = 24 * 60 * 60 * 1000;
    private container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private daySelection;//: d3.Selection<SVGRectElement, unknown, any, any>;
    private svg: HTMLElement;
    private data: PeriodInternal[];
    private days: PeriodInternal[];
    private componentWidth: number;
    private componentHeight: number;
    private yBandKeys: string[];
    
    private scaleX: ScaleLinear<number, number, never>;
    private scaleY: ScaleBand<string>;
    
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private periodSelection: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>;
    
    constructor(svgId: string, data: Period[]) {
        this.data = this.processInput(JSON.parse(JSON.stringify(data)));
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
            .selectAll('.day')
            .data(this.days)
            .enter()
            .append('rect')
            .classed('day', true)
            .attr('width', data => this.scaleX(data.end - data.start))
            .attr('height', this.scaleY.bandwidth())
            .attr('x', data => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y', (data) => this.scaleY(data.group) || null)

        this.periodSelection = this.container
            .selectAll('.period')
            .data(this.data)
            .enter();


        // // TODO: generalise
        this.tooltip = d3.select("#my_dataviz")
            .append("div")
            .classed('tooltip', true);


        this.styleContainer(this.container);
        this.formatPeriods(this.periodSelection);
        this.addBoundaries(this.periodSelection)
        this.addFill(this.periodSelection)
        this.addAnnotations(this.periodSelection)
    }

    private styleContainer(container: any) {
        console.log('styling container...');
        container.classed('container', true);
    }

    private formatPeriods(periodSelection: any) {
        const instance = this;

        periodSelection
            .append('rect')
            .classed('day', true)
            .attr('width', (data: PeriodInternal) => this.scaleX(data.end - data.start))
            .attr('height', this.scaleY.bandwidth())
            .attr('x', (data: PeriodInternal) => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y', (data: PeriodInternal) => this.scaleY(data.group))
            .on('mouseover', function (event: any, period: PeriodInternal) {
                let show = false;

                if (!period.annotation1.hidden) {
                    show = true;
                    instance.tooltip.append('div')
                        .text(period.annotation1.text);
                }
                if (!period.annotation1.hidden) {
                    show = true;
                    instance.tooltip.append('div')
                        .text(period.annotation2.text);
                }
                if (show) {
                    return instance.tooltip.style('visibility', 'visible');
                }

            })
            .on('mousemove', function (event: any, period: Period) {
                return instance.tooltip.style('top', (event.pageY)+'px').style('left',(event.pageX)+'px');
            })
            .on('mouseout', function () {
                instance.tooltip.text('');
                return instance.tooltip.style('visibility', 'hidden');
            });
    }

    private addBoundaries(periodComponents: any) {
        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', (data: PeriodInternal) => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y1', (data: PeriodInternal) => this.scaleY(data.group))
            .attr('x2', (data: PeriodInternal) => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y2', (data: PeriodInternal) => (this.scaleY(data.group) || 0) + this.scaleY.bandwidth())

        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', (data: PeriodInternal) => (data.end % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y1', (data: PeriodInternal) => this.scaleY(data.group))
            .attr('x2', (data: PeriodInternal) => (data.end % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y2', (data: PeriodInternal) => (this.scaleY(data.group) || 0) + this.scaleY.bandwidth())
    }

    private addFill(periodComponents: any) {
        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', (data: PeriodInternal) => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y1', (data: PeriodInternal) => (this.scaleY(data.group) || 0) + this.scaleY.bandwidth() / 2)
            .attr('x2', (data: PeriodInternal) => (data.end % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y2', (data: PeriodInternal) => (this.scaleY(data.group) || 0) + this.scaleY.bandwidth() / 2)
    }

    private addAnnotations(periodComponents: any) {
        const instance: SimpleTimeline = this;

        periodComponents
            .append('text')
            .classed('text', true)
            .attr('x', (data: PeriodInternal) => ((data.start % this.DAY_DURATION_MS)) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y', (data: PeriodInternal) => (this.scaleY(data.group) || 0) + (this.scaleY.bandwidth() / 4))
            .attr('width', (data: PeriodInternal) => (data.end - data.start) / 2 * this.componentWidth)
            .attr('dx', (data: PeriodInternal) => (data.end - data.start) / this.DAY_DURATION_MS * this.componentWidth / 2)
            .text((data: PeriodInternal) => data.annotation1.text)
            .text(function(data: PeriodInternal) {
                if (this.getComputedTextLength() > instance.getPeriodWidth(data)) {
                    data.annotation1.hidden = false;
                    return '';
                }
                data.annotation1.hidden = true;
                return data.annotation1.text;
            })

        periodComponents
            .append('text')
            .classed('text', true)
            .attr('x', (data: PeriodInternal) => ((data.start % this.DAY_DURATION_MS)) / this.DAY_DURATION_MS * this.componentWidth)
            .attr('y', (data: PeriodInternal) => (this.scaleY(data.group) || 0) + (this.scaleY.bandwidth() / 4 * 3))
            .attr('width', (data: PeriodInternal) => (data.end - data.start) / 2 * this.componentWidth)
            .attr('dx', (data: PeriodInternal) => (data.end - data.start) / this.DAY_DURATION_MS * this.componentWidth / 2)
            .text((data: PeriodInternal) => data.annotation2)
            .text(function(data: PeriodInternal) {
                if (this.getComputedTextLength() > instance.getPeriodWidth(data)) {
                    data.annotation2.hidden = false;
                    return '';
                }
                data.annotation2.hidden = true;
                return data.annotation2.text;
            })
    }

    private processInput(input: Period[]): PeriodInternal[] {
        return input.map(period => {
                return {
                    ...period,
                    group: `${moment(period.start).format('dddd')} (${moment(period.start).format('DD/MM')})`,
                    annotation1: this.processAnnotation(period.annotation1),
                    annotation2: this.processAnnotation(period.annotation2),
                }
            })
    }

    private processAnnotation(original: Annotation): AnnotationInternal {
        return {
            ...original,
            hidden: false,
        }
    }

    private getPeriodWidth(data: PeriodInternal) {
        return ((data.end - data.start) / this.DAY_DURATION_MS * this.componentWidth);
    }

    private findDays(data: Period[]): PeriodInternal[] {
        const earliestTimestamp = data
            .map(val => val.start.valueOf())
            .sort((val1, val2) => val1 - val2)[0];

        const latestTimestamp = data
            .map(val => val.end.valueOf())
            .sort((val1, val2) => val2 - val1)[0];

        const dayCount = Math.ceil((latestTimestamp - earliestTimestamp) / this.DAY_DURATION_MS) + 1;
        const days: Period[] = new Array(dayCount).fill(null).map((_, i) => {
           
            const timestamp = earliestTimestamp + (this.DAY_DURATION_MS * i);
            const dayStart = moment(timestamp).set({
                hour:0,
                minute:0,
                second:0,
                millisecond:0,
            });
            const dayEnd = dayStart.clone().add(1, 'day').subtract(1, 'millisecond');

            return {
                start: dayStart.valueOf(),
                end: dayEnd.valueOf(),
                fill: 'none' as PeriodFill,
                group: `${dayStart.format('dddd')} (${dayStart.format('DD/MM')})`,
                annotation1: {
                    text: `${dayStart.format('dddd')}`,
                },
                annotation2: {
                    text: dayEnd.diff(dayStart, 'hours') + 'h',
                },
            };
        }).sort((day1, day2) => day1.start - day2.start);

        return this.processInput(days);
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
        const svg = document.getElementById(id);
        if (!svg) {
            throw new Error('svg component with id "' + id + '" not found');
        } else {
            return svg;
        }
    }
}