import { Component, inject, computed, ElementRef, afterNextRender } from '@angular/core';
import { AboutMe } from '../about-me/about-me';
import { Stack } from '../stack/stack';
import { LanguageService } from '../../../core/services/language.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGauge, faLaptop, faLightbulb, faRocket } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-stack',
  imports: [AboutMe, Stack, FaIconComponent],
  templateUrl: './about-stack.html',
  styleUrl: './about-stack.css',
})
export class AboutStack {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().aboutMe);
  private readonly elementRef = inject(ElementRef);

  protected readonly faGauge = faGauge;
  protected readonly faLaptop = faLaptop;
  protected readonly faLightbulb = faLightbulb;
  protected readonly faRocket = faRocket;

  constructor() {
    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement as HTMLElement;

      const headerTitle = host.querySelector('.section-header-centered h2');
      const headerLine = host.querySelector('.section-header-centered .section-line');
      if (headerTitle && headerLine) {
        gsap.set(headerTitle, { opacity: 0, x: 200 });
        gsap.set(headerLine, { scaleX: 0, transformOrigin: 'right center' });
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: host.querySelector('.section-header-centered'),
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: 0.2,
        });

        tl.to(headerTitle, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power2.out',
        })
        .to(headerLine, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.8');
      }

      const bullets = host.querySelectorAll('.bullet-wrap');
      if (bullets.length > 0) {
        gsap.set(bullets, { 
          opacity: 0, 
          rotationY: -180, 
          transformPerspective: 1000 
        });
        gsap.to(bullets, {
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          stagger: 0.35,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: host.querySelector('.bullets-container'),
            start: 'top 85%',
          },
        });
      }

      const leftColumn = host.querySelector('.about-stack-left');
      if (leftColumn) {
        gsap.set(leftColumn, { opacity: 0, x: -160, filter: 'blur(12px)' });
        gsap.to(leftColumn, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.out',
          clearProps: 'transform,filter',
          scrollTrigger: {
            trigger: leftColumn,
            start: 'top 88%',
          },
        });
      }

      const rightColumn = host.querySelector('.about-stack-right');
      if (rightColumn) {
        gsap.set(rightColumn, { opacity: 0, x: 160, filter: 'blur(12px)' });
        gsap.to(rightColumn, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.out',
          clearProps: 'transform,filter',
          scrollTrigger: {
            trigger: rightColumn,
            start: 'top 88%',
          },
        });
      }
    });
  }
}
