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

  protected readonly expandedCategory = signal<string | null>(null);

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
        'php',
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

  protected toggleCategory(categoryKey: string): void {
    const current = this.expandedCategory();
    if (current === categoryKey) {
      this.closeCategory();
    } else if (current !== null) {
      this.closeCategory(() => {
        this.openCategory(categoryKey);
      });
    } else {
      this.openCategory(categoryKey);
    }
  }

  protected openCategory(categoryKey: string): void {
    const host = this.elementRef.nativeElement;
    const colIndex = this.categories.findIndex((c) => c.key === categoryKey);
    const col = host.querySelector(`.stack-category-col:nth-child(${colIndex + 1})`);
    if (!col) return;

    const labels = col.querySelectorAll('.tech-name-label');

    gsap.to(labels, {
      opacity: 0,
      scale: 0.8,
      y: -5,
      duration: 0.3,
      stagger: 0.015,
      ease: 'power2.in',
      onComplete: () => {
        const selector = [
          '.stack-layout-cols',
          '.stack-category-col',
          `.stack-category-col:nth-child(${colIndex + 1}) .category-card`,
          `.stack-category-col:nth-child(${colIndex + 1}) .icons-area`,
          `.stack-category-col:nth-child(${colIndex + 1}) .tech-wrapper`,
          `.stack-category-col:nth-child(${colIndex + 1}) .tech-symbol-btn`,
        ].join(', ');
        const state = Flip.getState(selector);

        this.expandedCategory.set(categoryKey);
        this.cdr.detectChanges();

        const header = host.querySelector('.stack-header');
        if (header) {
          const headerRect = header.getBoundingClientRect();
          const absoluteHeaderTop = headerRect.top + window.scrollY;
          const offset = window.innerWidth <= 1024 ? 58 : 53;
          window.scrollTo({
            top: absoluteHeaderTop - offset,
          });
        }

        const rightPanel = host.querySelector(`.stack-category-col.expanded .right-details-panel`);
        if (rightPanel) {
          gsap.set(rightPanel, { opacity: 0 });
          const allChars = rightPanel.querySelectorAll('.split-char');
          gsap.set(allChars, { opacity: 0, filter: 'blur(3px)' });
        }

        const tl = gsap.timeline();

        tl.add(
          Flip.from(state, {
            duration: 1.4,
            ease: 'power3.inOut',
            nested: true,
            absolute: '.tech-wrapper',
          })
        );

        if (rightPanel) {
          tl.fromTo(
            rightPanel,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.25,
              clearProps: 'opacity,transform,filter',
            },
            '-=0.3'
          );

          tl.add(() => {
            const lines = rightPanel.querySelectorAll(
              '.main-desc, .details-subtitle, .details-list li',
            );
            lines.forEach((line: Element, index: number) => {
              const chars = line.querySelectorAll('.split-char');
              if (chars.length > 0) {
                gsap.fromTo(
                  chars,
                  { opacity: 0, filter: 'blur(3px)' },
                  {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.3,
                    delay: index * 0.05,
                    stagger: 0.006,
                    ease: 'none',
                    clearProps: 'opacity,filter',
                  },
                );
              }
            });
          }, '-=0.15');
        }
      },
    });
  }

  protected closeCategory(onCompleteCallback?: () => void): void {
    const categoryKey = this.expandedCategory();
    if (!categoryKey) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    const host = this.elementRef.nativeElement;
    const rightPanel = host.querySelector(`.stack-category-col.expanded .right-details-panel`);
    const colIndex = this.categories.findIndex((c) => c.key === categoryKey);
    const col = host.querySelector(`.stack-category-col:nth-child(${colIndex + 1})`);

    const executeClose = () => {
      const selector = [
        '.stack-layout-cols',
        '.stack-category-col',
        `.stack-category-col:nth-child(${colIndex + 1}) .category-card`,
        `.stack-category-col:nth-child(${colIndex + 1}) .icons-area`,
        `.stack-category-col:nth-child(${colIndex + 1}) .tech-wrapper`,
        `.stack-category-col:nth-child(${colIndex + 1}) .tech-symbol-btn`,
      ].join(', ');
      const state = Flip.getState(selector);

      this.expandedCategory.set(null);
      this.cdr.detectChanges();

      const header = host.querySelector('.stack-header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const absoluteHeaderTop = headerRect.top + window.scrollY;
        const offset = window.innerWidth <= 1024 ? 58 : 53;
        window.scrollTo({
          top: absoluteHeaderTop - offset,
        });
      }

      const labels = col ? col.querySelectorAll('.tech-name-label') : null;
      if (labels) {
        gsap.set(labels, { opacity: 0, scale: 0.8, y: -5 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (col) {
            const chars = col.querySelectorAll('.split-char');
            gsap.set(chars, { clearProps: 'all' });
          }
          if (onCompleteCallback) onCompleteCallback();
        },
      });

      tl.add(
        Flip.from(state, {
          duration: 1.2,
          ease: 'power3.inOut',
          nested: true,
          absolute: '.tech-wrapper',
        })
      );

      if (labels) {
        tl.to(
          labels,
          {
            opacity: 0.95,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.01,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.5'
        );
      }
    };

    if (rightPanel) {
      gsap.to(rightPanel, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(rightPanel, { clearProps: 'all' });
          executeClose();
        },
      });
    } else {
      executeClose();
    }
  }

  protected onHoverIcon(event: MouseEvent, isEven: boolean, categoryKey: string): void {
    const wrapper = event.currentTarget as HTMLElement;
    const btn = wrapper.querySelector('.tech-symbol-btn') as HTMLElement;
    if (!btn) return;
    gsap.killTweensOf(btn);
    const isExpanded = this.expandedCategory() === categoryKey;
    const naturalTilt = isExpanded ? 0 : isEven ? -5 : 5;
    gsap
      .timeline()
      .to(btn, { rotate: naturalTilt + 12, duration: 0.15, ease: 'power1.out' })
      .to(btn, { rotate: naturalTilt - 10, duration: 0.15, ease: 'power1.inOut' })
      .to(btn, { rotate: naturalTilt + 6, duration: 0.15, ease: 'power1.inOut' })
      .to(btn, { rotate: naturalTilt, duration: 0.2, ease: 'power1.out' });
  }

  protected onLeaveIcon(event: MouseEvent, isEven: boolean, categoryKey: string): void {
    const wrapper = event.currentTarget as HTMLElement;
    const btn = wrapper.querySelector('.tech-symbol-btn') as HTMLElement;
    if (!btn) return;
    gsap.killTweensOf(btn);
    const isExpanded = this.expandedCategory() === categoryKey;
    const naturalTilt = isExpanded ? 0 : isEven ? -5 : 5;
    gsap.to(btn, {
      rotate: naturalTilt,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}
