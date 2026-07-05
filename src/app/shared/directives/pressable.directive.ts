import { Directive, inject, input, signal } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

@Directive({
  selector: '[appPressable]',
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['message: tooltip'],
    },
  ],
  host: {
    '(pointerdown)': 'press()',
    '(pointerup)': 'release()',
    '(pointerleave)': 'release()',
    '(blur)': 'release()',
    '[class.is-pressed]': 'isPressed()',
  },
})
export class PressableDirective {
  readonly pressedMessage = input.required<string>();
  protected readonly isPressed = signal(false);
  private readonly tooltip = inject(TooltipDirective);

  protected press() {
    this.isPressed.set(true);
    this.tooltip.showMessage(this.pressedMessage());
  }

  protected release() {
    this.isPressed.set(false);
    this.tooltip.clearMessage();
  }
}
