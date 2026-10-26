import { Component, input } from '@angular/core';

@Component({
  selector: 'app-meadow-lesson',
  templateUrl: './meadow-lesson.component.html',
  styleUrl: './meadow-lesson.component.css',
})
export class MeadowLessonComponent {
  readonly message = input.required<string>();
}
