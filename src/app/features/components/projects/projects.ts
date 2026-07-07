import { Component, inject, computed, signal, ElementRef, afterNextRender } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { ProjectCard } from './project-card/project-card';
import { ProjectModal } from './project-modal/project-modal';
import { ProjectItem, CardLayout, FilterKey } from './model/project.model';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  protected readonly projectLayouts = computed(() => {
    const projects = this.filteredProjects();
    const layouts: Record<string, CardLayout> = {};

    for (const project of projects) {
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
        ScrollTrigger.create({
          trigger: host.querySelector('.projects-grid'),
          start: 'top 82%',
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              clearProps: 'filter,transform',
              duration: 1.2,
              ease: 'power3.out',
              stagger: 0.25,
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
        { opacity: 0, y: 100, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clearProps: 'filter,transform',
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.25,
        },
      );
    }, 0);
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
}
