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
      const header = host.querySelector('.stack-header');
      const wrappers = host.querySelectorAll('.tech-wrapper');

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
            },
          });

          tl.to(panels, {
            xPercent: -50,
            ease: 'sine.inOut',
          });

          if (header) {
            gsap.set(header, { opacity: 0, y: 30, filter: 'blur(8px)' });
            gsap.to(header, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: header,
                containerAnimation: tl,
                start: 'left 70%',
              },
            });
          }

          if (wrappers.length > 0) {
            const cols = host.querySelector('.stack-layout-cols');
            gsap.set(wrappers, { opacity: 0, y: 20, filter: 'blur(6px)' });
            gsap.to(wrappers, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.03,
              scrollTrigger: {
                trigger: cols,
                containerAnimation: tl,
                start: 'left 55%',
              },
            });
          }

          return () => {
            tl.kill();
          };
        });

        mm.add('(max-width: 1023px)', () => {
          if (header) {
            gsap.set(header, { opacity: 0, y: 30, filter: 'blur(8px)' });
            gsap.to(header, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: header,
                start: 'top 85%',
              },
            });
          }

          if (wrappers.length > 0) {
            const cols = host.querySelector('.stack-layout-cols');
            gsap.set(wrappers, { opacity: 0, y: 20, filter: 'blur(6px)' });
            gsap.to(wrappers, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.03,
              scrollTrigger: {
                trigger: cols,
                start: 'top 80%',
              },
            });
          }
        });
      }
    });
  }
}
