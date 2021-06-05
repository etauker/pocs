import { PeriodFillStyle } from './period-fill.type';

export interface PeriodStyle {
    backgroundColour?: string;
    fillStyle?: PeriodFillStyle;
    fillColour?: string;
    lineWidth?: string;

    // TODO: implement for periods
    borderColour?: string;
    borderWidth?: string;
    borderStyle?: string;
}
