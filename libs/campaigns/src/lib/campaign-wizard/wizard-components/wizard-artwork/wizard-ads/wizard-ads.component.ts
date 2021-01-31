import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad, AdsService } from '@marketplace/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CampaignWizardService } from '../../../../services/campaign-wizard/campaign-wizard.service';
import { WizardImageSizesService } from '../../../../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';

@Component({
  selector: 'campaigns-wizard-ads',
  templateUrl: './wizard-ads.component.html',
  styleUrls: ['./wizard-ads.component.scss'],
})
export class WizardAdsComponent implements OnInit, OnDestroy {
  private adsSub: Subscription;
  private campaignAdsSub: Subscription;
  public ads: Ad[] = [];
  public selectedAdIds: string[] = [];

  constructor(
    private campaignWizardService: CampaignWizardService,
    private adsService: AdsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imageSizeService: WizardImageSizesService
  ) {}

  ngOnInit() {
    this.adsSub = this.adsService.ads$.subscribe((ads: Ad[]) => {
      this.ads = _.sortBy(ads, 'name');
    });
    this.campaignAdsSub = this.campaignWizardService.selectedAds$
      .pipe(map((ads) => _.map(ads, 'id')))
      .subscribe((selectedAdIds: string[]) => {
        this.selectedAdIds = selectedAdIds;
      });
  }

  ngOnDestroy() {
    this.adsSub.unsubscribe();
    this.campaignAdsSub.unsubscribe();
  }

  public async toggleAd(ad: Ad) {
    this.campaignWizardService.toggleAd(ad);
    this.adsService.viewAdDetails(ad);
    const missing = await this.imageSizeService.missingMatches$
      .pipe(
        take(1),
        map((matches) => matches.length)
      )
      .toPromise();
    if (missing > 0) {
      this.goToUpload(ad);
    }
  }

  public goToUpload(ad: Ad) {
    if (_.some(this.selectedAdIds, (id) => id === ad.id)) {
      this.router.navigate(['../upload'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          da: ad.id,
        },
      });
    }
  }
}
