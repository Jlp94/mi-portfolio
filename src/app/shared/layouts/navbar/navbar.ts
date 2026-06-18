import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  host: {
    '(window:scroll)': 'onWindowScroll()'
  },
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);
  protected readonly isVisible = signal(false);

  protected onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isVisible.set(window.scrollY > window.innerHeight * 0.7);
    }
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
