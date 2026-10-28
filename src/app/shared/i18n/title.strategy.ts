import { inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService } from './i18n.service';

// Route titles are translation keys; the I18nService effect applies them and re-applies on language change.
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly i18n = inject(I18nService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.i18n.titleKey.set(this.buildTitle(snapshot) ?? null);
  }
}
