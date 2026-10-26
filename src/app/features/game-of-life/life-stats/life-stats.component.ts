import { Component, input } from '@angular/core';
import type { LifeStats } from '../game-of-life-engine';

@Component({
  selector: 'app-life-stats',
  templateUrl: './life-stats.component.html',
  styleUrl: './life-stats.component.css',
})
export class LifeStatsComponent {
  readonly stats = input.required<LifeStats>();
}
