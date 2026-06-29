import { Component, signal, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [FaIconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  protected readonly isMenuOpen = signal(false);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = this.languageService.currentLang();
    }
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
