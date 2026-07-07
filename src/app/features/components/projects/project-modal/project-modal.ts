import { Component, inject, computed, signal, HostListener, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ProjectItem } from '../model/project.model';
import { TechIcon } from '../../../../shared/ui/tech-icon/tech-icon';
import { ButtonFill1 } from '../../../../shared/components/button-fill-1/button-fill-1';

@Component({
  selector: 'app-project-modal',
  imports: [TechIcon, ButtonFill1],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.css',
})
export class ProjectModal {
  protected readonly languageService = inject(LanguageService);
  protected readonly themeService = inject(ThemeService);
  protected readonly t = computed(() => this.languageService.translations().projects);

  project = input.required<ProjectItem>();
  close = output<void>();

  protected readonly activeSlide = signal(0);
  protected readonly isApiProject = computed(() => {
    const img = this.project().images[0] || '';

    return img.toLowerCase().includes('api');
  });

  protected readonly projectImages = computed(() => {
    const images = this.project().images;

    if (this.project().id === 'portfolio') {
      const theme = this.themeService.currentTheme();
      return theme === 'dark'
        ? [
            'assets/projects/portfolio/portfolio-light.png',
            'assets/projects/portfolio/portfolio-dark.png',
          ]
        : [
            'assets/projects/portfolio/portfolio-dark.png',
            'assets/projects/portfolio/portfolio-light.png',
          ];
    }
    return images;
  });

  protected readonly isZoomed = signal(false);

  protected onClose(): void {
    this.close.emit();
  }

  protected onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    if (this.isZoomed()) {
      this.isZoomed.set(false);
    } else {
      this.onClose();
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeyboardEvent(event: KeyboardEvent): void {
    const images = this.projectImages();

    if (images.length <= 1) return;

    if (event.key === 'ArrowRight') {
      this.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }

  protected nextSlide(): void {
    const images = this.projectImages();

    this.activeSlide.update((s) => (s + 1) % images.length);
  }

  protected prevSlide(): void {
    const images = this.projectImages();

    this.activeSlide.update((s) => (s - 1 + images.length) % images.length);
  }

  protected openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
