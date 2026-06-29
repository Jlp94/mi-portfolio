import { Component, ElementRef, inject, afterNextRender } from '@angular/core';
import { AboutMe } from '../about-me/about-me';
import { Stack } from '../stack/stack';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about-stack',
  imports: [AboutMe, Stack],
  templateUrl: './about-stack.html',
  styleUrl: './about-stack.css',
})
export class AboutStack {
  private readonly elementRef = inject(ElementRef);

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement;
      const panels = host.querySelector('.about-stack-panels');

      if (panels) {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: host,
              pin: true,
              scrub: 1,
              start: 'center center',
              end: () => `+=${host.offsetWidth * 0.95}`,
              invalidateOnRefresh: true,
            }
          });

          tl.to(panels, {
            xPercent: -50,
            ease: 'sine.inOut',
          });

          return () => {
            tl.kill();
          };
        });
      }
    });
  }
}
