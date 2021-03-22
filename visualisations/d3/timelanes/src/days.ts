import * as d3 from 'd3';
import moment from 'moment';

import { Annotation, AnnotationInternal } from 'annotation.interface';
import { PeriodFillStyle } from 'period-fill.type';
import { Period, PeriodInternal } from './period.interface';
import { TimelanesGraphic } from 'timelanes-graphic';
import { PeriodStyle } from 'period-style.interface';


export class Days {

    private selection: d3.Selection<d3.EnterElement, PeriodInternal, d3.BaseType, unknown>;
    private data: PeriodInternal[];

    constructor(parent: TimelanesGraphic, selection: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>, data: PeriodInternal[], config: PeriodStyle = {}) {
        this.selection = selection.data(data).enter();
        this.data = data;

        this.selection
            .append('rect')
            .classed('day', true)
            .attr('width', data => parent.scaleX(data.end - data.start))
            .attr('height', parent.scaleY.bandwidth())
            .attr('x', data => (data.start % parent.getMaxValue()) / parent.getMaxValue() * parent.getWidth())
            .attr('y', (data) => parent.scaleY(data.group) || null)
            .style('fill', config?.backgroundColour || 'white')
            .style('outline-color', config?.borderColour || 'black')
            .style('outline-width', config?.borderWidth || '1px')
            .style('outline-style', config?.borderStyle || 'solid')

            if (config?.fillStyle) {
                // TODO: implement
                // fillStyle
                // fillColour
                // lineWidth
            }
    }

    public getGroups() {
        return this.data.map(item => item.group);
    }

    public static findDays(data: Period[], maxValue: number): PeriodInternal[] {
        const earliestTimestamp = data
            .map(val => val.start.valueOf())
            .sort((val1, val2) => val1 - val2)[0];

        const latestTimestamp = data
            .map(val => val.end.valueOf())
            .sort((val1, val2) => val2 - val1)[0];

        const dayCount = Math.ceil((latestTimestamp - earliestTimestamp) / maxValue) + 1;
        const days: Period[] = new Array(dayCount).fill(null).map((_, i) => {
           
            const timestamp = earliestTimestamp + (maxValue * i);
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


    private static processInput(input: Period[]): PeriodInternal[] {
        return input.map(period => {
                return {
                    ...period,
                    group: `${moment(period.start).format('dddd')} (${moment(period.start).format('DD/MM')})`,
                    annotation1: this.processAnnotation(period.annotation1),
                    annotation2: this.processAnnotation(period.annotation2),
                }
            })
    }

    private static processAnnotation(original: Annotation): AnnotationInternal {
        return {
            ...original,
            hidden: false,
        }
    }


}