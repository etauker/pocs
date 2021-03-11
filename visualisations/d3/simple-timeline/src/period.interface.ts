import { Annotation } from 'annotation.interface';
import { PeriodFill } from 'period-fill.interface';

export interface Period {
    start: number;
    end: number;
    fill: PeriodFill;
    annotation1: Annotation;
    annotation2: Annotation;
}

export interface PeriodInternal extends Period {
    group: string;
}
