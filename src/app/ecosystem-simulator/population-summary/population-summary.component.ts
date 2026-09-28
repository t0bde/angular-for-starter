import { Component, input } from '@angular/core';
import type { PopulationCounts } from '../ecosystem-engine';

@Component({ selector: 'app-population-summary', templateUrl: './population-summary.component.html', styleUrl: './population-summary.component.css' })
export class PopulationSummaryComponent { readonly populations = input.required<PopulationCounts>(); }
