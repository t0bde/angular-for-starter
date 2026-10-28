import { Component, inject, input } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-life-lesson',
  templateUrl: './life-lesson.component.html',
  styleUrl: './life-lesson.component.css',
})
export class LifeLessonComponent {
  protected readonly t = inject(I18nService).t;
  readonly message = input.required<string>();
}
