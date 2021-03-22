import { PeriodFillStyle } from 'period-fill.type';

export interface PeriodStyle {
    backgroundColour?: string;
    fillStyle?: PeriodFillStyle;
    fillColour?: string;
    lineWidth?: number;

    // TODO: implement for periods
    borderColour?: number;
    borderWidth?: number;
    borderStyle?: string;
}
