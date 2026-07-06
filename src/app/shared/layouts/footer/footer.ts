import { Component, inject, computed } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { CopyButtonDirective } from '../../directives/copy-button.directive';
import { PressableDirective } from '../../directives/pressable.directive';

@Component({
  selector: 'app-footer',
  imports: [FaIconComponent, CopyButtonDirective, PressableDirective],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly languageService = inject(LanguageService);
  protected readonly faGithub = faGithub;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faEnvelope = faEnvelope;
  protected readonly t = computed(() => this.languageService.translations().footer);

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
