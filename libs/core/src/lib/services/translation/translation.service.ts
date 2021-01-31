import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Environment } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private localeId: BehaviorSubject<string>;
  public $locale: Observable<string>;

  private currencyCode: BehaviorSubject<string>;
  public $currency: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>,
    private translateService: TranslateService,
    private environment: Environment
  ) {
    this.localeId = new BehaviorSubject<string>(environment.LOCALE_ID);
    this.$locale = this.localeId.asObservable();

    this.currencyCode = new BehaviorSubject<string>(environment.CURRENCY_CODE);
    this.$currency = this.currencyCode.asObservable();
  }

  /**
   * Get translations from current language file
   * @param key
   * @param params
   */
  public getTranslation(
    key: string | Array<string>,
    params: any = {}
  ): Observable<string | any> {
    return this.translateService.get(key, params).pipe(take(1));
  }

  /**
   * Initialize translations to default
   */
  public async init() {
    // Set the default language for translation strings, and the current language.
    this.translateService.setDefaultLang(this.environment.LOCALE_ID);
    this.setTranslation(this.environment.LOCALE_ID);
  }

  /**
   * Set the app to use the specified language
   * @param code
   */
  public async setTranslation(localeId: string) {
    localStorage.setItem('language', localeId);
    this.localeId.next(localeId);
    this.translateService.use(localeId);
    // Set date adapter for material date pickers
    this.dateAdapter.setLocale(localeId);
  }
}
