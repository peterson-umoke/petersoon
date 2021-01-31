import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Ad,
  AdImage,
  AdsService,
  shareReplayRefCount,
  Sign,
  SignSizes,
  UploadService,
} from '@marketplace/core';
import * as _ from 'lodash';
import { combineLatest, merge, Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import {
  ImageMatches,
  MatchedItem,
  WizardImageSizesService,
} from '../../../../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';

declare type AdWithMatches = Ad & { matches: ImageMatches; adInput: string };

interface MatchStatistics {
  total: number;
  numMatched: number;
  numMissing: number;
}

@Component({
  selector: 'campaigns-wizard-ad-uploader',
  templateUrl: './wizard-ad-uploader.component.html',
  styleUrls: ['./wizard-ad-uploader.component.scss'],
})
export class WizardAdUploaderComponent implements OnInit {
  constructor(
    private wizardImageSizesService: WizardImageSizesService,
    private adService: AdsService,
    private route: ActivatedRoute,
    private uploadService: UploadService
  ) {}

  public ad$: Observable<AdWithMatches>;
  public goodMatches$: Observable<MatchedItem<AdImage>[]>;
  public unmatchedImages$: Observable<MatchedItem<AdImage>[]>;
  public missingMatches$: Observable<MatchedItem<SignSizes>[]>;
  public matchStatistics$: Observable<MatchStatistics>;

  ngOnInit() {
    this.ad$ = this.getAdWithMatches();
    this.goodMatches$ = this.getGoodSignMatches();
    this.missingMatches$ = this.wizardImageSizesService.missingMatches$;
    this.matchStatistics$ = this.getMatchStatistics();
    this.unmatchedImages$ = this.getNonMatchingImages();
  }

  private getAdWithMatches() {
    const adFromRoute$ = this.route.queryParams.pipe(
      pluck<Params, string>('da')
    ) as Observable<string>;

    const adsFromUploadUpdates$ = this.uploadService.imagesUploadedToAd$;
    const adIds = merge(adFromRoute$, adsFromUploadUpdates$);

    return adIds.pipe(
      filter((adId) => adId != null),
      switchMap((adId) => {
        this.adService.viewAdDetails(adId);
        return this.adService.adDetail$;
      }),
      filter((ad) => ad != null),
      switchMap((ad) => {
        return this.wizardImageSizesService.imageSignMatches$.pipe(
          map((matches) => ({ ...ad, matches, adInput: ad.name }))
        );
      }),
      shareReplayRefCount(1)
    );
  }

  private getGoodSignMatches() {
    return this.ad$.pipe(
      pluck<object, ImageMatches>('matches'),
      map((matches) => {
        const grouped = _(matches.good)
          .groupBy((match) => match.sizeOrImage.id)
          .value();
        return _(grouped)
          .map((matchesForImage) => ({
            image: matchesForImage[0].sizeOrImage,
            matches: matchesForImage.map((match) => match.sign),
          }))
          .value();
      }),
      shareReplayRefCount(1)
    );
  }
  private getNonMatchingImages() {
    return this.ad$.pipe(
      map((ad) => {
        const matchingImageIds = _(ad.matches.good)
          .map('sizeOrImage.id')
          .uniq();

        return ad.images
          .filter(
            (image) => !matchingImageIds.includes(image.id) && image.verified
          )
          .map((image) => ({
            image: this.wizardImageSizesService.addRatioInfo(image),
            matches: [] as Sign[],
          }));
      }),
      shareReplayRefCount(1)
    );
  }

  private getMatchStatistics() {
    const totalMissing$ = this.missingMatches$.pipe(
      map((matches) => _.sumBy(matches, (x) => x.matches.length))
    );
    const totalMatched$ = this.goodMatches$.pipe(
      map((matches) => _.sumBy(matches, (x) => x.matches.length))
    );

    return combineLatest([totalMissing$, totalMatched$]).pipe(
      map(([totalMissing, totalMatched]) => ({
        total: totalMissing + totalMatched,
        numMatched: totalMatched,
        numMissing: totalMissing,
      }))
    );
  }

  public async saveAdName(ad: AdWithMatches) {
    if (ad.name === ad.adInput) {
      return;
    }
    const updateAd = { ...ad };
    updateAd.matches = undefined;
    updateAd.name = ad.adInput;
    updateAd.adInput = undefined;

    const newAd = await this.adService.updateAd(updateAd);
    await this.adService.viewAdDetails(newAd);
  }
}
