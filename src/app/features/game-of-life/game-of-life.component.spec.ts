import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameOfLifeComponent } from './game-of-life.component';

describe('GameOfLifeComponent', () => {
  let component: GameOfLifeComponent;
  let fixture: ComponentFixture<GameOfLifeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOfLifeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOfLifeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create with the Acorn starter seed planted', () => {
    expect(component).toBeTruthy();
    expect(component.activePreset()).toBe('acorn');
    expect(component.stats().alive).toBe(7);
  });

  it('advances one generation when Step is clicked', () => {
    fixture.detectChanges();
    expect(component.world().generation).toBe(0);

    component.step();
    fixture.detectChanges();

    expect(component.world().generation).toBe(1);
  });

  it('switches starter seeds and resets generation to 0', () => {
    component.step();
    expect(component.world().generation).toBe(1);

    component.selectPreset('r-pentomino');
    expect(component.world().generation).toBe(0);
    expect(component.stats().alive).toBe(5);
  });

  it('stops running automatically when the field is cleared', () => {
    component.toggleRunning();
    expect(component.running()).toBe(true);

    component.clearField();
    expect(component.running()).toBe(false);
    expect(component.stats().alive).toBe(0);
  });

  describe('wrap-around borders', () => {
    it('toggles wrapEdges and keeps it across replant and clear', () => {
      expect(component.world().wrapEdges).toBe(true);

      component.toggleWrapEdges();
      expect(component.world().wrapEdges).toBe(false);

      component.reset();
      expect(component.world().wrapEdges).toBe(false);

      component.clearField();
      expect(component.world().wrapEdges).toBe(false);

      component.toggleWrapEdges();
      expect(component.world().wrapEdges).toBe(true);
    });

    it('toggles when the checkbox changes', () => {
      fixture.detectChanges();
      const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('.wrap-toggle input');

      checkbox.click();
      fixture.detectChanges();

      expect(component.world().wrapEdges).toBe(false);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('brush placement', () => {
    beforeEach(() => component.clearField());

    it('toggles a single cell and updates the active cell', () => {
      component.paintCell({ row: 4, column: 5 });
      expect(component.world().grid[4][5].alive).toBe(true);
      expect(component.activeCell()).toEqual({ row: 4, column: 5 });

      component.paintCell({ row: 4, column: 5 });
      expect(component.world().grid[4][5].alive).toBe(false);
    });

    it('stamps pattern brushes with the expected cell counts', () => {
      component.selectBrush('glider');
      component.paintCell({ row: 10, column: 10 });
      expect(component.stats().alive).toBe(5);

      component.clearField();
      component.selectBrush('blinker');
      component.paintCell({ row: 10, column: 10 });
      expect(component.stats().alive).toBe(3);

      component.clearField();
      component.selectBrush('acorn');
      component.paintCell({ row: 10, column: 10 });
      expect(component.stats().alive).toBe(7);
    });

    it('erases cells with the eraser brush', () => {
      component.paintCell({ row: 3, column: 3 });
      component.selectBrush('eraser');
      component.paintCell({ row: 3, column: 3 });

      expect(component.world().grid[3][3].alive).toBe(false);
    });

    it('paints a cell when its button is clicked', () => {
      fixture.detectChanges();
      const cell: HTMLButtonElement = fixture.nativeElement.querySelector('#life-cell-2-3');

      cell.click();
      fixture.detectChanges();

      expect(component.world().grid[2][3].alive).toBe(true);
      expect(component.activeCell()).toEqual({ row: 2, column: 3 });
      expect(cell.getAttribute('aria-pressed')).toBe('true');
    });

    it('selects a brush from the controls panel', () => {
      fixture.detectChanges();
      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('.tool-list button'),
      );

      buttons.find((button) => button.textContent?.includes('Glider'))?.click();

      expect(component.selectedBrush()).toBe('glider');
    });
  });

  describe('arrow-key focus movement', () => {
    it('moves DOM focus and the active cell to the neighbouring cell', async () => {
      fixture.detectChanges();
      document.body.appendChild(fixture.nativeElement);
      const from: HTMLButtonElement = fixture.nativeElement.querySelector('#life-cell-5-5');

      from.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();
      await Promise.resolve();

      expect(component.activeCell()).toEqual({ row: 5, column: 6 });
      expect(document.activeElement?.id).toBe('life-cell-5-6');
      fixture.nativeElement.remove();
    });
  });
});

