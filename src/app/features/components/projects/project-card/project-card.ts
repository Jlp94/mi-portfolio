import { Component, input, output, computed, signal } from '@angular/core';
import { ProjectItem, CardLayout, TECH_KEY_MAP } from '../model/project.model';
import { TechIcon } from '../../stack/tech-icon';

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

  protected readonly ariaLabel = computed(() => `Ver detalles de ${this.project().title}`);

  protected onOpen(): void {
    this.cardOpen.emit(this.project());
  }

  protected getTechIcon(tech: string): string | null {
    return TECH_KEY_MAP[tech] ?? null;
  }
}
