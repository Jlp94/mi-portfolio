import { Component, inject, computed } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { CodeTag } from '../../../shared/components/code-tag/code-tag';
import { TechIcon } from '../stack/tech-icon';

@Component({
  selector: 'app-education',
  imports: [CodeTag, TechIcon],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  private readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().education);
}
