import { Component, inject, computed, signal, ElementRef, afterNextRender } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { TechIcon } from '../stack/tech-icon';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-education',
  imports: [TechIcon, FaIconComponent],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  private readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().education);
  private readonly elementRef = inject(ElementRef);

  protected readonly faAngleDown = faAngleDown;
  protected readonly faAngleUp = faAngleUp;

  protected readonly expandedCard = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement;

      const header = host.querySelector('.section-header');
      if (header) {
        gsap.set(header, { opacity: 0, y: 30, filter: 'blur(8px)' });
        gsap.to(header, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: header, start: 'top 90%' },
        });
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
