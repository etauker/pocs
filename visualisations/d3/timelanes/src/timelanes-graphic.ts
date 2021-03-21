import * as d3 from 'd3';
import moment from 'moment';

import { Period, PeriodInternal } from './period.interface';
import { PeriodFillStyle } from './period-fill.type';
import { TimelanesConfiguration } from './timelanes-configuration.interface';
import { Periods } from './periods.component';
import { Annotation, AnnotationInternal } from './annotation.interface';
import { Tooltip } from './tooltip';

export class TimelanesGraphic {

    private DAY_DURATION_MS = 24 * 60 * 60 * 1000;
    private HEIGHT_PX: number;
    private WIDTH_PX: number;

    private container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private tooltip: Tooltip;
    private yBandKeys: string[];
    private svg: SVGSVGElement;

    private days: PeriodInternal[];
    private periods: Periods;

    public scaleX: d3.ScaleLinear<number, number, never>;
    public scaleY: d3.ScaleBand<string>;

    constructor(svgId: string, tooltipId: string, data: Period[], configuration: TimelanesConfiguration) {
        const copy: PeriodInternal[] = JSON.parse(JSON.stringify(data));
        this.container = this.getContainer(svgId);
        this.svg = this.getSvg(svgId);
        this.days = this.findDays(data);
        this.yBandKeys = this.days.map(data => data.group);

        this.WIDTH_PX = this.svg.width.baseVal.value;
        this.HEIGHT_PX = this.svg.height.baseVal.value;

        if (!this.WIDTH_PX || !this.HEIGHT_PX) {
            throw new Error('svg component must have "width" and "height" properties set');
        }

        this.scaleX = d3.scaleLinear()
            .domain([0, this.getMaxValue()])
            .range([0, this.WIDTH_PX])

        this.scaleY = d3.scaleBand()
            .domain(this.yBandKeys)
            .rangeRound([0, this.HEIGHT_PX])
            .padding(0.3)

        this.tooltip = new Tooltip(tooltipId);

        this.container
            .selectAll('.day')
            .data(this.days)
            .enter()
            .append('rect')
            .classed('day', true)
            .attr('width', data => this.scaleX(data.end - data.start))
            .attr('height', this.scaleY.bandwidth())
            .attr('x', data => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.WIDTH_PX)
            .attr('y', (data) => this.scaleY(data.group) || null)

        const periodSelection = this.container
            .selectAll('.period')
            .data(copy)
            .enter();

        this.periods = new Periods(this, copy, this.tooltip, periodSelection);
        this.styleContainer(this.container);
    }

    /** 
     * Returns the width of the svg component in pixels.
     */
    public getWidth(): number {
        return this.WIDTH_PX;
    }

    /** 
     * Returns the maximum X value in milliseconds.
     */
    public getMaxValue(): number {
        return this.DAY_DURATION_MS;
    }


    private styleContainer(container: any) {
        container.classed('container', true);
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

    private findDays(data: Period[]): PeriodInternal[] {
        const earliestTimestamp = data
            .map(val => val.start.valueOf())
            .sort((val1, val2) => val1 - val2)[0];

        const latestTimestamp = data
            .map(val => val.end.valueOf())
            .sort((val1, val2) => val2 - val1)[0];

        const dayCount = Math.ceil((latestTimestamp - earliestTimestamp) / this.getMaxValue()) + 1;
        const days: Period[] = new Array(dayCount).fill(null).map((_, i) => {
           
            const timestamp = earliestTimestamp + (this.getMaxValue() * i);
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
                style: {
                    fillStyle: 'none' as PeriodFillStyle,
                },
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

    private getSvg(id: string): SVGSVGElement {
        const svg = document.getElementById(id);
        if (!svg) {
            throw new Error('svg component with id "' + id + '" not found');
        } else {
            return svg as any as SVGSVGElement;
        }
    }
}