import { Component, inject, computed, ElementRef, afterNextRender } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SharedSection } from '../../../shared/components/section/section';
import { CodeTag } from '../../../shared/components/code-tag/code-tag';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about-me',
  imports: [SharedSection, CodeTag],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
})
export class AboutMe {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().aboutMe);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return;
      }

      const hostElement = this.elementRef.nativeElement;

      const elementsToAnimate = hostElement.querySelectorAll(
        '.about-me-header, .about-me-statement',
      );

      const isMobile = window.innerWidth <= 1024;

      elementsToAnimate.forEach((element: HTMLElement) => {
        gsap.set(element, {
          opacity: 0,
          filter: 'blur(8px)',
        });

        if (isMobile) {
          gsap.to(element, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
            },
          });
        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: 1,
            },
          });

          tl.to(element, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.15,
            ease: 'none',
          });

          tl.to(element, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.15,
          });

          tl.to(element, {
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.15,
            ease: 'none',
          });
        }
      });
    });
  }
}
