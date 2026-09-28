import { Component } from '@angular/core';
import { FirstComponent } from './first-component/first-component';

@Component({
  imports: [FirstComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
