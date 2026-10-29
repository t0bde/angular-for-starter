import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../shared/i18n/i18n.service';
import type { TranslationKey } from '../../shared/i18n/en';

export type MiniCellState =
  | 'empty'
  | 'neighbor'
  | 'sprout'
  | 'flora'
  | 'perennial'
  | 'center-target'
  | 'center-dead'
  | 'center-sprout'
  | 'center-flora'
  | 'center-perennial'
  | 'center-withered';

export interface RuleDiagramCard {
  id: 'birth' | 'survival' | 'death';
  badge: string;
  tagKey: TranslationKey;
  textKey: TranslationKey;
  before: MiniCellState[];
  after: MiniCellState[];
}

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
})
export class HowItWorksComponent {
  protected readonly t = inject(I18nService).t;

  /** 3x3 Moore neighborhood diagram: 8 surrounding cells around the center cell. */
  protected readonly neighborGrid: MiniCellState[] = [
    'flora',
    'neighbor',
    'sprout',
    'neighbor',
    'center-target',
    'neighbor',
    'neighbor',
    'flora',
    'neighbor',
  ];

  /** 3x7 mini-grid preview of the 7-cell Acorn Methuselah starter seed. */
  protected readonly acornPreview: boolean[] = [
    false, true, false, false, false, false, false,
    false, false, false, true, false, false, false,
    true, true, false, false, true, true, true,
  ];

  /** 3x3 mini-grid preview of a 5-cell Glider brush stamp. */
  protected readonly gliderPreview: boolean[] = [
    false, true, false,
    false, false, true,
    true, true, true,
  ];

  /** 3x3 Before -> After diagrams for Conway's B3/S23 transitions. */
  protected readonly ruleCards: RuleDiagramCard[] = [
    {
      id: 'birth',
      badge: 'B3',
      tagKey: 'howItWorks.diagramBirthTag',
      textKey: 'howItWorks.algoBirth',
      before: [
        'flora',
        'empty',
        'flora',
        'empty',
        'center-dead',
        'empty',
        'empty',
        'flora',
        'empty',
      ],
      after: [
        'flora',
        'empty',
        'flora',
        'empty',
        'center-sprout',
        'empty',
        'empty',
        'flora',
        'empty',
      ],
    },
    {
      id: 'survival',
      badge: 'S23',
      tagKey: 'howItWorks.diagramSurvivalTag',
      textKey: 'howItWorks.algoSurvival',
      before: [
        'flora',
        'empty',
        'empty',
        'empty',
        'center-flora',
        'flora',
        'empty',
        'empty',
        'empty',
      ],
      after: [
        'flora',
        'empty',
        'empty',
        'empty',
        'center-perennial',
        'flora',
        'empty',
        'empty',
        'empty',
      ],
    },
    {
      id: 'death',
      badge: '<2 · >3',
      tagKey: 'howItWorks.diagramDeathTag',
      textKey: 'howItWorks.algoDeath',
      before: [
        'flora',
        'flora',
        'empty',
        'flora',
        'center-flora',
        'flora',
        'empty',
        'empty',
        'empty',
      ],
      after: [
        'flora',
        'flora',
        'empty',
        'flora',
        'center-withered',
        'flora',
        'empty',
        'empty',
        'empty',
      ],
    },
  ];
}
