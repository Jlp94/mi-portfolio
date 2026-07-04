import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
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
export class Navbar implements OnInit, OnDestroy {
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  
  protected readonly isMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);
  protected readonly isHidden = signal(false);

  private lastScrollTop = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = this.languageService.currentLang();
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  private handleScroll = (): void => {
    if (this.isMenuOpen()) {
      return;
    }
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const scrolledThreshold = scrollTop >= (heroHeight - 80);
    this.isScrolled.set(scrolledThreshold);

    if (scrolledThreshold) {
      this.isHidden.set(false);
    } else {
      if (scrollTop > this.lastScrollTop && scrollTop > 50) {
        this.isHidden.set(true);
      } else {
        this.isHidden.set(false);
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

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
