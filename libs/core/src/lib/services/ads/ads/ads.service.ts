import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { AdApiService } from '../../../api/ad-api/ad-api.service';
import { Ad, Resolution } from '../../../models';
import { LoadingService } from '../../loading/loading.service';
import { SnackBarService } from '../../snack-bar/snack-bar.service';
import { TranslationService } from '../../translation/translation.service';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private ads = new BehaviorSubject<Ad[]>([]);
  private adDetail = new ReplaySubject<Ad>(1);
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private subscriptions: Subscription = new Subscription();
  private translations = { ad: '', ads: '', adImage: '' };

  public ads$: Observable<Ad[]> = this.ads.asObservable();
  public adDetail$: Observable<Ad> = this.adDetail.asObservable();
  public adsLoaded$: Observable<boolean> = this.loaded.asObservable();

  constructor(
    private adApiService: AdApiService,
    private loadingService: LoadingService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private userService: UserService
  ) {
    this.translationService
      .getTranslation(['AD', 'ADS.TEXT', 'AD_IMAGE'])
      .subscribe((text: Array<string>) => {
        this.translations.ad = text['AD'].toLowerCase();
        this.translations.ads = text['ADS.TEXT'].toLowerCase();
        this.translations.adImage = text['AD_IMAGE'].toLowerCase();
      });

    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe(() => {
        //this.reset();
      })
    );
  }

  /**
   * Create a new Ad
   * @param ad
   */
  public createAd(ad: Ad): Promise<Ad> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.adApiService
        .save(ad, this.userService.organization.id)
        .toPromise()
        .then((newAd: Ad) => {
          const newAds = [...this.ads.value, newAd];
          this.ads.next(newAds);
          resolve(newAd);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.SAVING', { type: this.translations.ad })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          reject(err);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  /**
   * Get all ads
   */
  public getAds(force: boolean = false): void {
    this.loaded.next(false);
    if (!this.ads.value.length || force) {
      this.loadingService.setLoading(true);
      this.adApiService
        .organizationAds(this.userService.organization.id)
        .toPromise()
        .then((ads: Array<Ad>) => {
          this.ads.next(ads);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.LOADING', { type: this.translations.ads })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loaded.next(true);
          this.loadingService.setLoading(false);
        });
    } else {
      this.loaded.next(true);
      this.ads.next(this.ads.value);
    }
  }

  /**
   * Delete an Ad
   * @param deleteAd
   */
  public deleteAd(deleteAd: Ad): Promise<boolean> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.adApiService
        .delete(deleteAd.id)
        .toPromise()
        .then(() => {
          const newAds = this.ads.value.filter((ad: Ad) => {
            return ad.id !== deleteAd.id;
          });
          this.ads.next(newAds);
          this.translationService
            .getTranslation('SUCCESS.DELETING', { type: this.translations.ad })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(true);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.DELETING', { type: this.translations.ad })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(false);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public deleteImage(imageId: string, ad?: Ad): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.adApiService
        .deleteImage(imageId)
        .toPromise()
        .then(() => {
          if (ad) {
            let height, width;
            ad.images.forEach((img: any, index: number) => {
              if (img.id === imageId) {
                height = img.height;
                width = img.width;
                ad.images.splice(index, 1);
                return;
              }
            });
            ad.resolutions.forEach((res: Resolution, index: number) => {
              if (res.height === height && res.width === width) {
                ad.resolutions.splice(index, 1);
              }
            });
            const newAds = [...this.ads.value];
            newAds.forEach((curAd: Ad, index: number) => {
              if (curAd.id === ad.id) {
                newAds.splice(index, 1, ad);
                return;
              }
            });
            this.ads.next(newAds);
            this.translationService
              .getTranslation('SUCCESS.DELETING', {
                type: this.translations.adImage,
              })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            resolve(ad);
          }
          resolve();
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.DELETING', {
              type: this.translations.adImage,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          reject();
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public reset() {
    console.log('CALLING RESET');
    this.ads.next([]);
    this.adDetail.next(null);
    this.loaded.next(false);
  }

  public updateAd(ad: Ad): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.adApiService
        .update(ad)
        .toPromise()
        .then((savedAd: Ad) => {
          const newAds = [...this.ads.value];
          newAds.forEach((curAd: Ad, index: number) => {
            if (curAd.id === savedAd.id) {
              newAds.splice(index, 1, savedAd);
              return;
            }
          });
          this.ads.next(newAds);
          this.translationService
            .getTranslation('SUCCESS.UPDATING', { type: this.translations.ad })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(savedAd);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.UPDATING', { type: this.translations.ad })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          reject();
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public viewAdDetails(ad: Ad | string): void {
    if (typeof ad === 'string') {
      this.adApiService
        .get(ad)
        .toPromise()
        .then((retrievedAd: Ad) => {
          const newAds = [...this.ads.value];
          newAds.forEach((curAd: Ad, index: number) => {
            if (curAd.id === retrievedAd.id) {
              newAds.splice(index, 1, retrievedAd);
              return;
            }
          });
          this.adDetail.next(retrievedAd);
          this.ads.next(newAds);
        })
        .catch((err) => {
          console.error('WE ARE NEXTING NULL BECAUSE', err);
          this.adDetail.next(null);
        });
    } else {
      this.adDetail.next(ad);
    }
  }
}
