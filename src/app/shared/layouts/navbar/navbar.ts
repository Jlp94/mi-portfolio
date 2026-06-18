import { Component, signal, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  host: {
    '(window:scroll)': 'onWindowScroll()'
  },
  imports: [FaIconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
  protected readonly themeService = inject(ThemeService);
  protected readonly isMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);

  protected onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 50);
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
}
