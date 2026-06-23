import { Component, inject, computed, ElementRef, afterNextRender } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SharedSection } from '../../../shared/components/section/section';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about-me',
  imports: [SharedSection],
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

      // Animate the card itself (host element)
      gsap.set(hostElement, {
        opacity: 0,
        filter: 'blur(8px)',
        y: 40
      });

      const hostTl = gsap.timeline({
        scrollTrigger: {
          trigger: hostElement,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 0.5,
        }
      });

      hostTl.to(hostElement, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.3,
        ease: 'none'
      });

      hostTl.to(hostElement, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1
      });

      hostTl.to(hostElement, {
        opacity: 0,
        filter: 'blur(8px)',
        y: -40,
        duration: 0.15,
        ease: 'none'
      });

      const elementsToAnimate = hostElement.querySelectorAll('.about-me-header, .about-me-statement');

      elementsToAnimate.forEach((element: HTMLElement) => {
        gsap.set(element, {
          opacity: 0,
          filter: 'blur(8px)',
          y: 30
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 100%',    
            end: 'bottom 20%',   
            scrub: 0.5,          
          }
        });

        tl.to(element, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.3,
          ease: 'none'
        });

        tl.to(element, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1
        });

        tl.to(element, {
          opacity: 0,
          filter: 'blur(8px)',
          y: -20,
          duration: 0.15,
          ease: 'none'
        });
      });
    });
  }
}
