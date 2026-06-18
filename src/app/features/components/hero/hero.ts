import { Component, signal, computed } from '@angular/core';

import { ScrollBadge } from '../../../shared/components/scroll-badge/scroll-badge';

@Component({
  selector: 'app-hero',
  host: {
    '(window:mousemove)': 'onMouseMove($event)',
  },
  imports: [ScrollBadge],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly mouseX = signal(0);
  private readonly mouseY = signal(0);

  protected readonly blobStyles = computed(() => {
    const x = this.mouseX();
    const y = this.mouseY();
    return {
      one: { transform: `translate(${x * 160}px, ${y * 160}px)` },
      two: { transform: `translate(${-x * 130}px, ${-y * 130}px)` },
      three: { transform: `translate(${x * 100}px, ${-y * 100}px)` },
      four: { transform: `translate(${-x * 110}px, ${y * 110}px)` },
      five: { transform: `translate(${x * 90}px, ${y * 90}px)` },
    };
  });

  protected onMouseMove(event: MouseEvent): void {
    if (typeof window !== 'undefined') {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      this.mouseX.set(x);
      this.mouseY.set(y);
    }
  }
}
