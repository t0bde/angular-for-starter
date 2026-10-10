import { Component } from '@angular/core';
import { EcosystemSimulatorComponent } from './ecosystem-simulator/ecosystem-simulator';

@Component({
  imports: [EcosystemSimulatorComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
