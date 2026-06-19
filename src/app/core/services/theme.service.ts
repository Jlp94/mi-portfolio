import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSignal = signal<'light' | 'dark'>('light');
  readonly currentTheme = this.themeSignal.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('portfolio-theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        this.themeSignal.set(storedTheme);
      } else {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.themeSignal.set(systemPrefersDark ? 'dark' : 'light');
      }

      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('portfolio-theme')) {
            this.themeSignal.set(e.matches ? 'dark' : 'light');
          }
        });
      }
    }

    effect(() => {
      const theme = this.themeSignal();
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem('portfolio-theme', theme);
      }
    });
  }

  toggleTheme(): void {
    this.themeSignal.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}
