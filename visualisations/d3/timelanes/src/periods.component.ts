import { Tooltip } from 'tooltip';
import { Annotation, AnnotationInternal } from './annotation.interface';
import { Period, PeriodInternal } from './period.interface';
import { TimelanesGraphic } from './timelanes-graphic';

export class Periods {

    private DEFAULT_PERIOD_BACKGROUND_COLOR = 'none';
    private DEFAULT_PERIOD_FILL_COLOR = 'black';
    private DEFAULT_ANNOTATION_TEXT_COLOR = 'black';
    private DEFAULT_LINE_WIDTH = 2;

    private selection: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>;
    private data: PeriodInternal[];
    private component: TimelanesGraphic;
    private tooltip: Tooltip;

    constructor(parent: TimelanesGraphic, data: Period[], tooltip: Tooltip, selection: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>) {
        this.component = parent;
        this.tooltip = tooltip;
        this.selection = selection;
        this.data = data.map(period => this.processPeriod(period));
        this.selection.data(this.data).enter();
        this.formatPeriods(this.selection);
        this.addBoundaries(this.selection);
        this.addFill(this.selection);
        this.addAnnotations(this.selection);
    }


    private processPeriod(input: Period): PeriodInternal {
        return {
            ...input,
            group: `${moment(input.start).format('dddd')} (${moment(input.start).format('DD/MM')})`,
            annotation1: this.processAnnotation(input.annotation1),
            annotation2: this.processAnnotation(input.annotation2),
        };
    }

    private processAnnotation(original: Annotation): AnnotationInternal {
        return {
            textColor: 'black',
            hidden: false,
            ...original,
        }
    }

    private findX(startTimestamp: number) {
        const MAX_X_VALUE = this.component.getMaxValue();
        const MAX_CONTAINER_WIDTH = this.component.getWidth();
        return (startTimestamp % MAX_X_VALUE) / MAX_X_VALUE * MAX_CONTAINER_WIDTH;
    }

    private getPeriodWidth(data: PeriodInternal) {
        const MAX_X_VALUE = this.component.getMaxValue();
        const MAX_CONTAINER_WIDTH = this.component.getWidth();
        return (data.end - data.start) / MAX_X_VALUE * MAX_CONTAINER_WIDTH;
    }

    private formatPeriods(selection: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>) {
        const MAX_X_VALUE = this.component.getMaxValue();
        const instance = this;

        selection
            .append('rect')
            .classed('period', true)
            .attr('width', (data: PeriodInternal) => instance.getPeriodWidth(data))
            .attr('height', instance.component.scaleY.bandwidth())
            .attr('x', (data: PeriodInternal) => this.findX(data.start % MAX_X_VALUE))
            .attr('y', (data: PeriodInternal) => instance.component.scaleY(data.group) || null)
            .style('fill', (data: PeriodInternal) => data.style?.backgroundColour || this.DEFAULT_PERIOD_BACKGROUND_COLOR)
            .on('mousemove', (event: any) => this.tooltip.move(event.pageX, event.pageY))
            .on('mouseout', () => this.tooltip.hide())
            .on('mouseover', (event: any, period: PeriodInternal) => {
                const lines = [
                    period.annotation1.text,
                    period.annotation2.text,
                ];
                if (!period.annotation1.hidden || !period.annotation2.hidden) {
                    this.tooltip.show(lines);
                }
            })
    }

    private addBoundaries(periodComponents: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>) {
        const MAX_X_VALUE = this.component.getMaxValue();
        const instance = this;

        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', (data: PeriodInternal) => (data.start % MAX_X_VALUE) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y1', (data: PeriodInternal) => instance.component.scaleY(data.group) || null)
            .attr('x2', (data: PeriodInternal) => (data.start % MAX_X_VALUE) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y2', (data: PeriodInternal) => (instance.component.scaleY(data.group) || 0) + instance.component.scaleY.bandwidth())
            .style('stroke', (data: PeriodInternal) => data.style?.fillColour || this.DEFAULT_PERIOD_FILL_COLOR)
            .style('stroke-width', (data: PeriodInternal) => data.style?.lineWidth || this.DEFAULT_LINE_WIDTH)

        periodComponents
            .append('line')
            .classed('line', true)
            .attr('x1', (data: PeriodInternal) => (data.end % MAX_X_VALUE) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y1', (data: PeriodInternal) => instance.component.scaleY(data.group) || null)
            .attr('x2', (data: PeriodInternal) => (data.end % MAX_X_VALUE) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y2', (data: PeriodInternal) => (instance.component.scaleY(data.group) || 0) + instance.component.scaleY.bandwidth())
            .style('stroke', (data: PeriodInternal) => data.style?.fillColour || this.DEFAULT_PERIOD_FILL_COLOR)
            .style('stroke-width', (data: PeriodInternal) => data.style?.lineWidth || this.DEFAULT_LINE_WIDTH)
        }

    private addFill(periodComponents: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>) {
        const MAX_X_VALUE = this.component.getMaxValue();
        const instance = this;

        periodComponents
            .append('line')
            .classed('fill-line-solid', (data: PeriodInternal) => data.style?.fillStyle === 'line-solid')
            .classed('fill-line-dashed', (data: PeriodInternal) => data.style?.fillStyle === 'line-dashed')
            .classed('fill-none', (data: PeriodInternal) => data.style?.fillStyle === 'none')
            .attr('x1', (data: PeriodInternal) => (data.start % MAX_X_VALUE) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y1', (data: PeriodInternal) => (instance.component.scaleY(data.group) || 0) + instance.component.scaleY.bandwidth() / 2)
            .attr('x2', (data: PeriodInternal) => (data.end % MAX_X_VALUE) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y2', (data: PeriodInternal) => (instance.component.scaleY(data.group) || 0) + instance.component.scaleY.bandwidth() / 2)
            .style('stroke', (data: PeriodInternal) => {
                if (data.style?.fillStyle === 'none') {
                    return 0;
                }
                return data.style?.fillColour || this.DEFAULT_PERIOD_FILL_COLOR;
            })
            .style('stroke-width', (data: PeriodInternal) => data.style?.lineWidth || this.DEFAULT_LINE_WIDTH)

    }

    private addAnnotations(periodComponents: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>) {
        const instance = this;
        const MAX_X_VALUE = this.component.getMaxValue();

        periodComponents
            .append('text')
            .classed('text', true)
            .attr('x', (data: PeriodInternal) => ((data.start % MAX_X_VALUE)) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y', (data: PeriodInternal) => (instance.component.scaleY(data.group) || 0) + (instance.component.scaleY.bandwidth() / 4))
            .attr('width', (data: PeriodInternal) => (data.end - data.start) / 2 * instance.component.getWidth())
            .attr('dx', (data: PeriodInternal) => (data.end - data.start) / MAX_X_VALUE * instance.component.getWidth() / 2)
            .text((data: PeriodInternal) => data.annotation1.text)
            .style('fill', (data: PeriodInternal) => data.annotation1.textColor || this.DEFAULT_ANNOTATION_TEXT_COLOR)
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
            .attr('x', (data: PeriodInternal) => ((data.start % MAX_X_VALUE)) / MAX_X_VALUE * instance.component.getWidth())
            .attr('y', (data: PeriodInternal) => (instance.component.scaleY(data.group) || 0) + (instance.component.scaleY.bandwidth() / 4 * 3) + (data.style?.lineWidth || this.DEFAULT_LINE_WIDTH))
            .attr('width', (data: PeriodInternal) => (data.end - data.start) / 2 * instance.component.getWidth())
            .attr('dx', (data: PeriodInternal) => (data.end - data.start) / MAX_X_VALUE * instance.component.getWidth() / 2)
            .text((data: PeriodInternal) => data.annotation2.text)
            .style('fill', (data: PeriodInternal) => data.annotation1.textColor || this.DEFAULT_ANNOTATION_TEXT_COLOR)
            .text(function(data: PeriodInternal) {
                if (this.getComputedTextLength() > instance.getPeriodWidth(data)) {
                    data.annotation2.hidden = false;
                    return '';
                }
                data.annotation2.hidden = true;
                return data.annotation2.text;
            })
    }
}