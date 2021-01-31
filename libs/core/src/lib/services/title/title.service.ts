import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterService } from '../router/router.service';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(
    private meta: Meta,
    private routerService: RouterService,
    private title: Title,
    private translationService: TranslationService
  ) {}

  public init(): void {
    this.routerService.$route.subscribe((route: string) => {
      if (route) {
        this.setRouteTitle(route.split('?')[0]);
      }
    });
  }

  /**
   * Get the translation for the current route then set the page title
   * @param route
   */
  private setRouteTitle(route: string): void {
    route = `TITLES${route
      .split('/')
      .join('.')
      .toUpperCase()}`;
    this.translationService.getTranslation(route).subscribe((title: string) => {
      if (title === route) {
        this.setTitle('Blip', 'Self-Serve Digital Billboards On Any Budget');
      } else {
        this.setTitle(title);
      }
    });
  }

  /**
   * Set the page title
   * @param title
   */
  public setTitle(title: string, meta: string = ''): void {
    setTimeout(() => {
      this.meta.addTag({ name: 'description', content: meta });
      this.title.setTitle(title);
    });
  }
}
