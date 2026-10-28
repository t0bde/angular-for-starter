import { Component, inject, input } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-meadow-lesson',
  templateUrl: './meadow-lesson.component.html',
  styleUrl: './meadow-lesson.component.css',
})
export class MeadowLessonComponent {
  protected readonly t = inject(I18nService).t;
  readonly message = input.required<string>();
}
