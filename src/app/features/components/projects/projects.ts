import { Component, inject, computed, signal, ElementRef, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { ImagePreloadService } from '../../../core/services/image-preload.service';
import { ProjectCard } from './project-card/project-card';
import { ProjectModal } from './project-modal/project-modal';
import { ProjectItem, CardLayout, FilterKey } from './model/project.model';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

@Component({
  selector: 'app-projects',
  imports: [ProjectCard, ProjectModal],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().projects);
  private readonly elementRef = inject(ElementRef);
  private readonly imagePreload = inject(ImagePreloadService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly activeFilter = signal<FilterKey>('all');
  protected readonly activeModal = signal<ProjectItem | null>(null);

  protected readonly filterKeys: FilterKey[] = ['all', 'angular', 'spring', 'nest', 'php'];

  protected readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const items = this.t().items as unknown as ProjectItem[];
    const filtered = filter === 'all' 
      ? items 
      : items.filter((p) => p.tags.includes(filter));

    const clientIdx = filtered.findIndex((p) => p.id === 'my-training-app');
    if (clientIdx !== -1 && filtered.length > 4) {
      const result = [...filtered];
      const [clientProject] = result.splice(clientIdx, 1);
      result.splice(4, 0, clientProject);
      return result;
    }

    return filtered;
  });

  protected readonly orderedProjects = computed(() => {
    const items = this.t().items as unknown as ProjectItem[];

    // Always return all items in the same fixed order.
    // Reordering based on activeFilter caused Angular to physically move DOM nodes,
    // producing a visual flicker. Visibility is controlled by the is-hidden class instead.
    const clientIdx = items.findIndex((p) => p.id === 'my-training-app');
    if (clientIdx !== -1 && items.length > 4) {
      const result = [...items];
      const [clientProject] = result.splice(clientIdx, 1);
      result.splice(4, 0, clientProject);
      return result;
    }

    return items;
  });

  protected isProjectActive(project: ProjectItem): boolean {
    const filter = this.activeFilter();
    return filter === 'all' || project.tags.includes(filter);
  }

  protected readonly projectLayouts = computed(() => {
    const items = this.t().items as unknown as ProjectItem[];
    const layouts: Record<string, CardLayout> = {};

    for (const project of items) {
      if (project.id === 'my-training-app') {
        layouts[project.id] = { gridColumn: 'span 2 / span 2', gridRow: 'span 2 / span 2' };
      } else {
        layouts[project.id] = { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' };
      }
    }

    return layouts;
  });

  protected readonly projectCount = computed(() => {
    const items = this.t().items as unknown as ProjectItem[];
    const counts: Record<string, number> = { all: items.length };
    for (const key of ['angular', 'spring', 'nest', 'php'] as const) {
      counts[key] = items.filter((p) => p.tags.includes(key)).length;
    }
    return counts;
  });

  constructor() {
    afterNextRender(() => {
      if (typeof window !== 'undefined') {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(() => this.preloadProjectImages(), { timeout: 2000 });
        } else {
          setTimeout(() => this.preloadProjectImages(), 1000);
        }
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement as HTMLElement;

      const headerTitle = host.querySelector('.section-header-centered h2');
      const headerLine = host.querySelector('.section-header-centered .section-line');
      const breadcrumb = host.querySelector('.projects-breadcrumb');
      const cards = host.querySelectorAll('.project-card');

      if (headerTitle && headerLine) {
        gsap.set(headerTitle, { opacity: 0, x: -200 });
        gsap.set(headerLine, { scaleX: 0, transformOrigin: 'left center' });

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
        }).to(
          headerLine,
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.8',
        );
      }

      if (breadcrumb) {
        gsap.set(breadcrumb, { opacity: 0, y: 20 });
        gsap.to(breadcrumb, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: breadcrumb, start: 'top 88%' },
          delay: 0.15,
        });
      }

      if (cards.length > 0) {
        gsap.set(cards, { opacity: 0, y: 100, filter: 'blur(6px)' });
        const trigger = ScrollTrigger.create({
          id: 'cards-trigger',
          trigger: host.querySelector('.projects-grid'),
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter,transform,opacity',
              duration: 1.2,
              ease: 'power3.out',
              stagger: 0.25,
              onComplete: () => {
                trigger.kill();
              }
            });
          },
        });
      }
    });
  }

  protected setFilter(key: FilterKey): void {
    if (this.activeFilter() === key) return;

    const host = this.elementRef.nativeElement as HTMLElement;
    const container = host.querySelector('.projects-grid') as HTMLElement;

    if (!container) return;

    // Kill any active scroll entrance tweens on the cards
    const cards = host.querySelectorAll('.project-card');
    gsap.killTweensOf(cards);

    // Kill ScrollTrigger if it exists and reset cards to visible
    const activeTrigger = ScrollTrigger.getById('cards-trigger');
    if (activeTrigger) {
      activeTrigger.kill();
      gsap.set(cards, { clearProps: 'opacity,transform,filter' });
    }

    // Get currently visible card elements before the filter change
    const currentCards = Array.from(
      host.querySelectorAll('app-project-card:not(.is-hidden) .project-card')
    ) as HTMLElement[];

    const leavingCards: HTMLElement[] = [];
    const remainingCards: HTMLElement[] = [];

    // Classify which cards are leaving and which ones are remaining
    currentCards.forEach((card) => {
      const hostCard = card.closest('app-project-card') as HTMLElement;
      if (hostCard) {
        const tags = hostCard.getAttribute('data-tags')?.split(',') ?? [];
        if (key === 'all' || tags.includes(key)) {
          remainingCards.push(card);
        } else {
          leavingCards.push(card);
        }
      }
    });

    if (leavingCards.length > 0) {
      // Phase 1: Animate leaving cards out (shrink and fade)
      gsap.to(leavingCards, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Defer style clearing to Phase 2 after the DOM updates
          this.runTransitionPhase2(key, host, container, remainingCards, leavingCards);
        },
      });
    } else {
      // No cards leaving, transition directly to Phase 2
      this.runTransitionPhase2(key, host, container, remainingCards);
    }
  }

  private runTransitionPhase2(
    key: FilterKey,
    host: HTMLElement,
    container: HTMLElement,
    remainingCards: HTMLElement[],
    leavingCards?: HTMLElement[]
  ): void {
    // 1. Capture container height before updating DOM
    const startHeight = container.offsetHeight;

    // 2. Lock container height and apply overflow hidden to prevent collapse/jump
    container.style.height = `${startHeight}px`;
    container.style.overflow = 'hidden';

    // 3. Capture layout state of remaining cards before they glide
    const state = Flip.getState(remainingCards);

    // 4. Update active filter signal
    this.activeFilter.set(key);

    // 5. Force Angular to synchronously update the DOM
    this.cdr.detectChanges();

    // 5.5. Clear leaving cards' inline styles now that they are hidden by CSS
    if (leavingCards && leavingCards.length > 0) {
      gsap.set(leavingCards, { clearProps: 'transform,opacity' });
    }

    // 6. Query cards that are visible after the DOM update
    const visibleCardsAfter = host.querySelectorAll('app-project-card:not(.is-hidden) .project-card');

    // 7. Measure new auto height of container and lock it back to startHeight
    container.style.height = 'auto';
    const endHeight = container.offsetHeight;
    container.style.height = `${startHeight}px`;

    // 8. Smoothly animate container height
    gsap.killTweensOf(container);
    gsap.fromTo(container,
      { height: startHeight },
      {
        height: endHeight,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          container.style.height = '';
          container.style.overflow = '';
          ScrollTrigger.refresh();
        }
      }
    );

    // 9. Run Flip layout transition with absolute positioning and grow entering cards
    Flip.from(state, {
      targets: visibleCardsAfter,
      duration: 0.5,
      ease: 'power2.inOut',
      absolute: true,
      nested: true,
      onEnter: (elements) => gsap.fromTo(elements,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        }
      ),
    });
  }

  protected openModal(project: ProjectItem): void {
    this.activeModal.set(project);
    document.body.style.overflow = 'hidden';
  }

  protected closeModal(): void {
    this.activeModal.set(null);
    document.body.style.overflow = '';
  }

  protected getFilterLabel(key: FilterKey): string {
    return this.t().filters[key];
  }

  protected trackById(_: number, item: ProjectItem): string {
    return item.id;
  }

  private preloadProjectImages(): void {
    const items = this.t().items as unknown as ProjectItem[];
    if (!items) return;

    const urls = items.flatMap((p) => [
      ...(p.cardImage ? [p.cardImage] : []),
      ...(p.images ?? []),
    ]);

    this.imagePreload.enqueue(urls, 'low');
  }
}
