import { Annotation, AnnotationInternal } from 'annotation.interface';
import { PeriodFillStyle } from 'period-fill.interface';

export interface PeriodStyle {
    fillStyle?: PeriodFillStyle;
    fillColour?: string;
    backgroundColour?: string;
    lineWidth?: number;
}

export interface Period {
    start: number;
    end: number;
    style?: PeriodStyle;
    annotation1: Annotation;
    annotation2: Annotation;
}

export interface PeriodInternal extends Period {
    group: string;
    annotation1: AnnotationInternal;
    annotation2: AnnotationInternal;
}
