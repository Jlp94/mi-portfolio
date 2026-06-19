import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedBadge } from './badge';

describe('SharedBadge', () => {
  let component: SharedBadge;
  let fixture: ComponentFixture<SharedBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply color class based on input', () => {
    fixture.componentRef.setInput('color', 'emerald');
    fixture.detectChanges();
    const badgeEl = fixture.nativeElement.querySelector('.shared-badge') as HTMLElement;
    expect(badgeEl.classList.contains('badge-emerald')).toBe(true);
  });
});
