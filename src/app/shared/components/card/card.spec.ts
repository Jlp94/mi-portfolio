import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCard } from './card';

describe('SharedCard', () => {
  let component: SharedCard;
  let fixture: ComponentFixture<SharedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply glow class based on input', () => {
    fixture.componentRef.setInput('glowColor', 'violet');
    fixture.detectChanges();
    const cardEl = fixture.nativeElement.querySelector('.shared-card') as HTMLElement;
    expect(cardEl.classList.contains('glow-violet')).toBe(true);
  });
});
