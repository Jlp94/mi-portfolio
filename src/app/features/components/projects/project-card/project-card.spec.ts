import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCard } from './project-card';
import { ThemeService } from '../../../../core/services/theme.service';
import { signal } from '@angular/core';

describe('ProjectCard', () => {
  let component: ProjectCard;
  let fixture: ComponentFixture<ProjectCard>;
  let mockThemeService: any;

  const mockProject = {
    id: 'my-training-app',
    title: 'My Training - Client App',
    description: 'Description',
    tags: ['angular'],
    techs: ['Angular'],
    images: ['assets/projects/my-training-app/image15.jpg'],
    cardImage: 'assets/projects/my-training-app/portada.png',
    repoUrl: 'https://github.com/Jlp94/my-training',
  };

  const mockApiProject = {
    id: 'my-training-api',
    title: 'My Training API',
    description: 'Description',
    tags: ['nest'],
    techs: ['NestJS'],
    images: ['assets/projects/api.webp'],
    repoUrl: 'https://github.com/Jlp94/api-my-training',
  };

  const mockPortfolioProject = {
    id: 'portfolio',
    title: 'Portfolio v1',
    description: 'Description',
    tags: ['angular'],
    techs: ['Angular'],
    images: ['assets/projects/portfolio/portfolio-light.png'],
    repoUrl: 'https://github.com/Jlp94/mi-portfolio',
  };

  beforeEach(async () => {
    mockThemeService = {
      currentTheme: signal('light'),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCard],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('project', mockProject);
    fixture.componentRef.setInput('viewLabel', 'Ver proyecto');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return cardImage if defined', () => {
    fixture.componentRef.setInput('project', mockProject);
    fixture.componentRef.setInput('viewLabel', 'Ver proyecto');
    fixture.detectChanges();
    expect(component['projectImage']()).toBe('assets/projects/my-training-app/portada.png');
  });

  it('should return first image if cardImage is not defined', () => {
    fixture.componentRef.setInput('project', mockApiProject);
    fixture.componentRef.setInput('viewLabel', 'Ver proyecto');
    fixture.detectChanges();
    expect(component['projectImage']()).toBe('assets/projects/api.webp');
  });

  it('should return light portfolio image in dark theme and dark portfolio image in light theme', () => {
    fixture.componentRef.setInput('project', mockPortfolioProject);
    fixture.componentRef.setInput('viewLabel', 'Ver proyecto');
    
    // Test light theme
    mockThemeService.currentTheme.set('light');
    fixture.detectChanges();
    expect(component['projectImage']()).toBe('assets/projects/portfolio/portfolio-dark.png');

    // Test dark theme
    mockThemeService.currentTheme.set('dark');
    fixture.detectChanges();
    expect(component['projectImage']()).toBe('assets/projects/portfolio/portfolio-light.png');
  });
});
