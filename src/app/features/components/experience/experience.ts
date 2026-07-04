import { Component, inject, computed, signal, ElementRef, afterNextRender } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { TechIcon } from '../stack/tech-icon';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  imports: [TechIcon, FaIconComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  private readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().experience);
  private readonly elementRef = inject(ElementRef);

  protected readonly faAngleDown = faAngleDown;
  protected readonly faAngleUp = faAngleUp;

  protected readonly expandedCard = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement;

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

      const cards = host.querySelectorAll('.timeline-card');
      gsap.set(cards, { opacity: 0, y: 25, filter: 'blur(6px)' });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        clearProps: 'filter',
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: host, start: 'top 85%' },
      });
    });
  }

  protected toggleCard(cardKey: string): void {
    this.expandedCard.update((current) => (current === cardKey ? null : cardKey));
  }
}
