import { Component, inject } from '@angular/core';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.css',
})
export class ImpressumComponent {
  protected readonly i18n = inject(I18nService);
}
