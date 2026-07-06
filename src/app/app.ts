import { Component, signal, AfterViewInit, HostListener, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';

const SCROLL_KEY = 'portfolio_scroll_y';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('mi-portfolio');

  private readonly document = inject(DOCUMENT);
  private scrollThrottle: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved !== null) {
      const y = parseInt(saved, 10);
      if (y === 0) return;

      const html = this.document.documentElement;

      html.style.setProperty('scroll-behavior', 'auto');

      setTimeout(() => {
        this.document.defaultView?.scrollTo(0, y);

        setTimeout(() => {
          html.style.removeProperty('scroll-behavior');
        }, 100);
      }, 300);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.scrollThrottle) return;
    this.scrollThrottle = setTimeout(() => {
      const y = this.document.defaultView?.scrollY ?? 0;
      sessionStorage.setItem(SCROLL_KEY, String(y));
      this.scrollThrottle = null;
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.scrollThrottle) clearTimeout(this.scrollThrottle);
  }
}
