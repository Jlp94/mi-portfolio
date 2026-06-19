import { Component, inject, computed } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SharedSection } from '../../../shared/components/section/section';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-me',
  imports: [SharedSection, ScrollRevealDirective],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
})
export class AboutMe {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().aboutMe);
}
