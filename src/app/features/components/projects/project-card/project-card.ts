import { Component, input, output, computed, signal, inject } from '@angular/core';
import { ProjectItem, CardLayout, TECH_KEY_MAP } from '../model/project.model';
import { TechIcon } from '../../../../shared/ui/tech-icon/tech-icon';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-project-card',
  imports: [TechIcon],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input.required<ProjectItem>();
  layout = input<CardLayout>();
  viewLabel = input.required<string>();

  cardOpen = output<ProjectItem>();

  protected isHovered = signal(false);

  private readonly themeService = inject(ThemeService);

  protected readonly ariaLabel = computed(() => `Ver detalles de ${this.project().title}`);

  protected readonly isApiProject = computed(() => {
    const img = this.project().images[0] || '';
    return img.toLowerCase().includes('api');
  });

  protected readonly projectImage = computed(() => {
    const images = this.project().images;
    if (this.project().id === 'portfolio') {
      const theme = this.themeService.currentTheme();
      return theme === 'dark'
        ? 'assets/projects/portfolio/portfolio-light.png'
        : 'assets/projects/portfolio/portfolio-dark.png';
    }
    return images[0];
  });

  protected onOpen(): void {
    this.cardOpen.emit(this.project());
  }

  protected getTechIcon(tech: string): string | null {
    return TECH_KEY_MAP[tech] ?? null;
  }
}
