import { Component, inject, input } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { PopulationCounts } from '../meadow-engine';

@Component({
  selector: 'app-population-summary',
  templateUrl: './population-summary.component.html',
  styleUrl: './population-summary.component.css',
})
export class PopulationSummaryComponent {
  protected readonly t = inject(I18nService).t;
  readonly populations = input.required<PopulationCounts>();
}
