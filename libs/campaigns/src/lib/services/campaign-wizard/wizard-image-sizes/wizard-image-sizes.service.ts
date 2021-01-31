import { Injectable } from '@angular/core';
import {
  AdImage,
  AdsService,
  shareReplayRefCount,
  Sign,
  SignSchedulingState,
  SignSizes,
} from '@marketplace/core';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CampaignWizardService } from '../campaign-wizard.service';

export interface RatioInfo {
  surfaceArea: number;
  ratio: number;
}

export interface SizeMatch<T extends RatioInfo> {
  sign: Sign;
  sizeOrImage: T;
  score: number;
}

interface Matches<T> {
  good: T[];
  bad: T[];
}

export type ImageMatches = Matches<SizeMatch<AdImage & RatioInfo>>;
export type SizeMatches = Matches<SizeMatch<SignSizes & RatioInfo>>;

interface ResolutionInfo {
  width: number;
  height: number;
}

export interface MatchedItem<T> {
  image: T & RatioInfo;
  matches: Sign[];
}

const GOOD_MATCH_THRESHOLD = 0.1;

@Injectable()
export class WizardImageSizesService {
  public imageSignMatches$: Observable<ImageMatches>;
  public signSizes$: Observable<SignSizes[]>;
  public reducedSizes$: Observable<SignSizes[]>;
  public reducedMatches$: Observable<SizeMatches>;
  public unmatchedSigns$: Observable<Sign[]>;
  public missingMatches$: Observable<MatchedItem<SignSizes>[]>;

  constructor(
    private adService: AdsService,
    private campaignWizardService: CampaignWizardService
  ) {
    this.imageSignMatches$ = this.getImageSignMatches();
    this.signSizes$ = this.getSignSizes();
    this.reducedSizes$ = this.getReducedSizes();
    this.unmatchedSigns$ = this.getUnMatchedSigns();
    this.reducedMatches$ = this.getReducedMatches();
    this.missingMatches$ = this.getMissingMatches();
  }

  private getMissingMatches() {
    return this.reducedMatches$.pipe(
      map((sizeMatches) => {
        const grouped = _(sizeMatches.good)
          .groupBy(
            (match) => `${match.sizeOrImage.width}x${match.sizeOrImage.height}`
          )
          .value();

        return _(grouped)
          .map((matchesForSize) => ({
            image: matchesForSize[0].sizeOrImage,
            matches: matchesForSize.map((match) => match.sign),
          }))
          .value();
      }),
      shareReplayRefCount(1)
    );
  }

  private getUnMatchedSigns() {
    return this.imageSignMatches$.pipe(
      map((matches) => matches.bad.map((match) => match.sign))
    );
  }

  private getSignSizes() {
    return this.campaignWizardService.selectedSigns$.pipe(
      map((signs) =>
        _(signs)
          .filter((sign) => sign.enabled !== SignSchedulingState.DISABLED)
          .map((sign) => ({
            width: sign.width,
            height: sign.height,
            quantity: 0,
          }))
          .uniqBy((sign) => `${sign.width}x${sign.height}`)
          .orderBy(['width', 'height'], ['desc'])
          .value()
      ),
      shareReplayRefCount(1)
    );
  }

  private getReducedSizes() {
    return this.signSizes$.pipe(
      map((sizes) =>
        _(this.reduceSizes(sizes))
          .orderBy(['width', 'height'], ['desc'])
          .value()
      ),
      shareReplayRefCount(1)
    );
  }

  private getReducedMatches() {
    const imagesWithRatio = this.reducedSizes$.pipe(
      map((sizes) => sizes.map(this.addRatioInfo))
    );
    return combineLatest([imagesWithRatio, this.unmatchedSigns$]).pipe(
      map(([sizes, signs]) => {
        const matches = signs.map((sign) => ({
          sign,
          ...this.findBestImageFor(sizes, sign),
        }));
        return this.splitMatches(matches);
      }),
      shareReplayRefCount(1)
    );
  }

  private getImageSignMatches() {
    return combineLatest([
      this.getImagesWithRatioInfo(),
      this.campaignWizardService.selectedSigns$,
    ]).pipe(
      map(([images, campaignSigns]) => {
        const matches = campaignSigns.map((campaignSign) => ({
          sign: campaignSign,
          ...this.findBestImageFor(images, campaignSign),
        }));

        return this.splitMatches(matches);
      }),
      shareReplayRefCount(1)
    );
  }

  private splitMatches<T extends { score: number }>(matches: T[]) {
    const splitMatches = _(matches)
      .groupBy((match) =>
        match.score <= GOOD_MATCH_THRESHOLD ? 'good' : 'bad'
      )
      .value();
    return {
      good: splitMatches['good'] || [],
      bad: splitMatches['bad'] || [],
    };
  }

  private getImagesWithRatioInfo() {
    return this.adService.adDetail$.pipe(
      filter((ad) => ad != null),
      map((ad) =>
        ad.images.filter((image) => image.verified).map(this.addRatioInfo)
      )
    );
  }

  public addRatioInfo<T extends ResolutionInfo>(size: T): T & RatioInfo {
    return {
      ...size,
      surfaceArea: size.width * size.height,
      ratio: size.width / size.height,
    };
  }

  private hasSufficientResolution(image: RatioInfo, sign: Sign) {
    return image.surfaceArea >= sign.width * sign.height;
  }

  private findBestImageFor<T extends RatioInfo>(images: T[], sign: Sign) {
    const signRatio = Number(sign.width / sign.height);
    const scoredImages = images
      .filter((image) => this.hasSufficientResolution(image, sign))
      .map((image) => ({
        sizeOrImage: image,
        score: Math.abs(1 - signRatio / image.ratio),
      }))
      .sort((image1, image2) => image1.score - image2.score);
    return scoredImages.length > 0 ? scoredImages[0] : undefined;
  }

  /**
   * Calculate the minimum sizes necessary that contain other sizes within a 10% resize threshold
   * @param pickedSizes
   */
  private reduceSizes(pickedSizes: SignSizes[]) {
    if (pickedSizes.length <= 2) {
      return pickedSizes;
    }

    const largestSizes = {};
    for (const size of pickedSizes) {
      const ratio = Number((size.width / size.height).toFixed(2));
      const currentSurfaceArea = size.width * size.height;
      const item = {
        width: size.width,
        height: size.height,
        surfaceArea: currentSurfaceArea,
        ratio: ratio,
        min: Number((ratio - ratio * 0.1).toFixed(2)),
        max: Number((ratio + ratio * 0.1).toFixed(2)),
        inRange: [],
      };
      if (!(ratio in largestSizes)) {
        largestSizes[ratio] = item;
      } else if (largestSizes[ratio].surfaceArea < currentSurfaceArea) {
        largestSizes[ratio] = item;
      }
    }
    const ratioKeys = Object.keys(largestSizes)
      .map((k) => parseFloat(k))
      .sort();
    const updatedSizes = {};
    let primeCandidate = { ...largestSizes[ratioKeys[0]] };
    for (const ratio1 of ratioKeys) {
      const size1 = { ...largestSizes[ratio1] };
      for (const ratio2 of ratioKeys) {
        const size2 = largestSizes[ratio2];
        if (ratio2 >= size1.min && ratio2 <= size1.max) {
          size1.inRange.push(ratio2);
          if (size1.surfaceArea < size2.surfaceArea) {
            if (size2.height > size2.width) {
              size1.height = size2.height;
              size1.width = Math.round(size2.height * ratio1);
              size1.surfaceArea = size1.height * size1.width;
            } else {
              size1.width = size2.width;
              size1.height = Math.round(size2.width / ratio1);
              size1.surfaceArea = size1.height * size1.width;
            }
          }
        }
      }
      size1.inRange.sort();
      if (size1.inRange.length > primeCandidate.inRange.length) {
        primeCandidate = { ...size1 };
      }
      updatedSizes[ratio1] = size1;
    }

    function _reduce(keys, sizes, reduced) {
      let sliceIndex = null;
      let candidate = sizes[keys[0]];
      for (const ratio of keys.slice(1)) {
        const size = sizes[ratio];
        if (
          size.inRange.includes(keys[0]) &&
          size.surfaceArea > candidate.surfaceArea
        ) {
          candidate = size;
        } else {
          reduced.push({
            width: candidate.width,
            height: candidate.height,
            quantity: null,
          });
          const topInRange = candidate.inRange[candidate.inRange.length - 1];
          sliceIndex = keys.indexOf(topInRange) + 1;
          if (sliceIndex === 0 || sliceIndex >= keys.length - 1) {
            const finalCandidate = sizes[keys[keys.length - 1]];
            const finalItem = {
              width: finalCandidate.width,
              height: finalCandidate.height,
              quantity: null,
            };
            if (
              finalCandidate.inRange.includes(keys[0]) &&
              finalCandidate.surfaceArea > candidate.surfaceArea
            ) {
              reduced.pop();
              reduced.push(finalItem);
            } else if (!candidate.inRange.includes(finalCandidate.ratio)) {
              reduced.push(finalItem);
            }
            return reduced;
          }
          break;
        }
      }
      return _reduce(keys.slice(sliceIndex), sizes, reduced.slice());
    }
    const candidates = [
      {
        width: primeCandidate.width,
        height: primeCandidate.height,
        quantity: null,
      },
    ];
    const lowerIndex = ratioKeys.indexOf(primeCandidate.inRange[0]);
    let lowerReduction = [];
    if (lowerIndex !== 0) {
      if (ratioKeys.slice(0, lowerIndex).length > 1) {
        lowerReduction = _reduce(
          ratioKeys.slice(0, lowerIndex),
          updatedSizes,
          []
        );
      } else {
        const firstCandidate = updatedSizes[ratioKeys[0]];
        lowerReduction = [
          {
            width: firstCandidate.width,
            height: firstCandidate.height,
            quantity: null,
          },
        ];
      }
    }
    const upperIndex =
      ratioKeys.indexOf(
        primeCandidate.inRange[primeCandidate.inRange.length - 1]
      ) + 1;
    let upperReduction = [];
    if (upperIndex < ratioKeys.length && upperIndex > 0) {
      if (ratioKeys.slice(upperIndex).length > 1) {
        upperReduction = _reduce(ratioKeys.slice(upperIndex), updatedSizes, []);
      } else {
        const lastCandidate = updatedSizes[ratioKeys[ratioKeys.length - 1]];
        upperReduction = [
          {
            width: lastCandidate.width,
            height: lastCandidate.height,
            quantity: null,
          },
        ];
      }
    }

    return candidates
      .concat(lowerReduction, upperReduction)
      .sort((a, b) => a.width - b.width);
  }
}
