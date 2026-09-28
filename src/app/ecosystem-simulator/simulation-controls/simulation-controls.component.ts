import { Component, input, output } from '@angular/core';
import type { Species } from '../ecosystem-engine';
import { speciesImages, type BehaviorSettings, type PresetName, type SimulationSpeed, type SpeciesTool } from '../ecosystem-ui.types';

@Component({ selector: 'app-simulation-controls', templateUrl: './simulation-controls.component.html', styleUrl: './simulation-controls.component.css' })
export class SimulationControlsComponent {
  readonly running = input.required<boolean>();
  readonly speed = input.required<SimulationSpeed>();
  readonly selectedTool = input.required<Species>();
  readonly behaviorSettings = input.required<BehaviorSettings>();
  readonly runToggled = output<void>(); readonly stepRequested = output<void>(); readonly resetRequested = output<void>();
  readonly presetSelected = output<PresetName>(); readonly speedSelected = output<SimulationSpeed>(); readonly toolSelected = output<Species>();
  readonly behaviorSettingChanged = output<Partial<BehaviorSettings>>();
  readonly speeds: SimulationSpeed[] = ['slow', 'normal', 'fast'];
  readonly tools: SpeciesTool[] = [{ id:'plant',label:'Plant',mark:'PL' },{ id:'herbivore',label:'Plant eater',mark:'HE' },{ id:'predator',label:'Predator',mark:'PR' },{ id:'empty',label:'Eraser',mark:'ER' }];
  toolImage(tool: SpeciesTool): string | null { return speciesImages[tool.id] ?? null; }
  changeBehavior(key: keyof BehaviorSettings, value: string): void { this.behaviorSettingChanged.emit({ [key]: Number(value) }); }
  asPercent(value: number): string { return `${Math.round(value * 100)}%`; }
}
