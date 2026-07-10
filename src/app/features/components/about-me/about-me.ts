import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-about-me',
  imports: [],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMe {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().aboutMe);
}
