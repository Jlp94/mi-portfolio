import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme value', () => {
    const initialTheme = service.currentTheme();
    service.toggleTheme();
    const nextTheme = service.currentTheme();
    expect(nextTheme).not.toBe(initialTheme);
  });
});
