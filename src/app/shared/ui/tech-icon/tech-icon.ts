import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tech-icon',
  template: `
    <svg [class]="customClass()" xmlns="http://www.w3.org/2000/svg">
      <use [attr.href]="'svg/tech-sprite.svg#icon-' + key()" />
    </svg>
  `,
})
export class TechIcon {
  key = input.required<string>();
  customClass = input<string>('w-full h-full');
}
