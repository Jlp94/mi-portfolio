import { Component, ElementRef, inject, input, output, viewChild, DestroyRef } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-button-fill-1',
  imports: [],
  templateUrl: './button-fill-1.html',
  styleUrl: './button-fill-1.css',
})
export class ButtonFill1 {
  variant = input<'primary' | 'ghost'>('primary');
  disabled = input(false);
  loading = input(false);
  clicked = output<void>();
  type = input<'button' | 'submit'>('button');

  private readonly hoverBg = viewChild.required<ElementRef<HTMLElement>>('hoverBg');
  private readonly destroyRef = inject(DestroyRef);
  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  constructor() {
    this.destroyRef.onDestroy(() => {
      gsap.killTweensOf(this.hoverBg().nativeElement);
    });
  }

  protected onMouseEnter(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;

    const { x, y } = this.getRelativePosition(event);
    const bg = this.hoverBg().nativeElement;

    gsap.killTweensOf(bg);
    gsap.fromTo(
      bg,
      { left: `${x}px`, top: `${y}px`, scale: 0 },
      { scale: 1, duration: 1, ease: 'power2.out' },
    );
  }

  protected onMouseLeave(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;

    const { x, y } = this.getRelativePosition(event);
    const bg = this.hoverBg().nativeElement;

    gsap.killTweensOf(bg);
    gsap.to(bg, {
      left: `${x}px`,
      top: `${y}px`,
      scale: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }

  private getRelativePosition(event: MouseEvent): { x: number; y: number } {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
