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
      if (prefersReducedMotion) {
        return;
      }

      const hostElement = this.elementRef.nativeElement;

      gsap.set(hostElement, {
        opacity: 0,
        filter: 'blur(8px)',
      });

      gsap.to(hostElement, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: hostElement,
          start: 'top 95%',
        },
      });
    });
  }
}
