import { Component, input } from '@angular/core';

@Component({ selector: 'app-ecosystem-lesson', templateUrl: './ecosystem-lesson.component.html', styleUrl: './ecosystem-lesson.component.css' })
export class EcosystemLessonComponent { readonly message = input.required<string>(); }
