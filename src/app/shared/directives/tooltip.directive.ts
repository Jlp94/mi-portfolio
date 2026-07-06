import { computed, DestroyRef, Directive, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    class: 'has-tooltip',
    '[attr.aria-label]': 'visibleMessage()',
    '[attr.data-tooltip]': 'visibleMessage()',
    '[class.show-tooltip]': 'showingTemporaryMessage()',
  },
})
export class TooltipDirective {
  readonly message = input.required<string>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly temporaryMessage = signal<string | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimeout());
  }

  protected readonly showingTemporaryMessage = computed(() => {
    return this.temporaryMessage() !== null;
  });

  protected readonly visibleMessage = computed(() => {
    return this.temporaryMessage() ?? this.message();
  });

  showMessage(message: string): void {
    this.clearTimeout();
    this.temporaryMessage.set(message);
  }

  clearMessage(): void {
    this.clearTimeout();
    this.temporaryMessage.set(null);
  }

  showTemporaryMessage(message: string, duration = 1200): void {
    this.showMessage(message);

    this.timeoutId = setTimeout(() => {
      this.temporaryMessage.set(null);
      this.timeoutId = null;
    }, duration);
  }

  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
