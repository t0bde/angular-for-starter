import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameOfLifeComponent } from './game-of-life';

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
      component.paintCell(4, 5);
      expect(component.world().grid[4][5].alive).toBe(true);
      expect(component.activeCell()).toEqual({ row: 4, column: 5 });
      expect(component.cellTabIndex(4, 5)).toBe(0);
      expect(component.cellTabIndex(0, 0)).toBe(-1);

      component.paintCell(4, 5);
      expect(component.world().grid[4][5].alive).toBe(false);
    });

    it('stamps pattern brushes with the expected cell counts', () => {
      component.selectBrush('glider');
      component.paintCell(10, 10);
      expect(component.stats().alive).toBe(5);

      component.clearField();
      component.selectBrush('blinker');
      component.paintCell(10, 10);
      expect(component.stats().alive).toBe(3);

      component.clearField();
      component.selectBrush('acorn');
      component.paintCell(10, 10);
      expect(component.stats().alive).toBe(7);
    });

    it('erases cells with the eraser brush', () => {
      component.paintCell(3, 3);
      component.selectBrush('eraser');
      component.paintCell(3, 3);

      expect(component.world().grid[3][3].alive).toBe(false);
    });

    it('paints a cell when its button is clicked', () => {
      fixture.detectChanges();
      const cell: HTMLButtonElement = fixture.nativeElement.querySelector('#life-cell-2-3');

      cell.click();
      fixture.detectChanges();

      expect(component.world().grid[2][3].alive).toBe(true);
      expect(cell.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('arrow-key focus movement', () => {
    const press = (key: string, row: number, column: number): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', { key, cancelable: true });
      component.moveFocus(event, row, column);
      return event;
    };

    it('moves the active cell in each arrow direction', () => {
      expect(press('ArrowUp', 5, 5).defaultPrevented).toBe(true);
      expect(component.activeCell()).toEqual({ row: 4, column: 5 });

      press('ArrowDown', 5, 5);
      expect(component.activeCell()).toEqual({ row: 6, column: 5 });

      press('ArrowLeft', 5, 5);
      expect(component.activeCell()).toEqual({ row: 5, column: 4 });

      press('ArrowRight', 5, 5);
      expect(component.activeCell()).toEqual({ row: 5, column: 6 });
    });

    it('clamps movement at the grid edges', () => {
      const rows = component.world().grid.length;
      const columns = component.world().grid[0].length;

      press('ArrowUp', 0, 0);
      expect(component.activeCell()).toEqual({ row: 0, column: 0 });

      press('ArrowLeft', 0, 0);
      expect(component.activeCell()).toEqual({ row: 0, column: 0 });

      press('ArrowDown', rows - 1, columns - 1);
      expect(component.activeCell()).toEqual({ row: rows - 1, column: columns - 1 });

      press('ArrowRight', rows - 1, columns - 1);
      expect(component.activeCell()).toEqual({ row: rows - 1, column: columns - 1 });
    });

    it('ignores non-arrow keys without preventing default', () => {
      const before = component.activeCell();

      expect(press('a', 5, 5).defaultPrevented).toBe(false);
      expect(component.activeCell()).toEqual(before);
    });

    it('moves DOM focus to the newly active cell', async () => {
      fixture.detectChanges();
      document.body.appendChild(fixture.nativeElement);
      const from: HTMLButtonElement = fixture.nativeElement.querySelector('#life-cell-5-5');

      from.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();
      await Promise.resolve();

      expect(document.activeElement?.id).toBe('life-cell-5-6');
      fixture.nativeElement.remove();
    });
  });
});

