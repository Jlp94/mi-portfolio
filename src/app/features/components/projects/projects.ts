import {
  Component,
  inject,
  computed,
  signal,
  ElementRef,
  afterNextRender,
  HostListener,
} from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { ProjectCard } from './project-card/project-card';
import { ProjectItem, CardLayout, FilterKey } from './model/project.model';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LAYOUTS: CardLayout[][] = [
  [
    { gridColumn: 'span 2 / span 2', gridRow: 'span 2 / span 2' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
  ],
  [
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 2 / span 2', gridRow: 'span 2 / span 2' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
  ],
  [
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 2 / span 2', gridRow: 'span 2 / span 2' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
  ],
  [
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 2 / span 2', gridRow: 'span 2 / span 2' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
    { gridColumn: 'span 1 / span 1', gridRow: 'span 1 / span 1' },
  ],
];

@Component({
  selector: 'app-projects',
  imports: [ProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().projects);
  private readonly elementRef = inject(ElementRef);

  protected readonly activeFilter = signal<FilterKey>('all');
  protected readonly activeModal = signal<ProjectItem | null>(null);
  protected readonly activeSlide = signal(0);
  protected readonly activeLayout = signal<CardLayout[]>(LAYOUTS[0]);

  protected readonly filterKeys: FilterKey[] = ['all', 'angular', 'spring', 'nest', 'php'];

  protected readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const items = this.t().items as unknown as ProjectItem[];
    if (filter === 'all') return items;
    return items.filter((p) => p.tags.includes(filter));
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
      const randomIndex = Math.floor(Math.random() * LAYOUTS.length);
      this.activeLayout.set(LAYOUTS[randomIndex]);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const host = this.elementRef.nativeElement as HTMLElement;

      const header = host.querySelector('.section-header');
      const breadcrumb = host.querySelector('.projects-breadcrumb');
      const cards = host.querySelectorAll('.project-card');

      if (header) {
        gsap.set(header, { opacity: 0, y: 30, filter: 'blur(8px)' });
        gsap.to(header, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: header, start: 'top 85%' },
        });
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
        gsap.set(cards, { opacity: 0, y: 50, filter: 'blur(6px)' });
        ScrollTrigger.create({
          trigger: host.querySelector('.projects-grid'),
          start: 'top 82%',
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 0.65,
              ease: 'power2.out',
              stagger: 0.1,
            });
          },
        });
      }
    });
  }

  protected setFilter(key: FilterKey): void {
    if (this.activeFilter() === key) return;
    this.activeFilter.set(key);

    setTimeout(() => {
      const host = this.elementRef.nativeElement as HTMLElement;
      const cards = host.querySelectorAll('.project-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.06,
        },
      );
    }, 0);
  }

  protected openModal(project: ProjectItem): void {
    this.activeSlide.set(0);
    this.activeModal.set(project);
    document.body.style.overflow = 'hidden';
  }

  protected closeModal(): void {
    this.activeModal.set(null);
    document.body.style.overflow = '';
  }

  protected onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  protected nextSlide(): void {
    const project = this.activeModal();
    if (!project) return;
    this.activeSlide.update((s) => (s + 1) % project.images.length);
  }

  protected prevSlide(): void {
    const project = this.activeModal();
    if (!project) return;
    this.activeSlide.update((s) => (s - 1 + project.images.length) % project.images.length);
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    if (this.activeModal()) this.closeModal();
  }

  protected getFilterLabel(key: FilterKey): string {
    return this.t().filters[key];
  }

  protected trackById(_: number, item: ProjectItem): string {
    return item.id;
  }
}
