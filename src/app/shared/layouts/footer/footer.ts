import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-footer',
  imports: [FaIconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly languageService = inject(LanguageService);
  protected readonly faGithub = faGithub;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faEnvelope = faEnvelope;
  protected readonly showTooltip = signal(false);

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  copyEmail(): void {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('jlpcdr94@gmail.com');
      this.showTooltip.set(true);
      setTimeout(() => this.showTooltip.set(false), 2000);
    }
  }
}
