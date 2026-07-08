import { TestBed } from '@angular/core/testing';
import { ImagePreloadService } from './image-preload.service';
import { vi } from 'vitest';

describe('ImagePreloadService', () => {
  let service: ImagePreloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImagePreloadService]
    });
    service = TestBed.inject(ImagePreloadService);

    vi.stubGlobal('Image', class {
      private _src = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      get src() {
        return this._src;
      }

      set src(value: string) {
        this._src = value;
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should enqueue and report loaded state after completion', async () => {
    service.enqueue(['assets/test1.png', 'assets/test2.png']);

    expect(service.isLoaded('assets/test1.png')).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(service.isLoaded('assets/test1.png')).toBe(true);
    expect(service.isLoaded('assets/test2.png')).toBe(true);
  });

  it('should limit concurrency to 2 active loads', async () => {
    const activeLoads = service['activeLoads'];
    const loadSpy = vi.spyOn(service as unknown as { loadOne: (url: string) => void }, 'loadOne');

    service.enqueue(['assets/test1.png', 'assets/test2.png', 'assets/test3.png']);

    expect(loadSpy).toHaveBeenCalledTimes(2);
    expect(activeLoads.size).toBe(2);

    await new Promise((resolve) => setTimeout(resolve, 5));

    expect(loadSpy).toHaveBeenCalledTimes(3);
  });

  it('should respect high priority queueing', () => {
    const queue = service['queue'];

    service.enqueue(['low1.png', 'low2.png'], 'low');

    service.enqueue(['high1.png'], 'high');

    expect(queue[0]).toBe('high1.png');
  });
});
