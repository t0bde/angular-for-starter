import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from '../../app';
import { routes } from '../../app.routes';
import { ImpressumComponent } from './impressum.component';

describe('Impressum', () => {
  it('shows the provider name and contact email', async () => {
    await TestBed.configureTestingModule({ imports: [ImpressumComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ImpressumComponent);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Tobias Deutscher');
    expect(text).toContain('info@letsdothings.org');
  });

  it('is linked from the footer of every page', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('.footer-link');
    expect(link?.getAttribute('href')).toBe('/impressum');
  });
});
