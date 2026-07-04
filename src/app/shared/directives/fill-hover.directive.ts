import { Directive, ElementRef, Renderer2, HostListener, inject, DestroyRef } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appFillHover]',
})
export class FillHoverDirective {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;
  private bgEl!: HTMLElement;

  constructor() {
    this.bgEl = this.renderer.createElement('span');
    this.renderer.addClass(this.bgEl, 'fill-hover-bg');
    this.renderer.appendChild(this.el, this.bgEl);

    this.destroyRef.onDestroy(() => gsap.killTweensOf(this.bgEl));
  }

  @HostListener('mouseenter', ['$event'])
  protected onEnter(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;
    this.animate(event, 1, 'power2.out', 1);
  }

  @HostListener('mouseleave', ['$event'])
  protected onLeave(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;
    this.animate(event, 0, 'power2.inOut', 0.8);
  }

  private animate(event: MouseEvent, scale: number, ease: string, duration: number): void {
    const rect = this.el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    gsap.killTweensOf(this.bgEl);
    gsap.to(this.bgEl, { left: `${x}px`, top: `${y}px`, scale, duration, ease });
  }
}
