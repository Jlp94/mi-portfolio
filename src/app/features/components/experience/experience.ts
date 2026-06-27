import { Component, inject, computed } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { CodeTag } from '../../../shared/components/code-tag/code-tag';
import { TechIcon } from '../stack/tech-icon';

@Component({
  selector: 'app-experience',
  imports: [CodeTag, TechIcon],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  private readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().experience);
}
