import { Directive, ElementRef, inject, afterNextRender, signal, input } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  host: {
    '[class.reveal-visible]': 'isVisible()',
    '[class.reveal-exit-top]': '!isVisible() && animationMode() === "vertical" && exitState() === "top"',
    '[class.reveal-exit-bottom]': '!isVisible() && animationMode() === "vertical" && (exitState() === "bottom" || !exitState())',
    '[class.reveal-exit-left]': '!isVisible() && animationMode() === "horizontal" && exitState() === "left"',
    '[class.reveal-exit-right]': '!isVisible() && animationMode() === "horizontal" && (exitState() === "right" || !exitState())',
    '[class.reveal-exit-zoom]': '!isVisible() && animationMode() === "zoom"',
    'class': 'reveal-element'
  }
})
export class ScrollRevealDirective {
  private readonly elementRef = inject(ElementRef);
  
  // Animation configuration inputs
  threshold = input<number>(0.15);
  animationMode = input<'vertical' | 'horizontal' | 'zoom'>('vertical');
  
  protected readonly isVisible = signal(false);
  protected readonly exitState = signal<'top' | 'bottom' | 'left' | 'right' | null>(null);

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.isVisible.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          const isIntersecting = entry.isIntersecting;
          this.isVisible.set(isIntersecting);

          // If exiting the viewport, determine through which side it left
          if (!isIntersecting && entry.rootBounds) {
            const isHorizontal = this.animationMode() === 'horizontal';
            
            if (isHorizontal) {
              if (entry.boundingClientRect.left < entry.rootBounds.left) {
                this.exitState.set('left');
              } else {
                this.exitState.set('right');
              }
            } else {
              if (entry.boundingClientRect.top < entry.rootBounds.top) {
                this.exitState.set('top');
              } else {
                this.exitState.set('bottom');
              }
            }
          }
        },
        { 
          threshold: this.threshold(),
          rootMargin: '-12% 0px -12% 0px'
        }
      );
      
      observer.observe(this.elementRef.nativeElement);
    });
  }
}
