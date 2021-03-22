import * as d3 from 'd3';

import { Period, PeriodInternal } from './period.interface';
import { TimelanesConfiguration } from './timelanes-configuration.interface';
import { Periods } from './periods.component';
import { Tooltip } from './tooltip';
import { Days } from './days';
import { Elements } from './elements.interface';

export class TimelanesGraphic {

    private DAY_DURATION_MS = 24 * 60 * 60 * 1000;
    private HEIGHT_PX: number;
    private WIDTH_PX: number;

    private container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private svg: SVGSVGElement;

    private days: Days;
    private periods: Periods;
    private tooltip: Tooltip;

    public scaleX: d3.ScaleLinear<number, number, never>;
    public scaleY: d3.ScaleBand<string>;

    constructor(ids: Elements, data: Period[], configuration: TimelanesConfiguration = {}) {
        this.container = this.getContainer(ids.svg);
        this.svg = this.getSvg(ids.svg);

        // get svg dimentions
        this.WIDTH_PX = this.svg.width.baseVal.value;
        this.HEIGHT_PX = this.svg.height.baseVal.value;
        if (!this.WIDTH_PX || !this.HEIGHT_PX) {
            throw new Error('svg component must have "width" and "height" properties set');
        }

        // get selections
        const daysSelection = this.container.selectAll('.day');
        const periodSelection = this.container.selectAll('.period');

        // prepare data
        const periods: PeriodInternal[] = JSON.parse(JSON.stringify(data));
        const days = Days.findDays(periods, this.getMaxValue());

        // prepare scaling methods
        this.scaleX = d3.scaleLinear()
            .domain([0, this.getMaxValue()])
            .range([0, this.WIDTH_PX])

        this.scaleY = d3.scaleBand()
            .domain(days.map(item => item.group))
            .rangeRound([0, this.HEIGHT_PX])
            .padding(0.3)

        // format sub-objects
        this.tooltip = new Tooltip(ids.tooltip);
        this.days = new Days(this, daysSelection, days, configuration?.timelaneStyle);
        this.periods = new Periods(this, periodSelection, periods, this.tooltip);
        this.styleContainer(this.container, configuration);
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

    private styleContainer(container: any, configuration: TimelanesConfiguration) {
        container
        .classed('container', true)
        .style('background-color', configuration?.backgroundColour || 'dddddd')
        .style('border-color', configuration?.borderColour || 'black')
        .style('border-width', configuration?.borderWidth || '3px')
        .style('border-style', configuration?.borderStyle || 'solid')

    }

}