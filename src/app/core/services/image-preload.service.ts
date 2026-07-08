import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImagePreloadService {
  private readonly loadedUrls = signal<Set<string>>(new Set());
  private readonly queue: string[] = [];
  private readonly activeLoads = new Map<string, HTMLImageElement>();
  private readonly maxConcurrent = 2;
  private inFlight = 0;

  readonly isLoaded = (url: string): boolean => this.loadedUrls().has(url);

  enqueue(urls: string[], priority: 'high' | 'low' = 'low'): void {
    const newUrls = urls.filter(
      (u) => !this.loadedUrls().has(u) && !this.queue.includes(u) && !this.activeLoads.has(u)
    );
    if (priority === 'high') {
      this.queue.unshift(...newUrls);
    } else {
      this.queue.push(...newUrls);
    }
    this.processQueue();
  }

  private processQueue(): void {
    while (this.inFlight < this.maxConcurrent && this.queue.length > 0) {
      const url = this.queue.shift()!;
      this.loadOne(url);
    }
  }

  private loadOne(url: string): void {
    this.inFlight++;
    const img = new Image();
    (img as unknown as { fetchPriority: string }).fetchPriority = 'low';
    this.activeLoads.set(url, img);

    img.onload = img.onerror = () => {
      this.inFlight--;
      this.activeLoads.delete(url);
      this.loadedUrls.update((set) => {
        const next = new Set(set);
        next.add(url);
        return next;
      });
      this.processQueue();
    };

    img.src = url;
  }
}
