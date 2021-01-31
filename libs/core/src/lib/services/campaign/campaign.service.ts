import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CampaignApiService } from '../../api';
import { LoadingService } from '../loading/loading.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private _campaign: any = {};
  private campaign: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private campaignTranslation: string;

  public $campaign: Observable<any> = this.campaign.asObservable();

  constructor(
    private campaignApiService: CampaignApiService,
    private loadingService: LoadingService,
    private snackBar: SnackBarService,
    private translationService: TranslationService
  ) {
    this.translationService
      .getTranslation('CAMPAIGN.TEXT')
      .subscribe((text: string) => {
        this.campaignTranslation = text.toLowerCase();
      });
  }

  public getCampaignStats(
    orgId: string,
    campaignId: string
  ): Promise<Observable<any>> {
    return new Promise((resolve) => {
      if (!this._campaign[campaignId]) {
        this.campaign.next(null);
        this.loadingService.setLoading(true);
        this.campaignApiService
          .stats(orgId, campaignId)
          .toPromise()
          .then((campaign: any) => {
            this._campaign[campaignId] = campaign;
            this.campaign.next(this._campaign[campaignId]);
            resolve(this.$campaign);
          })
          .catch((error) => {
            this.translationService
              .getTranslation('ERROR.LOADING', {
                type: this.campaignTranslation,
              })
              .subscribe((text: string) => {
                this.snackBar.open(text);
              });
          })
          .then(() => {
            this.loadingService.setLoading(false);
          });
      } else {
        this.campaign.next(this._campaign[campaignId]);
        resolve(this.$campaign);
      }
    });
  }

  public reset() {
    this._campaign = {};
    this.campaign.next(null);
  }
}
