import {
  Component,
  inject,
  computed,
  ElementRef,
  afterNextRender,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SharedSection } from '../../../shared/components/section/section';
import { TechIcon } from './tech-icon';
import { CodeTag } from '../../../shared/components/code-tag/code-tag';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

@Component({
  selector: 'app-stack',
  imports: [SharedSection, TechIcon, CodeTag, FaIconComponent],
  templateUrl: './stack.html',
  styleUrl: './stack.css',
})
export class Stack {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().stacks);
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly faAngleDown = faAngleDown;
  protected readonly faAngleUp = faAngleUp;

  protected readonly activeCategory = signal<string | null>(null);
  private activeTl: gsap.core.Timeline | null = null;

  protected readonly categories = [
    {
      key: 'frontend',
      techs: [
        'angular',
        'typescript',
        'rxjs',
        'javascript',
        'html',
        'css',
        'scss',
        'bootstrap',
        'tailwind',
        'primeng',
        'swiper',
        'gsap',
      ],
    },
    {
      key: 'backend',
      techs: [
        'spring',
        'springboot',
        'java',
        'jwt',
        'mongodb',
        'postgres',
        'mysql',
        'rabbitmq',
        'kafka',
      ],
    },
    {
      key: 'tools',
      techs: ['git', 'github', 'docker', 'azure', 'vercel', 'render', 'aws', 'kubernetes'],
    },
  ];

  constructor() {
    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement;

      const header = host.querySelector('.stack-header');
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

      const wrappers = host.querySelectorAll('.tech-wrapper');
      gsap.set(wrappers, { opacity: 0, y: 20, filter: 'blur(6px)' });
      gsap.to(wrappers, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        clearProps: 'filter',
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.03,
        scrollTrigger: { trigger: host.querySelector('.stack-layout-cols'), start: 'top 85%' },
      });
    });
  }

  protected getCategoryTitle(key: string): string {
    const translations = this.t();
    if (key === 'frontend') return translations.frontend;
    if (key === 'backend') return translations.backend;
    if (key === 'tools') return translations.tools;
    return key;
  }

  protected getTechName(key: string): string {
    const techs = this.t().technologies as unknown as Record<string, string>;
    return techs[key] || key;
  }

  protected getCategoryDesc(key: string): string {
    const translations = this.t() as unknown as Record<string, string>;
    if (key === 'frontend') return translations['frontendDesc'] || '';
    if (key === 'backend') return translations['backendDesc'] || '';
    if (key === 'tools') return translations['toolsDesc'] || '';
    return '';
  }

  protected getSplitTechDesc(key: string): string {
    return this.getSplitText(this.getCategoryDesc(key));
  }

  protected getSplitText(text: string): string {
    return text
      .split(' ')
      .map((word) => {
        if (!word) return '';
        const chars = word
          .split('')
          .map((char) => `<span class="split-char" style="display: inline-block;">${char}</span>`)
          .join('');
        return `<span class="split-word" style="display: inline-block; white-space: nowrap;">${chars}</span>`;
      })
      .join(' ');
  }

  protected hasExtraDetails(key: string): boolean {
    return key === 'frontend' || key === 'backend' || key === 'tools';
  }

  protected getFirstBlockTitle(): string {
    const translations = this.t() as unknown as Record<string, string>;
    return translations['ecosystemTitle'] || 'Ecosistema:';
  }

  protected getSecondBlockTitle(key: string): string {
    const translations = this.t() as unknown as Record<string, string>;
    if (key === 'frontend') {
      return translations['librariesTitle'] || 'Librerías:';
    }
    if (key === 'backend' || key === 'tools') {
      return (translations['learningTitle'] || 'Aprendiendo') + ':';
    }
    return '';
  }

  protected getEcosystem(key: string): readonly string[] {
    const translations = this.t() as unknown as Record<string, readonly string[]>;
    return translations[`${key}Ecosystem`] || [];
  }

  protected getSecondBlockItems(key: string): readonly string[] {
    const translations = this.t() as unknown as Record<string, readonly string[]>;
    if (key === 'frontend') {
      return translations['frontendLibraries'] || [];
    }
    if (key === 'backend') {
      return translations['backendLearning'] || [];
    }
    if (key === 'tools') {
      return translations['toolsLearning'] || [];
    }
    return [];
  }

  protected getCategoryTechs(key: string): string[] {
    const cat = this.categories.find(c => c.key === key);
    return cat ? cat.techs : [];
  }

  protected toggleCategory(catKey: string): void {
    const current = this.activeCategory();
    
    if (current === catKey) {
      this.closeCategory();
      return;
    }
    
    if (current !== null) {
      this.closeCategory(() => this.openCategory(catKey));
      return;
    }
    
    this.openCategory(catKey);
  }

  protected openCategory(catKey: string): void {
    this.activeTl?.kill();

    const state = Flip.getState(`[data-flip-id="${catKey}"]`);

    this.activeCategory.set(catKey);
    this.cdr.detectChanges();

    this.activeTl = gsap.timeline();

    const host = this.elementRef.nativeElement as HTMLElement;
    const cols = host.querySelectorAll('.stack-category-col');
    
    cols.forEach((c: Element) => {
      if (!c.querySelector(`[data-flip-id="${catKey}"]`)) {
        this.activeTl!.to(c, { opacity: 0.3, duration: 0.4, ease: 'power2.inOut' }, 0);
      }
    });

    const detailPanel = host.querySelector('.detail-panel');
    const originCard = host.querySelector(`.stack-category-col [data-flip-id="${catKey}"]`);

    if (originCard && detailPanel) {
      this.activeTl.to(originCard, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0);

      this.activeTl.add(
        Flip.from(state, {
          targets: detailPanel,
          duration: 0.8,
          ease: 'power3.inOut',
        }),
        0
      );

      const wrapper = host.querySelector('.detail-content-wrapper');
      if (wrapper) {
        this.activeTl.fromTo(
          wrapper,
          { yPercent: 15, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.4
        );

        const lines = wrapper.querySelectorAll(
          '.main-desc, .details-subtitle, .details-list li, .details-inline-text'
        );
        lines.forEach((line: Element, index: number) => {
          const chars = line.querySelectorAll('.split-char');
          if (chars.length > 0) {
            this.activeTl!.fromTo(
              chars,
              { opacity: 0, filter: 'blur(3px)' },
              {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.3,
                delay: index * 0.04,
                stagger: 0.005,
                ease: 'none',
                clearProps: 'opacity,filter',
              },
              0.5
            );
          }
        });
      }
    }
  }

  protected closeCategory(onCompleteCallback?: () => void): void {
    const categoryKey = this.activeCategory();
    if (!categoryKey) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    this.activeTl?.kill();

    const host = this.elementRef.nativeElement;
    const detailPanel = host.querySelector('.detail-panel');
    const originCard = host.querySelector(`.stack-category-col [data-flip-id="${categoryKey}"]`);

    this.activeTl = gsap.timeline({
      onComplete: () => {
        this.activeCategory.set(null);
        this.cdr.detectChanges();
        if (originCard) gsap.set(originCard, { clearProps: 'opacity' });
        if (onCompleteCallback) onCompleteCallback();
      }
    });

    if (detailPanel && originCard) {
      const backdrop = host.querySelector('.global-backdrop');
      if (backdrop) {
        this.activeTl.to(backdrop, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0);
      }

      const wrapper = detailPanel.querySelector('.detail-content-wrapper');
      if (wrapper) {
        this.activeTl.to(
          wrapper,
          { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.out' },
          0
        );
      }

      const state = Flip.getState(detailPanel);

      Flip.fit(detailPanel, originCard, { absolute: true });

      this.activeTl.add(
        Flip.from(state, {
          targets: detailPanel,
          duration: 0.8,
          ease: 'power3.inOut',
          absolute: true
        }),
        0
      );

      this.activeTl.to(originCard, { opacity: 1, duration: 0.4, ease: 'power2.inOut', clearProps: 'opacity' }, 0.4);
      this.activeTl.to(detailPanel, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.4);

      const cols = host.querySelectorAll('.stack-category-col');
      this.activeTl.to(cols, { opacity: 1, duration: 0.4, ease: 'power2.inOut', clearProps: 'opacity' }, 0.2);
    } else {
      this.activeCategory.set(null);
      this.cdr.detectChanges();
      if (onCompleteCallback) onCompleteCallback();
    }
  }

  protected onHoverIcon(event: MouseEvent, isEven: boolean): void {
    const wrapper = event.currentTarget as HTMLElement;
    const btn = wrapper.querySelector('.tech-symbol-btn') as HTMLElement;
    if (!btn) return;
    gsap.killTweensOf(btn);
    const naturalTilt = isEven ? -5 : 5;
    gsap
      .timeline()
      .to(btn, { rotate: naturalTilt + 12, duration: 0.15, ease: 'power1.out' })
      .to(btn, { rotate: naturalTilt - 10, duration: 0.15, ease: 'power1.inOut' })
      .to(btn, { rotate: naturalTilt + 6, duration: 0.15, ease: 'power1.inOut' })
      .to(btn, { rotate: naturalTilt, duration: 0.2, ease: 'power1.out' });
  }

  protected onLeaveIcon(event: MouseEvent, isEven: boolean): void {
    const wrapper = event.currentTarget as HTMLElement;
    const btn = wrapper.querySelector('.tech-symbol-btn') as HTMLElement;
    if (!btn) return;
    gsap.killTweensOf(btn);
    const naturalTilt = isEven ? -5 : 5;
    gsap.to(btn, {
      rotate: naturalTilt,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}
