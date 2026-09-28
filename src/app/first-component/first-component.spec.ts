import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstComponent } from './first-component';

describe('FirstComponent', () => {
  let component: FirstComponent;
  let fixture: ComponentFixture<FirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the ecosystem controls and can advance one day', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const initialTick = component.world().tick;
    compiled.querySelector<HTMLButtonElement>('[aria-label="Advance one day"]')?.click();
    expect(compiled.querySelector('h1')?.textContent).toContain('Meadow Makers');
    expect(component.world().tick).toBe(initialTick + 1);
  });
});
