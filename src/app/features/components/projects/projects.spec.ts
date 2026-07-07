import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projects } from './projects';

describe('Projects', () => {
  let component: Projects;
  let fixture: ComponentFixture<Projects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projects],
    }).compileComponents();

    fixture = TestBed.createComponent(Projects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should position "my-training-app" at index 4 in the filtered projects list when filter is "all"', () => {
    component['activeFilter'].set('all');
    fixture.detectChanges();
    
    const projects = component['filteredProjects']();
    const myTrainingAppIndex = projects.findIndex((p: any) => p.id === 'my-training-app');
    
    expect(myTrainingAppIndex).toBe(4);
  });

  it('should mark "my-training-app" as a large layout (span 2) and others as span 1', () => {
    component['activeFilter'].set('all');
    fixture.detectChanges();

    const layouts = component['projectLayouts']();
    
    expect(layouts['my-training-app']).toEqual({
      gridColumn: 'span 2 / span 2',
      gridRow: 'span 2 / span 2'
    });

    expect(layouts['portfolio']).toEqual({
      gridColumn: 'span 1 / span 1',
      gridRow: 'span 1 / span 1'
    });
  });
});
