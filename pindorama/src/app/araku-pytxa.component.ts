import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-araku-pytxa',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="-96 -96 192 192"
      role="img"
      aria-label="Araku Pytxã">
      <g [attr.stroke]="color"
         fill="none"
         stroke-linecap="butt"
         stroke-linejoin="miter"
         [attr.stroke-width]="strokeWidth">
        <!-- TOP -->
        <line x1="0" y1="-72" x2="0" y2="-48"/>
        <polyline points="-8,-48  0,-40  8,-48"/>
        <polyline points="-16,-48 0,-32 16,-48"/>
        <polyline points="-24,-48 0,-24 24,-48"/>
        <polyline points="-32,-48 0,-16 32,-48"/>
        <!-- RIGHT -->
        <line x1="72" y1="0" x2="48" y2="0"/>
        <polyline points="48,-8  40,0  48,8"/>
        <polyline points="48,-16 32,0 48,16"/>
        <polyline points="48,-24 24,0 48,24"/>
        <polyline points="48,-32 16,0 48,32"/>
        <!-- BOTTOM -->
        <line x1="0" y1="72" x2="0" y2="48"/>
        <polyline points="-8,48  0,40  8,48"/>
        <polyline points="-16,48 0,32 16,48"/>
        <polyline points="-24,48 0,24 24,48"/>
        <polyline points="-32,48 0,16 32,48"/>
        <!-- LEFT -->
        <line x1="-72" y1="0" x2="-48" y2="0"/>
        <polyline points="-48,-8  -40,0  -48,8"/>
        <polyline points="-48,-16 -32,0 -48,16"/>
        <polyline points="-48,-24 -24,0 -48,24"/>
        <polyline points="-48,-32 -16,0 -48,32"/>
      </g>
    </svg>
  `
})
export class ArakuPytxaComponent {
  @Input() size = 24;
  @Input() color = 'currentColor';

  get strokeWidth() {
    if (this.size <= 16) return 14;
    if (this.size <= 24) return 12;
    if (this.size <= 32) return 10;
    return 8;
  }
}
