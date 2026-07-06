import { Directive, inject, input } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

@Directive({
  selector: '[appCopyButton]',
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['message: tooltip'],
    },
  ],
  host: {
    '(click)': 'copy()',
    'class': 'is-copy-tooltip',
  },
})
export class CopyButtonDirective {
  readonly copyText = input.required<string>();
  readonly copiedMessage = input.required<string>();
  readonly copyFailedMessage = input.required<string>();
  readonly copiedDuration = input(2000);

  private readonly tooltip = inject(TooltipDirective);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.copyText());
      this.tooltip.showTemporaryMessage(this.copiedMessage(), this.copiedDuration());
    } catch {
      this.tooltip.showTemporaryMessage(this.copyFailedMessage(), this.copiedDuration());
    }
  }
}
