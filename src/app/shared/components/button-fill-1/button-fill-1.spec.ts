import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonFill1 } from './button-fill-1';

describe('ButtonFill1', () => {
  let component: ButtonFill1;
  let fixture: ComponentFixture<ButtonFill1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonFill1],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonFill1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
