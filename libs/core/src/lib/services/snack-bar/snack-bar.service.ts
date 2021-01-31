import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslationService } from '../translation/translation.service';

export interface SnackBarMessage {
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  public snackBarMessage$: Subject<SnackBarMessage> = new Subject();

  constructor(private translationService: TranslationService) {}

  public open(message: string, duration: number = 4000): void {
    this.snackBarMessage$.next({ message, duration });
  }

  /**
   * Get a translation and show a snack bar for the translation
   * @param translation The key from the translation file
   * @param params A key value object for translation params
   */
  public async openTranslation(
    translation: string,
    subtranslation?: { key: string; translation: string }
  ) {
    const params = {};
    if (subtranslation) {
      await this.translationService
        .getTranslation(subtranslation.translation)
        .subscribe(async (subtext: string) => {
          params[subtranslation.key] = subtext;
        });
    }

    this.translationService
      .getTranslation(translation, params)
      .subscribe((text: string) => {
        this.open(text);
      });
  }
}
