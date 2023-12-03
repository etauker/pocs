// import * as d3 from 'd3';

// export class Tooltip {

//     private selection: d3.Selection<HTMLDivElement, any, HTMLElement, any>;

//     constructor(id: string) {
//         this.selection = d3.select(`#${id}`)
//             .append('div')
//             .classed('tooltip', true);
//     }

//     /**
//      * Shows the the array of strings in the tooltip. 
//      * The tooltip is hidden if any of the elements in display array is false.
//      */
//      public show(lines: string[]): void {
//         lines.forEach(text => this.selection.append('div').text(text))
//         this.selection.style('visibility', 'visible');
//     }

//     /**
//      * Hide the tooltip.
//      */
//     public hide(): void {
//         this.selection.text('').style('visibility', 'hidden');
//     }

//     /**
//      * Update the location of the tooltip on the screen.
//      */
//     public move(x: number, y: number): void {
//         this.selection.style('top', y + 'px').style('left', x + 'px');
//     }

// }