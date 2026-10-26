import { Component, input } from '@angular/core';

@Component({
  selector: 'app-life-lesson',
  templateUrl: './life-lesson.component.html',
  styleUrl: './life-lesson.component.css',
})
export class LifeLessonComponent {
  readonly message = input.required<string>();
}
