import { Component, inject, input } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { LifeStats } from '../game-of-life-engine';

@Component({
  selector: 'app-life-stats',
  templateUrl: './life-stats.component.html',
  styleUrl: './life-stats.component.css',
})
export class LifeStatsComponent {
  protected readonly t = inject(I18nService).t;
  readonly stats = input.required<LifeStats>();
}
