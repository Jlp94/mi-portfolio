import { Component, inject, computed, signal, HostListener, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { ProjectItem } from '../model/project.model';
import { TechIcon } from '../../stack/tech-icon';
import { ButtonFill1 } from '../../../../shared/components/button-fill-1/button-fill-1';

@Component({
  selector: 'app-project-modal',
  imports: [TechIcon, ButtonFill1],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.css',
})
export class ProjectModal {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().projects);

  project = input.required<ProjectItem>();
  close = output<void>();

  protected readonly activeSlide = signal(0);

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
    this.onClose();
  }

  protected nextSlide(): void {
    const images = this.project().images;
    this.activeSlide.update((s) => (s + 1) % images.length);
  }

  protected prevSlide(): void {
    const images = this.project().images;
    this.activeSlide.update((s) => (s - 1 + images.length) % images.length);
  }

  protected openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
