import { afterEveryRender, Component, computed, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { CellInspection } from '../meadow-ui.types';
import { speciesImages } from '../meadow-ui.types';

// Width must match cell-info-popover.component.css; height is measured after render.
const cardWidth = 200;
const estimatedCardHeight = 150;
const gap = 10;
const edge = 8;

@Component({
  selector: 'app-cell-info-popover',
  templateUrl: './cell-info-popover.component.html',
  styleUrl: './cell-info-popover.component.css',
  host: {
    '(document:keydown.escape)': 'dismissed.emit()',
    '(document:pointerdown)': 'onDocumentPointerDown()',
    '(window:scroll)': 'dismissed.emit()',
    '(window:resize)': 'dismissed.emit()',
  },
})
export class CellInfoPopoverComponent {
  protected readonly t = inject(I18nService).t;
  readonly info = input.required<CellInspection>();
  readonly dismissed = output<void>();
  private readonly card = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly cardHeight = signal(estimatedCardHeight);

  constructor() {
    afterEveryRender(() => this.cardHeight.set(this.card().nativeElement.offsetHeight));
  }

  protected readonly image = computed(() => speciesImages[this.info().cell.species] ?? null);

  // Sits beside the cell and flips to the other side when it would leave the viewport.
  protected readonly left = computed(() => {
    const { anchor } = this.info();
    const fitsRight = anchor.right + gap + cardWidth <= window.innerWidth;
    return fitsRight ? anchor.right + gap : Math.max(edge, anchor.left - gap - cardWidth);
  });

  protected readonly top = computed(() => {
    const { anchor } = this.info();
    return Math.min(Math.max(edge, anchor.top), window.innerHeight - this.cardHeight() - edge);
  });

  protected onDocumentPointerDown(): void {
    if (this.info().pinned) {
      this.dismissed.emit();
    }
  }
}
