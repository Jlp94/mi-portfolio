import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedSection } from './section';

describe('SharedSection', () => {
  let component: SharedSection;
  let fixture: ComponentFixture<SharedSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSection],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedSection);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'test-id');
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and subtitle', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Test Title');
    expect(compiled.querySelector('span.tracking-widest')?.textContent).toContain('Test Subtitle');
  });
});
