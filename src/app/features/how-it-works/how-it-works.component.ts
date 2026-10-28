import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
})
export class HowItWorksComponent {
  protected readonly t = inject(I18nService).t;
}
