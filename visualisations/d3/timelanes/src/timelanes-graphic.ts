import moment from 'moment';
import * as d3 from 'd3';

import { Period, PeriodInternal } from './period.interface';
import { ScaleBand, ScaleLinear } from 'd3';
import { PeriodFillStyle } from './period-fill.type';
import { TimelanesConfiguration } from './timelanes-configuration.interface';
import { Periods } from './periods.component';
import { Annotation, AnnotationInternal } from './annotation.interface';

export class TimelanesGraphic {

    private DAY_DURATION_MS = 24 * 60 * 60 * 1000;
    private HEIGHT: number;
    private WIDTH: number;

    private container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    public tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    private days: PeriodInternal[];
    public periods: Periods;
    private svg: SVGSVGElement;
    private yBandKeys: string[];

    public scaleX: ScaleLinear<number, number, never>;
    public scaleY: ScaleBand<string>;

    constructor(svgId: string, data: Period[], configuration: TimelanesConfiguration) {
        const copy: PeriodInternal[] = JSON.parse(JSON.stringify(data));
        this.container = this.getContainer(svgId);
        this.svg = this.getSvg(svgId);
        this.days = this.findDays(data);
        this.yBandKeys = this.days.map(data => data.group);

        this.WIDTH = this.svg.width.baseVal.value;
        this.HEIGHT = this.svg.height.baseVal.value;

        if (!this.WIDTH || !this.HEIGHT) {
            throw new Error('svg component must have "width" and "height" properties set');
        }

        this.scaleX = d3.scaleLinear()
            .domain([0, this.getMaxValue()])
            .range([0, this.WIDTH])

        this.scaleY = d3.scaleBand()
            .domain(this.yBandKeys)
            .rangeRound([0, this.HEIGHT])
            .padding(0.3)

        // TODO: generalise
        this.tooltip = d3.select("#my_dataviz")
            .append("div")
            .classed('tooltip', true);

        // const daySelection = 
        this.container
            .selectAll('.day')
            .data(this.days)
            .enter()
            .append('rect')
            .classed('day', true)
            .attr('width', data => this.scaleX(data.end - data.start))
            .attr('height', this.scaleY.bandwidth())
            .attr('x', data => (data.start % this.DAY_DURATION_MS) / this.DAY_DURATION_MS * this.WIDTH)
            .attr('y', (data) => this.scaleY(data.group) || null)


        const periodSelection = this.container
            .selectAll('.period')
            .data(copy)
            .enter();


        this.periods = new Periods(this, copy, periodSelection);
        this.styleContainer(this.container);
    }

    /**
     * Shows the the array of strings in the tooltip. 
     * All lines are hidden if any of the elements in display array is false.
     */
    public showTooltip(lines: string[], display: boolean[]): void {
        const show = lines
            .map((text: string, index: number) => {
                this.tooltip.append('div').text(text);
                return display[index];
            })
            .some(display => display);

        if (show) {
            this.tooltip.style('visibility', 'visible');
        } else {
            this.tooltip.text('').style('visibility', 'hidden');
        }
    }

    /**
     * Hide the tooltip.
     */
    public hideTooltip(): void {
        this.tooltip.text('').style('visibility', 'hidden');
    }

    /**
     * Update the location of thetooltip on the screen.
     */
    public moveTooltip(x: number, y: number): void {
        this.tooltip.style('top', y + 'px').style('left', x + 'px');
    }

    private styleContainer(container: any) {
        console.log('styling container...');
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

    public getWidth(): number {
        return this.WIDTH;
    }
    public getMaxValue(): number {
        return this.DAY_DURATION_MS;
    }
}