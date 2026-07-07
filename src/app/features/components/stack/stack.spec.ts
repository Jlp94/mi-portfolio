import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Stack } from './stack';

describe('Stack', () => {
  let component: Stack;
  let fixture: ComponentFixture<Stack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stack],
    }).compileComponents();

    fixture = TestBed.createComponent(Stack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Stack Touch Interactions', () => {
  let component: Stack;
  let fixture: ComponentFixture<Stack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stack],
    }).compileComponents();

    fixture = TestBed.createComponent(Stack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should close the category on tap on the detail panel if not on excluded targets', () => {
    component['activeCategory'].set('frontend');
    fixture.detectChanges();

    const closeSpy = vi.spyOn(
      component as unknown as { closeCategory: (onComplete?: () => void) => void },
      'closeCategory'
    );

    const touchStartEvent = {
      touches: [{ clientX: 100, clientY: 100 }]
    } as unknown as TouchEvent;
    component['onTouchStart'](touchStartEvent);

    const targetElement = document.createElement('div');
    targetElement.className = 'some-non-interactive-area';
    const touchEndEvent = {
      changedTouches: [{ clientX: 100, clientY: 100 }],
      target: targetElement
    } as unknown as TouchEvent;
    
    component['onTouchEnd'](touchEndEvent);

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should NOT close the category if touch delta suggests a scroll gesture', () => {
    component['activeCategory'].set('frontend');
    fixture.detectChanges();

    const closeSpy = vi.spyOn(
      component as unknown as { closeCategory: (onComplete?: () => void) => void },
      'closeCategory'
    );

    const touchStartEvent = {
      touches: [{ clientX: 100, clientY: 100 }]
    } as unknown as TouchEvent;
    component['onTouchStart'](touchStartEvent);

    const targetElement = document.createElement('div');
    const touchEndEvent = {
      changedTouches: [{ clientX: 100, clientY: 200 }], // 100px Y movement
      target: targetElement
    } as unknown as TouchEvent;
    
    component['onTouchEnd'](touchEndEvent);

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should NOT close the category if tap is inside excluded target like detail-content-side', () => {
    component['activeCategory'].set('frontend');
    fixture.detectChanges();

    const closeSpy = vi.spyOn(
      component as unknown as { closeCategory: (onComplete?: () => void) => void },
      'closeCategory'
    );

    const touchStartEvent = {
      touches: [{ clientX: 100, clientY: 100 }]
    } as unknown as TouchEvent;
    component['onTouchStart'](touchStartEvent);

    const excludedElement = document.createElement('div');
    excludedElement.className = 'detail-content-side';
    const touchEndEvent = {
      changedTouches: [{ clientX: 100, clientY: 100 }],
      target: excludedElement
    } as unknown as TouchEvent;
    
    component['onTouchEnd'](touchEndEvent);

    expect(closeSpy).not.toHaveBeenCalled();
  });
});
