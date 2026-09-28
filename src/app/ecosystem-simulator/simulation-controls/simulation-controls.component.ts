import { Component, input, output } from '@angular/core';
import type { Species } from '../ecosystem-engine';
import type { PresetName, SimulationSpeed, SpeciesTool } from '../ecosystem-ui.types';

@Component({ selector: 'app-simulation-controls', templateUrl: './simulation-controls.component.html', styleUrl: './simulation-controls.component.css' })
export class SimulationControlsComponent {
  readonly running = input.required<boolean>();
  readonly speed = input.required<SimulationSpeed>();
  readonly selectedTool = input.required<Species>();
  readonly runToggled = output<void>(); readonly stepRequested = output<void>(); readonly resetRequested = output<void>();
  readonly presetSelected = output<PresetName>(); readonly speedSelected = output<SimulationSpeed>(); readonly toolSelected = output<Species>();
  readonly speeds: SimulationSpeed[] = ['slow', 'normal', 'fast'];
  readonly tools: SpeciesTool[] = [{ id:'plant',label:'Plant',mark:'PL' },{ id:'herbivore',label:'Plant eater',mark:'HE' },{ id:'predator',label:'Predator',mark:'PR' },{ id:'empty',label:'Eraser',mark:'ER' }];
}
